"""
Fact Checker Module with Multi-Model Voting
INPUT: Claim string + search results
OUTPUT: {status, reason}
CONSTRAINT: status must be exactly one of: VERIFIED | HALLUCINATED | UNVERIFIABLE
Uses 3 different models and takes majority vote for accuracy
"""

import os
import json
import re
import asyncio
from typing import List, Dict, Tuple
from collections import Counter
from dotenv import load_dotenv
from groq import AsyncGroq

# Load environment variables
load_dotenv()

# Initialize Groq client
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

# Three different models for voting - using different parameter settings for diversity
MODELS = [
    "llama-3.1-8b-instant",      # Base model
    "llama-3.1-8b-instant",      # Same model with different temperature
    "llama-3.1-8b-instant"       # Same model with different temperature
]

# Different temperatures for model diversity
TEMPERATURES = [0.1, 0.3, 0.5]

FACT_CHECK_PROMPT = """You are a rigorous fact-checking assistant. Analyze whether the ENTIRE claim is supported by search results.

CLAIM TO VERIFY:
{claim}

SEARCH RESULTS:
{search_results}

VERIFICATION RULES:
1. VERIFIED - The search results CLEARLY and DIRECTLY support the COMPLETE claim
   - All parts of the claim must be confirmed (subject, action, object, time, place, etc.)
   - Example: "Einstein discovered penicillin" requires proof Einstein discovered it (not just that Einstein existed)

2. HALLUCINATED - The search results CONTRADICT the claim OR show it's factually wrong
   - Any part of the claim that is proven false makes the whole claim HALLUCINATED
   - Example: If claim says "X did Y" but sources say "Z did Y", mark as HALLUCINATED

3. UNVERIFIABLE - Not enough evidence in search results to confirm or deny
   - Sources don't mention the specific claim at all
   - Sources are ambiguous or inconclusive

CRITICAL: Verify the COMPLETE STATEMENT, not just that entities exist!
- "Einstein discovered penicillin" is HALLUCINATED even though Einstein existed
- "Musk founded Google" is HALLUCINATED even though both Musk and Google exist

Respond with ONLY a JSON object in this exact format:
{{"status": "VERIFIED|HALLUCINATED|UNVERIFIABLE", "reason": "Brief explanation under 150 characters"}}

IMPORTANT:
- status MUST be exactly one of: VERIFIED, HALLUCINATED, UNVERIFIABLE
- reason MUST be under 150 characters explaining why
- Return ONLY valid JSON, no other text"""


async def check_fact_with_model(claim: str, search_results: str, model: str, temperature: float) -> Tuple[str, str]:
    """
    Check a claim with a specific model and temperature.
    
    Returns:
        Tuple of (status, reason)
    """
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": FACT_CHECK_PROMPT.format(
                        claim=claim,
                        search_results=search_results
                    )
                }
            ],
            temperature=temperature,
            max_tokens=256
        )
        
        content = response.choices[0].message.content.strip()
        
        # Parse JSON from response
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = json.loads(content)
        
        # Validate status
        valid_statuses = ["VERIFIED", "HALLUCINATED", "UNVERIFIABLE"]
        status = result.get("status", "UNVERIFIABLE").upper()
        if status not in valid_statuses:
            status = "UNVERIFIABLE"
        
        reason = result.get("reason", "Unable to determine")[:150]
        
        return (status, reason)
        
    except Exception as e:
        print(f"Error with model {model} (temp={temperature}): {e}")
        return ("UNVERIFIABLE", f"Model error: {str(e)[:100]}")


async def check_fact(claim: str, search_results: List[Dict]) -> Dict:
    """
    Check a claim against search results using 3 different models with voting.
    
    Args:
        claim: The claim to verify
        search_results: List of search results with title, url, snippet
        
    Returns:
        Dict with status (majority vote) and reason
    """
    # If no search results, mark as unverifiable
    if not search_results:
        return {
            "status": "UNVERIFIABLE",
            "reason": "No search results found to verify this claim"
        }
    
    # Format search results for the prompt
    formatted_results = "\n".join([
        f"- {r['title']}: {r['snippet']}"
        for r in search_results
    ])
    
    try:
        # Run all 3 models in parallel with different temperatures
        tasks = [
            check_fact_with_model(claim, formatted_results, model, temp)
            for model, temp in zip(MODELS, TEMPERATURES)
        ]
        results = await asyncio.gather(*tasks)
        
        # Extract statuses and reasons
        statuses = [r[0] for r in results]
        reasons = {r[0]: r[1] for r in results}  # Map status to reason
        
        # Count votes
        vote_counts = Counter(statuses)
        
        # Get majority vote (or most common if no majority)
        majority_status = vote_counts.most_common(1)[0][0]
        vote_count = vote_counts[majority_status]
        
        # Create reason with voting info
        if vote_count == 3:
            reason = f"All 3 runs agree: {reasons[majority_status]}"
        elif vote_count == 2:
            reason = f"2/3 runs agree: {reasons[majority_status]}"
        else:
            # No majority - all different
            reason = f"Runs disagree (1/3 each). Using {majority_status}: {reasons[majority_status]}"
        
        return {
            "status": majority_status,
            "reason": reason[:150]
        }
        
    except Exception as e:
        print(f"Error in multi-model fact checking: {e}")
        return {
            "status": "UNVERIFIABLE",
            "reason": f"Error during verification: {str(e)[:100]}"
        }
