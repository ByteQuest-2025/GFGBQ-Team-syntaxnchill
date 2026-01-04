"""
FastAPI Backend for AI Hallucination Detector
Endpoints: POST /verify, POST /verify-citations, GET /health, GET /docs
"""

import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from claim_extractor import extract_claims
from search_module import search_web, search_for_citation
from fact_checker import check_fact
from citation_checker import extract_citations, verify_citation

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Hallucination Detector",
    description="Detects hallucinations and verifies claims and citations in real-time",
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


# Citation verification models
class CitationResult(BaseModel):
    raw_citation: str
    authors: Optional[str] = None
    year: Optional[str] = None
    title: Optional[str] = None
    venue: Optional[str] = None
    pages: Optional[str] = None
    status: str  # VERIFIED | HALLUCINATED | UNVERIFIABLE
    errors: List[str]
    reason: str
    sources: List[Dict[str, str]]


class CitationVerifyResponse(BaseModel):
    results: List[CitationResult]


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
    
    if len(request.text) > 200:
        raise HTTPException(status_code=400, detail="Text exceeds 200 character limit")
    
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


@app.post("/verify-citations", response_model=CitationVerifyResponse)
async def verify_citations(request: VerifyRequest):
    """
    Citation verification endpoint: Extract citations and verify each one.
    Checks author, year, title, venue, and page numbers for accuracy.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 200:
        raise HTTPException(status_code=400, detail="Text exceeds 200 character limit")
    
    try:
        # Step 1: Extract citations from text
        print(f"Extracting citations from text...")
        citations = await extract_citations(request.text)
        
        if not citations:
            return CitationVerifyResponse(results=[])
        
        print(f"Found {len(citations)} citations")
        
        # Step 2 & 3: For each citation, search and verify
        results = []
        for i, citation in enumerate(citations):
            print(f"Processing citation {i+1}/{len(citations)}: {citation.get('title', 'Unknown')[:50]}...")
            
            try:
                # Search for citation evidence
                search_query = f"{citation.get('authors', '')} {citation.get('year', '')} {citation.get('title', '')}"
                search_results = await search_for_citation(search_query)
                print(f"  Found {len(search_results)} search results")
                
                # Verify the citation
                verification = await verify_citation(citation, search_results)
                print(f"  Status: {verification['status']}")
                
                results.append(CitationResult(
                    raw_citation=citation.get("raw_citation", ""),
                    authors=citation.get("authors"),
                    year=citation.get("year"),
                    title=citation.get("title"),
                    venue=citation.get("venue"),
                    pages=citation.get("pages"),
                    status=verification["status"],
                    errors=verification.get("errors", []),
                    reason=verification["reason"],
                    sources=search_results
                ))
                
                # Rate limit protection
                await asyncio.sleep(0.3)
                
            except Exception as e:
                print(f"  Error processing citation: {e}")
                results.append(CitationResult(
                    raw_citation=citation.get("raw_citation", ""),
                    authors=citation.get("authors"),
                    year=citation.get("year"),
                    title=citation.get("title"),
                    venue=citation.get("venue"),
                    pages=citation.get("pages"),
                    status="UNVERIFIABLE",
                    errors=[],
                    reason=f"Error: {str(e)[:100]}",
                    sources=[]
                ))
        
        return CitationVerifyResponse(results=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
