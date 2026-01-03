# AI Hallucination Detector 🔍

Detects AI hallucinations and verifies claims in real-time using web search and LLM analysis.

## Architecture

```
INPUT → Claim Extraction → Web Search → Fact-Checking → OUTPUT
                ↓              ↓              ↓
          Groq LLM     DuckDuckGo      Groq LLM
```

**Pipeline Flow:**
1. User pastes text into UI
2. Backend extracts factual claims (max 5)
3. For each claim, search the web (top 3 results)
4. Compare claim against search results with LLM
5. Return: status (VERIFIED|HALLUCINATED|UNVERIFIABLE) + sources

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** FastAPI + Python 3.10+
- **AI:** Groq API (Llama 3.1)
- **Search:** DuckDuckGo

## Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run server
python main.py
```

Backend runs at: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Run development server
npm run dev
```

Frontend runs at: http://localhost:3000

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/verify` | POST | Verify claims in text |
| `/docs` | GET | Swagger API docs |

### POST /verify

**Request:**
```json
{
  "text": "Elon Musk founded Google in 1998."
}
```

**Response:**
```json
{
  "results": [
    {
      "claim": "Elon Musk founded Google in 1998",
      "start_char": 0,
      "end_char": 32,
      "status": "HALLUCINATED",
      "reason": "Google was founded by Larry Page and Sergey Brin, not Elon Musk",
      "sources": [
        {
          "title": "Google - Wikipedia",
          "url": "https://en.wikipedia.org/wiki/Google",
          "snippet": "Google was founded on September 4, 1998, by Larry Page and Sergey Brin..."
        }
      ]
    }
  ]
}
```

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app
│   ├── claim_extractor.py   # Extract claims with Groq
│   ├── search_module.py     # DuckDuckGo search
│   ├── fact_checker.py      # Verify claims with Groq
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main UI
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
├── CLAUDE.md                # AI agent guide
└── README.md
```

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

### Backend (Railway)
1. Connect GitHub repo to railway.app
2. Set `GROQ_API_KEY` env var
3. Auto-deploys on git push

### Frontend (Vercel)
1. Connect GitHub repo to vercel.com
2. Set `NEXT_PUBLIC_API_URL` to your Railway URL
3. Auto-deploys on git push

## Cost

| Service | Free Tier |
|---------|-----------|
| Groq API | 30 req/min |
| DuckDuckGo | Unlimited |
| Vercel | Free tier |
| Railway | $5 credit/month |

**Total: $0** ✅

## Team

**Team syntaxnchill** - 24-Hour Hackathon

---

Built with ❤️ for detecting AI hallucinations
