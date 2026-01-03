# CLAUDE.md - Agent Context & Collaboration Guide
## AI Hallucination & Citation Verification System | 24-Hour Hackathon

---

## 🤖 Purpose of This File

This file is your **agent collaboration guide**. It explains:
- What the project does and why
- Key architectural decisions and constraints
- How to use AI coding assistants (Claude, Copilot, Cursor) effectively
- Common pitfalls and how to avoid them
- Code style and conventions for consistency

---

## 🎯 Project Context at a Glance

**Problem:** AI models hallucinate facts and cite fake sources with confidence.  
**Solution:** A web app that detects hallucinations and verifies claims in real-time.  
**Time Constraint:** 24 hours (2 PM Saturday → 2 PM Sunday)  
**Tech Stack:** Next.js (Frontend) + FastAPI (Backend) + Free APIs (Groq, DuckDuckGo)  

---

## 🏗️ Architecture

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

---

## 🛠️ How to Use AI Assistants Effectively

### **DO's ✅**

1. **Ask for specific modules, not the whole app**
   ```
   GOOD: "Write claim_extractor.py that uses Groq API..."
   BAD:  "Build me the entire backend"
   ```

2. **Provide exact constraints**
   ```
   GOOD: "Return exactly one of VERIFIED|HALLUCINATED|UNVERIFIABLE, reason <150 chars"
   BAD:  "Write a fact checker"
   ```

3. **Paste error messages**
   ```
   GOOD: [Full error stack] "Why am I getting this?"
   BAD:  "It doesn't work"
   ```

4. **Ask for test cases**
   ```
   GOOD: "Write Postman tests for /verify endpoint"
   BAD:  "Test the endpoint"
   ```

### **DON'Ts ❌**

1. **Don't ask for "the whole project"** - AI generates boilerplate you'll waste time reading
2. **Don't use vague prompts** - "Create a verification system" is too broad
3. **Don't copy code without understanding** - You'll debug at 3 AM
4. **Don't ignore API rate limits** - Have Ollama (local LLM) as fallback
5. **Don't hardcode secrets** - Use .env files only

---

## 🚨 Common Pitfalls & Quick Fixes

| Problem | Cause | Solution |
|---------|-------|----------|
| 429 Rate Limit | Too many Groq requests | Add `await asyncio.sleep(0.5)` between calls |
| CORS Errors | Frontend can't connect | Enable CORS in FastAPI middleware |
| Character Mismatch | LLM returns wrong positions | Validate: `assert text[start:end] == claim` |
| Slow Responses | Sequential API calls | Use `asyncio.gather()` for parallel calls |
| Missing API Key | .env not loaded | Add `load_dotenv()` at top of main.py |
| Frontend won't deploy | Hardcoded backend URL | Use `process.env.NEXT_PUBLIC_API_URL` |

---

## 📋 Module Breakdown

### **Backend Modules**

**claim_extractor.py**
- INPUT: String (user text)
- OUTPUT: List[Dict] with claim, start_char, end_char
- CONSTRAINT: Max 5 claims, must be factual

**search_module.py**
- INPUT: String (a claim)
- OUTPUT: List[Dict] with title, url, snippet
- CONSTRAINT: Top 3 results, <5 second timeout

**fact_checker.py**
- INPUT: Claim string + search results
- OUTPUT: {status, reason}
- CONSTRAINT: status must be exactly one of 3 options

**main.py**
- ENDPOINTS: POST /verify, GET /health, GET /docs
- CONSTRAINT: CORS enabled, 30 second timeout max

### **Frontend Components**

**app/page.tsx** - Main UI
- Textarea for input
- Results panel (color-coded)
- Demo example buttons

---

## 🧪 Testing Strategy

### **Backend (Postman)**
```
Test 1: GET /health → {"status": "ok"}
Test 2: POST /verify {"text": "Paris is in France"} → status: VERIFIED
Test 3: POST /verify {"text": "Elon Musk founded Google"} → status: HALLUCINATED
Test 4: Multiple claims mixed results
```

### **Frontend (Browser)**
- Input & load state working
- Results display with color coding
- Demo examples populate text
- Error handling (no crash on API failure)

---

## 🎯 Daily Checkpoints

**Saturday 2-6 PM:** Backend core logic complete  
**Saturday 6-10 PM:** Backend 100% functional  
**Saturday 10 PM-2 AM:** Frontend structure complete  
**Sunday 2-6 AM:** MVP 100% functional  
**Sunday 6-10 AM:** Documentation complete  
**Sunday 10 AM-2 PM:** Demo ready, sleep 4-6 hours  

---

## 🚀 Deployment (1-Click)

**Backend (Railway):**
1. railway.app → Connect GitHub
2. Set GROQ_API_KEY env var
3. Auto-deploys on git push

**Frontend (Vercel):**
1. vercel.com → Connect GitHub
2. Set NEXT_PUBLIC_API_URL env var
3. Auto-deploys on git push

---

## 💰 Cost (FREE)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Groq API | 30 req/min unlimited | $0 |
| DuckDuckGo | Unlimited searches | $0 |
| Vercel | Next.js deployment | $0 |
| Railway | $5 credit/month | $0 |
| **TOTAL** | | **$0** ✅ |

---

## 📝 Prompt Templates

**For module implementation:**
```
I'm building an AI hallucination detector.

I need you to write [MODULE_NAME].py with:
- INPUT: [describe input]
- OUTPUT: [describe output format]
- CONSTRAINTS: [list constraints]
- ERROR HANDLING: [failure modes]

Here's the function signature:
[paste signature]

Requirements:
1. Use free Groq API
2. Return JSON-serializable objects
3. Handle errors gracefully
4. Add type hints
5. Use async/await
```

**For bug fixes:**
```
Error:
[PASTE FULL ERROR STACK]

This happens when:
[describe steps to reproduce]

Code:
[paste code snippet]

What's wrong?
```

---

## 🎬 2-Minute Demo Script

```
[0:00-0:15] INTRO
"This is the AI Hallucination Detector. It catches when AI lies."

[0:15-0:45] LIVE DEMO
Paste: "Elon Musk founded Google in 1998"
Click: "Verify Now"
Show: RED (hallucinated) + sources showing real founders

[0:45-1:45] ARCHITECTURE
"Extract claims → Search web → Compare with LLM → Return verified/hallucinated"

[1:45-2:00] IMPACT
"Helps journalists & researchers trust AI content."
```

---

## ⚠️ Emergency Triage (3 AM)

**Q:** Everything is broken, 3 hours left  
**A:** Follow this:

1. Is backend running? `curl http://localhost:8000/health`
2. Is frontend running? Visit `http://localhost:3000`
3. Can they talk? Check Network tab in DevTools
4. Are APIs working? Check Groq dashboard

**Nuclear option:**
- Delete `.next/` and `venv/`
- Reinstall: `npm install` && `pip install -r requirements.txt`
- Restart both servers
- Test with simplest case

**If still broken (1 hour left):**
- Use screenshots of UI as proof
- Use Postman responses to prove functionality
- Write detailed explanation in README
- Judges give credit for effort + documentation

---

## ✅ Final Checklist

- [ ] GitHub repo with backend + frontend
- [ ] README.md with architecture & setup
- [ ] .env.example (no secrets!)
- [ ] requirements.txt & package.json
- [ ] Demo script ready (timed 2:00)
- [ ] Screenshots of working app
- [ ] Contingency plan if demo fails
- [ ] All APIs tested and working
- [ ] 4-6 hours sleep before submission

---

## 🔗 Resources

**APIs:**
- Groq: https://console.groq.com
- DuckDuckGo: `pip install duckduckgo-search`
- FastAPI: https://fastapi.tiangolo.com
- Next.js: https://nextjs.org/docs

**Hosting:**
- Railway: https://railway.app (backend)
- Vercel: https://vercel.com (frontend)

**Testing:**
- Postman: https://www.postman.com
- Browser DevTools: F12

---

**Remember: Ship > perfect. MVP wins hackathons. Good luck! 🚀**