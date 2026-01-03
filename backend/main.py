"""
FastAPI Backend for AI Hallucination Detector
Endpoints: POST /verify, GET /health, GET /docs
"""

import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

from claim_extractor import extract_claims
from search_module import search_web
from fact_checker import check_fact

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Hallucination Detector",
    description="Detects hallucinations and verifies claims in real-time",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VerifyRequest(BaseModel):
    text: str


class ClaimResult(BaseModel):
    claim: str
    start_char: int
    end_char: int
    status: str  # VERIFIED | HALLUCINATED | UNVERIFIABLE
    reason: str
    sources: List[Dict[str, str]]


class VerifyResponse(BaseModel):
    results: List[ClaimResult]


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/verify", response_model=VerifyResponse)
async def verify_text(request: VerifyRequest):
    """
    Main endpoint: Extract claims, search web, and verify each claim.
    Returns verification status with sources for each claim.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Step 1: Extract claims (max 5)
        claims = await extract_claims(request.text)
        
        if not claims:
            return VerifyResponse(results=[])
        
        # Step 2 & 3: For each claim, search and verify (with rate limit protection)
        results = []
        for claim_data in claims:
            # Search the web for evidence
            search_results = await search_web(claim_data["claim"])
            
            # Check the claim against search results
            verification = await check_fact(claim_data["claim"], search_results)
            
            results.append(ClaimResult(
                claim=claim_data["claim"],
                start_char=claim_data["start_char"],
                end_char=claim_data["end_char"],
                status=verification["status"],
                reason=verification["reason"],
                sources=search_results
            ))
            
            # Rate limit protection (0.5s between Groq calls)
            await asyncio.sleep(0.5)
        
        return VerifyResponse(results=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
