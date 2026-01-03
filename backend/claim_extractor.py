"""
Claim Extractor Module
INPUT: String (user text)
OUTPUT: List[Dict] with claim, start_char, end_char
CONSTRAINT: Max 5 claims, must be factual
"""

import os
import json
import re
from typing import List, Dict
from dotenv import load_dotenv
from groq import AsyncGroq

# Load environment variables
load_dotenv()

# Initialize Groq client
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

EXTRACTION_PROMPT = """You are a claim extraction assistant. Extract COMPLETE factual statements that can be verified or disproven.

EXTRACT COMPLETE CLAIMS, NOT INDIVIDUAL ENTITIES!

Examples of GOOD claims:
✓ "Albert Einstein discovered penicillin in 1928" (complete action with subject + verb + object + time)
✓ "The moon is made of green cheese" (False but verifiable claim)
✓ "Humans can breathe underwater" (False but verifiable claim)
✓ "The Eiffel Tower was completed in 1889" (complete statement about an event)

Examples of BAD claims (DO NOT extract these):
✗ "Albert Einstein" (just a name, not a claim)
✗ "1928" (just a date, not a claim)
✗ "NASA" (just an organization name, not a claim)
✗ "discovered penicillin" (incomplete, missing subject)

RULES:
1. Extract COMPLETE sentences or clauses that make verifiable factual assertions
2. Each claim must have a subject, verb, and assertion (who/what did/is what)
3. Include relevant context (when, where, how) in the claim
4. Claims should be specific enough to verify against sources
5. Maximum 5 claims
6. Do NOT extract individual names, dates, or entities by themselves

TEXT TO ANALYZE:
{text}

Return a JSON array with objects containing ONLY the key: "claim".
Example: [{{"claim": "The sky is blue"}}, {{"claim": "Water is wet"}}]

Return ONLY valid JSON array, no other text."""


async def extract_claims(text: str) -> List[Dict]:
    """
    Extract factual claims from text using Groq LLM.
    
    Args:
        text: The input text to analyze
        
    Returns:
        List of dicts with claim, start_char, end_char
    """
    if not text.strip():
        return []
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": EXTRACTION_PROMPT.format(text=text)
                }
            ],
            temperature=0.1,
            max_tokens=1024
        )
        
        content = response.choices[0].message.content.strip()
        
        # Parse JSON from response
        # Try to extract JSON array from the response
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            claims = json.loads(json_match.group())
        else:
            claims = json.loads(content)
        
        # Validate claims - ensure they exist in the original text
        validated_claims = []
        for claim in claims[:5]:  # Max 5 claims
            claim_text = claim.get("claim", "")
            
            # Search for the claim in the text to find indices
            # We do this in Python now instead of asking the LLM
            start = -1
            end = -1
            
            found_pos = text.find(claim_text)
            if found_pos != -1:
                start = found_pos
                end = found_pos + len(claim_text)
            
            validated_claims.append({
                "claim": claim_text,
                "start_char": start,
                "end_char": end
            })
        
        return validated_claims
        
    except json.JSONDecodeError:
        # If JSON parsing fails, return empty list
        return []
    except Exception as e:
        print(f"Error extracting claims: {e}")
        return []
