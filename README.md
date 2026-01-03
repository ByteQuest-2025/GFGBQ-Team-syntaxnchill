# AI Hallucination and Citation Verification System

> **Problem Statement 3:** AI Hallucination and Citation Verification System  
> **Team Name:** SyntaxNChill  
> **Team Members:** Mitul Sheth and Priyanshu Makwana

## 📖 Overview

This project is a robust system designed to detect AI hallucinations and verify citations in generated text. As Large Language Models (LLMs) become more prevalent, ensuring the factual accuracy of their output is critical. Our solution analyzes text to extract factual claims and citations, cross-references them with real-time web search results, and provides a verification status (Verified, Hallucinated, or Unverifiable) along with credible sources.

## ✨ Key Features

- **Real-time Claim Verification**: Extracts factual claims from text and verifies them against live web search results.
- **Citation Checking**: Identifies academic or web citations and validates their existence and relevance.
- **Hallucination Detection**: Flags statements that contradict established facts or lack evidence.
- **Interactive UI**: A clean, modular Next.js frontend for easy text input and result visualization.
- **Detailed Analysis**: Provides reasoning and source links for every verification result.
- **Robust Backend**: FastAPI-powered backend with asynchronous processing for high performance.
- **Comprehensive Testing**: Includes a suite of 50+ test scenarios covering edge cases, multi-language support, and complex logic.

## 🏗️ Architecture

The system follows a microservices-inspired architecture:

```
INPUT → Extraction (Claims & Citations) → Web Search → Verification → OUTPUT
                       ↓                       ↓             ↓
                 Groq LLM / Regex      SerpAPI/DuckDuckGo  Groq LLM
```

**Pipeline Flow:**
1. **Input**: User submits text via the Frontend.
2. **Extraction**: Backend uses LLM to identify discrete factual claims or citations.
3. **Search**: The system performs targeted web searches for each extracted item.
4. **Verification**: An LLM compares the claim/citation against the search results to determine accuracy.
5. **Output**: Results are aggregated and displayed to the user with status indicators and sources.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deployment**: Netlify (Static Export)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI Model**: Groq API (Llama 3.1 70B/8B)
- **Search**: DuckDuckGo Search / SerpAPI
- **Testing**: Pytest, Pytest-Asyncio

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Groq API Key (Get one at [console.groq.com](https://console.groq.com))

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure Environment Variables:
Create a `.env` file in the `backend` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
# Optional: SERP_API_KEY=your_serp_api_key
```

Run the server:
```bash
python main.py
```
*The backend will start at `http://localhost:8000`*

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
# or
yarn install
```

Run the development server:
```bash
npm run dev
```
*The frontend will start at `http://localhost:3000`*

## 🧪 Running Tests

The project includes a comprehensive test suite located in `backend/tests`.

To run all tests:
```bash
cd backend
# Ensure venv is active
pytest
```

To run specific scenario tests (50+ cases):
```bash
pytest tests/test_scenarios.py
```

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── claim_extractor.py      # Logic for extracting claims
│   ├── citation_checker.py     # Logic for verifying citations
│   ├── search_module.py        # Web search integration
│   ├── fact_checker.py         # LLM verification logic
│   ├── requirements.txt        # Python dependencies
│   └── tests/                  # Test suite
│       ├── test_api.py         # Endpoint tests
│       └── test_scenarios.py   # Detailed edge case scenarios
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main UI
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── ClaimCard.tsx       # Display for claim results
│   │   └── CitationCard.tsx    # Display for citation results
│   ├── lib/                    # Utilities and constants
│   └── public/                 # Static assets
├── README.md                   # Project documentation
└── render.yaml                 # Deployment configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Developed by Team SyntaxNChill for Problem Statement 3*