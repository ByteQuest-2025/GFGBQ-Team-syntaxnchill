# Backend Tests

This directory contains tests for the backend API.

## Running Tests

1. Ensure you have the dependencies installed:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the tests using `pytest`:
   ```bash
   pytest
   ```

## Test Structure

- `conftest.py`: Sets up the test client and fixtures.
- `test_api.py`: Contains functional tests for the API endpoints. It uses **mocking** to simulate the AI and Search components, ensuring tests are fast, reliable, and don't cost money/tokens.

## Testing for Accuracy (Integration Tests)

To test the *accuracy* of the AI (i.e., does it correctly identify "The sky is green" as False?), you need to run tests against the real API without mocks.

You can create a new file `test_accuracy.py` and use the `client` fixture without patching `extract_claims` etc.

Example:

```python
def test_real_verification(client):
    response = client.post("/verify", json={"text": "The earth is flat."})
    assert response.status_code == 200
    results = response.json()["results"]
    # Check if the AI correctly identified it as hallucinated/false
    # Note: This consumes API credits and is slower
    assert any(r["status"] == "HALLUCINATED" for r in results)
```
