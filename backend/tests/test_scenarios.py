import pytest
from unittest.mock import patch, AsyncMock

# ==========================================
# TEST DATA: CLAIMS (25 Cases)
# ==========================================
CLAIM_TEST_CASES = [
    # --- Standard Valid Cases ---
    {
        "input": "The sky is blue.",
        "mock_claims": [{"claim": "The sky is blue", "start_char": 0, "end_char": 15}],
        "mock_status": "VERIFIED",
        "desc": "Simple true claim"
    },
    {
        "input": "Water boils at 100 degrees Celsius.",
        "mock_claims": [{"claim": "Water boils at 100 degrees Celsius", "start_char": 0, "end_char": 35}],
        "mock_status": "VERIFIED",
        "desc": "Scientific fact"
    },
    {
        "input": "The earth is flat.",
        "mock_claims": [{"claim": "The earth is flat", "start_char": 0, "end_char": 17}],
        "mock_status": "HALLUCINATED",
        "desc": "Common conspiracy theory"
    },
    {
        "input": "Python was released in 1991.",
        "mock_claims": [{"claim": "Python was released in 1991", "start_char": 0, "end_char": 28}],
        "mock_status": "VERIFIED",
        "desc": "Historical fact"
    },
    {
        "input": "Humans have 3 hearts.",
        "mock_claims": [{"claim": "Humans have 3 hearts", "start_char": 0, "end_char": 20}],
        "mock_status": "HALLUCINATED",
        "desc": "Biological falsehood"
    },
    
    # --- Edge Cases: Input Formatting ---
    {
        "input": "   The sun is hot.   ",
        "mock_claims": [{"claim": "The sun is hot", "start_char": 3, "end_char": 17}],
        "mock_status": "VERIFIED",
        "desc": "Leading/trailing whitespace"
    },
    {
        "input": "E=mc^2 is a famous equation.",
        "mock_claims": [{"claim": "E=mc^2 is a famous equation", "start_char": 0, "end_char": 27}],
        "mock_status": "VERIFIED",
        "desc": "Special characters"
    },
    {
        "input": "I ❤️ coding.",
        "mock_claims": [{"claim": "I love coding", "start_char": -1, "end_char": -1}], # AI might normalize emoji
        "mock_status": "UNVERIFIABLE",
        "desc": "Emojis in text"
    },
    {
        "input": "1234567890",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "Numbers only (No claims)"
    },
    {
        "input": "The quick brown fox jumps over the lazy dog.",
        "mock_claims": [{"claim": "The quick brown fox jumps over the lazy dog", "start_char": 0, "end_char": 44}],
        "mock_status": "UNVERIFIABLE",
        "desc": "Pangram/Nonsense"
    },

    # --- Edge Cases: Logic/Content ---
    {
        "input": "Is the sky blue?",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "Question (Should extract no claims)"
    },
    {
        "input": "Do your homework!",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "Imperative command"
    },
    {
        "input": "I think pizza is the best food.",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "Opinion"
    },
    {
        "input": "This statement is false.",
        "mock_claims": [{"claim": "This statement is false", "start_char": 0, "end_char": 23}],
        "mock_status": "UNVERIFIABLE",
        "desc": "Paradox"
    },
    {
        "input": "According to a study, coffee is good.",
        "mock_claims": [{"claim": "Coffee is good", "start_char": 22, "end_char": 36}],
        "mock_status": "VERIFIED", # Context dependent
        "desc": "Vague citation"
    },

    # --- Complex/Multi-sentence ---
    {
        "input": "Paris is in France. London is in UK.",
        "mock_claims": [
            {"claim": "Paris is in France", "start_char": 0, "end_char": 18},
            {"claim": "London is in UK", "start_char": 20, "end_char": 35}
        ],
        "mock_status": "VERIFIED",
        "desc": "Multiple claims"
    },
    {
        "input": "The moon is cheese. The sun is cold.",
        "mock_claims": [
            {"claim": "The moon is cheese", "start_char": 0, "end_char": 18},
            {"claim": "The sun is cold", "start_char": 20, "end_char": 35}
        ],
        "mock_status": "HALLUCINATED",
        "desc": "Multiple false claims"
    },
    
    # --- Language/Encoding ---
    {
        "input": "El agua hierve a 100 grados.",
        "mock_claims": [{"claim": "El agua hierve a 100 grados", "start_char": 0, "end_char": 27}],
        "mock_status": "VERIFIED",
        "desc": "Spanish text"
    },
    {
        "input": "こんにちは",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "Japanese greeting (No claim)"
    },
    {
        "input": "The price is $100.",
        "mock_claims": [{"claim": "The price is $100", "start_char": 0, "end_char": 17}],
        "mock_status": "UNVERIFIABLE",
        "desc": "Specific fact without context"
    },

    # --- Long/Stress Tests ---
    {
        "input": "A" * 1000,
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "Very long nonsense string"
    },
    {
        "input": "Fact 1. Fact 2. Fact 3. Fact 4. Fact 5. Fact 6.",
        "mock_claims": [
            {"claim": "Fact 1", "start_char": 0, "end_char": 6},
            {"claim": "Fact 2", "start_char": 8, "end_char": 14},
            {"claim": "Fact 3", "start_char": 16, "end_char": 22},
            {"claim": "Fact 4", "start_char": 24, "end_char": 30},
            {"claim": "Fact 5", "start_char": 32, "end_char": 38}
        ],
        "mock_status": "UNVERIFIABLE",
        "desc": "Max claims limit (5)"
    },
    {
        "input": "null",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "String 'null'"
    },
    {
        "input": "undefined",
        "mock_claims": [],
        "mock_status": "N/A",
        "desc": "String 'undefined'"
    },
    {
        "input": "<b>HTML Content</b>",
        "mock_claims": [{"claim": "HTML Content", "start_char": 3, "end_char": 15}],
        "mock_status": "UNVERIFIABLE",
        "desc": "HTML tags"
    }
]

# ==========================================
# TEST DATA: CITATIONS (25 Cases)
# ==========================================
CITATION_TEST_CASES = [
    # --- Standard Valid Cases ---
    {
        "input": "Vaswani, A. (2017). Attention is all you need.",
        "mock_citation": {"raw_citation": "Vaswani, A. (2017). Attention is all you need.", "title": "Attention is all you need"},
        "mock_status": "VERIFIED",
        "desc": "Standard APA style"
    },
    {
        "input": "He, K. et al. (2016). Deep Residual Learning.",
        "mock_citation": {"raw_citation": "He, K. et al. (2016). Deep Residual Learning.", "title": "Deep Residual Learning"},
        "mock_status": "VERIFIED",
        "desc": "Et al citation"
    },
    {
        "input": "[1] LeCun, Y. (2015). Deep Learning.",
        "mock_citation": {"raw_citation": "[1] LeCun, Y. (2015). Deep Learning.", "title": "Deep Learning"},
        "mock_status": "VERIFIED",
        "desc": "Numbered citation"
    },
    {
        "input": "Einstein, A. (1905). On the Electrodynamics of Moving Bodies.",
        "mock_citation": {"raw_citation": "Einstein, A. (1905). On the Electrodynamics of Moving Bodies.", "title": "On the Electrodynamics of Moving Bodies"},
        "mock_status": "VERIFIED",
        "desc": "Classic paper"
    },
    {
        "input": "Turing, A.M. (1950). Computing Machinery and Intelligence.",
        "mock_citation": {"raw_citation": "Turing, A.M. (1950). Computing Machinery and Intelligence.", "title": "Computing Machinery and Intelligence"},
        "mock_status": "VERIFIED",
        "desc": "Another classic"
    },

    # --- Standard Invalid Cases ---
    {
        "input": "Fake Author (2024). This Paper Does Not Exist.",
        "mock_citation": {"raw_citation": "Fake Author (2024). This Paper Does Not Exist.", "title": "This Paper Does Not Exist"},
        "mock_status": "HALLUCINATED",
        "desc": "Non-existent paper"
    },
    {
        "input": "Vaswani (2010). Attention is all you need.",
        "mock_citation": {"raw_citation": "Vaswani (2010). Attention is all you need.", "title": "Attention is all you need"},
        "mock_status": "HALLUCINATED",
        "desc": "Wrong year"
    },
    {
        "input": "Smith (2017). Attention is all you need.",
        "mock_citation": {"raw_citation": "Smith (2017). Attention is all you need.", "title": "Attention is all you need"},
        "mock_status": "HALLUCINATED",
        "desc": "Wrong author"
    },
    {
        "input": "Deep Learning (2000).",
        "mock_citation": {"raw_citation": "Deep Learning (2000).", "title": "Deep Learning"},
        "mock_status": "HALLUCINATED",
        "desc": "Wrong year for famous paper"
    },
    {
        "input": "GPT-4 Technical Report (2018).",
        "mock_citation": {"raw_citation": "GPT-4 Technical Report (2018).", "title": "GPT-4 Technical Report"},
        "mock_status": "HALLUCINATED",
        "desc": "Anachronism"
    },

    # --- Edge Cases: Formatting ---
    {
        "input": "Attention is all you need",
        "mock_citation": {"raw_citation": "Attention is all you need", "title": "Attention is all you need"},
        "mock_status": "VERIFIED",
        "desc": "Title only"
    },
    {
        "input": "doi:10.1038/nature12345",
        "mock_citation": {"raw_citation": "doi:10.1038/nature12345", "title": "Nature Paper"},
        "mock_status": "VERIFIED",
        "desc": "DOI only"
    },
    {
        "input": "https://arxiv.org/abs/1706.03762",
        "mock_citation": {"raw_citation": "https://arxiv.org/abs/1706.03762", "title": "Attention is all you need"},
        "mock_status": "VERIFIED",
        "desc": "URL only"
    },
    {
        "input": "   Vaswani (2017)   ",
        "mock_citation": {"raw_citation": "Vaswani (2017)", "title": "Unknown"},
        "mock_status": "VERIFIED",
        "desc": "Whitespace padding"
    },
    {
        "input": "AUTHOR (YEAR). TITLE.",
        "mock_citation": {"raw_citation": "AUTHOR (YEAR). TITLE.", "title": "TITLE"},
        "mock_status": "UNVERIFIABLE",
        "desc": "All caps generic"
    },

    # --- Edge Cases: Logic ---
    {
        "input": "Smith (2050). Future Paper.",
        "mock_citation": {"raw_citation": "Smith (2050). Future Paper.", "title": "Future Paper"},
        "mock_status": "HALLUCINATED",
        "desc": "Future year"
    },
    {
        "input": "Unknown (1000). Ancient Scroll.",
        "mock_citation": {"raw_citation": "Unknown (1000). Ancient Scroll.", "title": "Ancient Scroll"},
        "mock_status": "UNVERIFIABLE",
        "desc": "Very old year"
    },
    {
        "input": "Self (2023). My Diary.",
        "mock_citation": {"raw_citation": "Self (2023). My Diary.", "title": "My Diary"},
        "mock_status": "UNVERIFIABLE",
        "desc": "Personal document"
    },
    {
        "input": "Confidential Report (2023).",
        "mock_citation": {"raw_citation": "Confidential Report (2023).", "title": "Confidential Report"},
        "mock_status": "UNVERIFIABLE",
        "desc": "Private document"
    },
    {
        "input": "Draft v2 (2023).",
        "mock_citation": {"raw_citation": "Draft v2 (2023).", "title": "Draft v2"},
        "mock_status": "UNVERIFIABLE",
        "desc": "Draft paper"
    },

    # --- Complex/Messy ---
    {
        "input": "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need.",
        "mock_citation": {"raw_citation": "Vaswani... (2017)", "title": "Attention is all you need"},
        "mock_status": "VERIFIED",
        "desc": "Many authors"
    },
    {
        "input": "Paper with emoji 📄 (2023).",
        "mock_citation": {"raw_citation": "Paper with emoji 📄 (2023).", "title": "Paper with emoji"},
        "mock_status": "VERIFIED",
        "desc": "Emoji in citation"
    },
    {
        "input": "In Proc. CVPR 2016.",
        "mock_citation": {"raw_citation": "In Proc. CVPR 2016.", "title": "Unknown"},
        "mock_status": "UNVERIFIABLE",
        "desc": "Venue only"
    },
    {
        "input": "See also: Vaswani (2017).",
        "mock_citation": {"raw_citation": "See also: Vaswani (2017).", "title": "Unknown"},
        "mock_status": "VERIFIED",
        "desc": "Contextual text"
    },
    {
        "input": "1. Author (Year). 2. Author (Year).",
        "mock_citation": {"raw_citation": "1. Author (Year).", "title": "Unknown"},
        "mock_status": "UNVERIFIABLE",
        "desc": "Multiple citations (should pick first or handle list)"
    }
]

@pytest.mark.parametrize("test_case", CLAIM_TEST_CASES)
def test_verify_claims_scenarios(client, test_case):
    """
    Test the /verify endpoint with 25 different scenarios.
    Mocks the internal components to simulate expected behavior for each case.
    """
    input_text = test_case["input"]
    mock_claims = test_case["mock_claims"]
    mock_status = test_case["mock_status"]
    
    # Setup the mock return values
    with patch("main.extract_claims", new_callable=AsyncMock) as mock_extract:
        with patch("main.search_web", new_callable=AsyncMock) as mock_search:
            with patch("main.check_fact", new_callable=AsyncMock) as mock_check:
                
                mock_extract.return_value = mock_claims
                
                # If claims are found, we need to mock the verification result for each
                if mock_claims:
                    mock_search.return_value = [{"title": "Source", "url": "http://test.com", "snippet": "Test snippet"}]
                    mock_check.return_value = {
                        "status": mock_status,
                        "reason": "Automated test reason",
                        "sources": [{"title": "Source", "url": "http://test.com"}]
                    }
                
                response = client.post("/verify", json={"text": input_text})
                
                assert response.status_code == 200
                data = response.json()
                
                if not mock_claims:
                    assert len(data["results"]) == 0
                else:
                    assert len(data["results"]) == len(mock_claims)
                    # Check that the status matches what we mocked
                    # (This confirms the API is correctly passing the status through)
                    assert data["results"][0]["status"] == mock_status

@pytest.mark.parametrize("test_case", CITATION_TEST_CASES)
def test_verify_citations_scenarios(client, test_case):
    """
    Test the /verify-citations endpoint with 25 different scenarios.
    """
    input_text = test_case["input"]
    mock_citation = test_case["mock_citation"]
    mock_status = test_case["mock_status"]
    
    with patch("main.extract_citations", new_callable=AsyncMock) as mock_extract:
        with patch("main.verify_citation", new_callable=AsyncMock) as mock_verify:
            
            # We assume extract_citations returns a list containing our mock citation
            mock_extract.return_value = [mock_citation]
            
            mock_verify.return_value = {
                "status": mock_status,
                "errors": [],
                "reason": "Automated test reason",
                "sources": [{"title": "Source", "url": "http://test.com"}]
            }
            
            response = client.post("/verify-citations", json={"text": input_text})
            
            assert response.status_code == 200
            data = response.json()
            
            assert len(data["results"]) >= 1
            assert data["results"][0]["status"] == mock_status
