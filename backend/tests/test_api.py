import pytest
from unittest.mock import patch, AsyncMock

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_verify_empty_text(client):
    response = client.post("/verify", json={"text": ""})
    # The endpoint raises HTTPException 400 for empty text
    assert response.status_code == 400
    assert "Text cannot be empty" in response.json()["detail"]

def test_verify_no_claims_found(client):
    # Mock extract_claims to return empty list
    with patch("main.extract_claims", new_callable=AsyncMock) as mock_extract:
        mock_extract.return_value = []
        
        response = client.post("/verify", json={"text": "Some random text"})
        
        assert response.status_code == 200
        assert response.json() == {"results": []}

def test_verify_success_flow(client):
    # Mock the entire pipeline
    mock_claim = {
        "claim": "The sky is blue",
        "start_char": 0,
        "end_char": 15
    }
    
    mock_search_results = [{"title": "Sky Color", "url": "http://example.com", "snippet": "The sky is blue due to scattering."}]
    
    mock_verification = {
        "status": "VERIFIED",
        "reason": "Confirmed by sources",
        "sources": [{"title": "Sky Color", "url": "http://example.com"}]
    }

    with patch("main.extract_claims", new_callable=AsyncMock) as mock_extract:
        with patch("main.search_web", new_callable=AsyncMock) as mock_search:
            with patch("main.check_fact", new_callable=AsyncMock) as mock_check:
                
                mock_extract.return_value = [mock_claim]
                mock_search.return_value = mock_search_results
                mock_check.return_value = mock_verification
                
                response = client.post("/verify", json={"text": "The sky is blue"})
                
                assert response.status_code == 200
                data = response.json()
                assert len(data["results"]) == 1
                assert data["results"][0]["claim"] == "The sky is blue"
                assert data["results"][0]["status"] == "VERIFIED"

def test_verify_citations_empty(client):
    response = client.post("/verify-citations", json={"text": ""})
    assert response.status_code == 400

def test_verify_citations_success_flow(client):
    mock_citation = {
        "raw_citation": "Doe, J. (2020). Test.",
        "authors": "Doe, J.",
        "year": "2020",
        "title": "Test",
        "venue": "Journal",
        "pages": "1-10"
    }
    
    mock_verification = {
        "status": "VERIFIED",
        "errors": [],
        "reason": "Found exact match",
        "sources": [{"title": "Source", "url": "http://example.com"}]
    }

    with patch("main.extract_citations", new_callable=AsyncMock) as mock_extract:
        with patch("main.verify_citation", new_callable=AsyncMock) as mock_verify:
            
            mock_extract.return_value = [mock_citation]
            mock_verify.return_value = mock_verification
            
            response = client.post("/verify-citations", json={"text": "Doe, J. (2020). Test."})
            
            assert response.status_code == 200
            data = response.json()
            assert len(data["results"]) == 1
            assert data["results"][0]["raw_citation"] == "Doe, J. (2020). Test."
            assert data["results"][0]["status"] == "VERIFIED"

