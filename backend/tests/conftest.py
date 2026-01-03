import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the parent directory to sys.path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
