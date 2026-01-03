# AI Hallucination Detector - Firefox Extension

**Version:** 1.0.0

## Description

Detect AI hallucinations and verify claims in real-time. Select any text on the web and instantly check if claims are verified, hallucinated, or unverifiable using advanced fact-checking AI.

### Features

- 🔍 **Real-time Claim Verification** - Instantly verify factual claims with a single click
- 📊 **Trust Score** - Get an overall trustworthiness percentage for any text
- 🌐 **Works Everywhere** - Verify claims on ANY website
- 📚 **Source Citations** - See original sources that verify or contradict claims
- ⚡ **Fast & Lightweight** - Minimal resource usage, instant results

### How to Use

1. **Install the extension** from Firefox Add-ons
2. **Select text** on any website
3. **Click the extension icon** in your toolbar
4. **See instant verification results** - Green ✅ for verified, Red ❌ for hallucinated, Yellow ❓ for unclear

### Privacy

- Text you verify is sent to our backend for analysis
- We never store your data permanently
- No tracking, no ads, no account required
- All processing is done server-side with no data retention

### Technical Details

- **Backend**: FastAPI + Groq LLM + DuckDuckGo Search
- **Frontend**: Clean, fast, responsive popup
- **Manifest Version**: 3 (latest standard)
- **Permissions**: activeTab, scripting (only to get selected text)

### How It Works

1. **Claim Extraction**: AI identifies factual claims in your selected text
2. **Web Search**: Each claim is searched against reliable web sources
3. **Verification**: AI compares claims against found evidence
4. **Results**: You get a trust score and detailed breakdown

### Verification Statuses

| Status | Meaning |
|--------|---------|
| ✅ VERIFIED | Claim is supported by reliable sources |
| ❌ HALLUCINATED | Claim contradicts reliable sources |
| ❓ UNVERIFIABLE | Cannot find enough evidence to verify |

### Requirements

- Firefox 109.0 or higher
- Active internet connection

### Support

For issues or feature requests, visit: https://github.com/syntaxnchill/hallucination-detector

### License

MIT License

---

**Made during Byte Quest 2026 Hackathon** 🚀

### Team: syntaxnchill
