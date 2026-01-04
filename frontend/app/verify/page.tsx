"use client";

import { useState, useEffect } from "react";
import { Loader2, Info, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { ClaimResult, CitationResult, VerificationMode } from "../../types";
import { DEMO_FACTS, DEMO_CITATIONS, HALLUCINATION_FACTS } from "../../lib/constants";
import { ClaimCard } from "../../components/ClaimCard";
import { CitationCard } from "../../components/CitationCard";

export default function HallucinationDetector() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClaimResult[] | null>(null);
  const [citationResults, setCitationResults] = useState<CitationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [mode, setMode] = useState<VerificationMode>("claims");
  const MAX_CHAR_LIMIT = 200;

  // Preserving original backend connection logic
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % HALLUCINATION_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (!inputText.trim()) return;

    if (inputText.length > MAX_CHAR_LIMIT) {
      setError(`Text exceeds ${MAX_CHAR_LIMIT} character limit`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setCitationResults(null);

    try {
      const endpoint = mode === "claims" ? "/verify" : "/verify-citations";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      
      if (mode === "claims") {
        setResults(data.results || []);
      } else {
        setCitationResults(data.results || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (type: keyof typeof DEMO_FACTS) => {
    const options = DEMO_FACTS[type];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    setInputText(randomOption);
    setError(null);
    setResults(null);
    setCitationResults(null);
    setMode("claims");
  };

  const fillCitationDemo = (type: keyof typeof DEMO_CITATIONS) => {
    setInputText(DEMO_CITATIONS[type]);
    setError(null);
    setResults(null);
    setCitationResults(null);
    setMode("citations");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 flex flex-col font-sans">
      {/* Home Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-colors">
          <Home className="h-5 w-5 text-slate-300 hover:text-white" />
        </Link>
      </div>

      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="relative flex-1 max-w-4xl mx-auto px-6 py-20 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 mb-2">
            AI Safety & Integrity
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AI Hallucination Detector
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto text-balance">
            Instantly verify claims and detect hallucinations in AI-generated content using real-world sources.
          </p>
        </header>

        {/* Input Section */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          {/* Mode Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-slate-900/50 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => { setMode("claims"); setResults(null); setCitationResults(null); }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  mode === "claims" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                Verify Claims
              </button>
              <button
                onClick={() => { setMode("citations"); setResults(null); setCitationResults(null); }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  mode === "citations" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                Verify Citations
              </button>
            </div>
          </div>

          <div className="relative group">
            <textarea
              placeholder={mode === "claims" 
                ? "Paste the text you want to verify here..." 
                : "Paste text with academic citations to verify (author, year, title, venue, pages)..."
              }
              className="w-full min-h-[240px] p-6 text-lg bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl hover:border-blue-500/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none shadow-2xl outline-none placeholder:text-slate-600"
              value={inputText}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= MAX_CHAR_LIMIT) {
                  setInputText(text);
                }
              }}
              maxLength={MAX_CHAR_LIMIT}
            />
            <div className="absolute bottom-4 left-4 text-sm text-slate-500">
              {inputText.length}/{MAX_CHAR_LIMIT}
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setInputText("")}
                className="text-slate-500 hover:text-slate-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {mode === "claims" && (
                <>
                  <button onClick={() => fillDemo("true")} className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 transition-colors">
                    Try True Fact
                  </button>
                  <button onClick={() => fillDemo("fake")} className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 transition-colors">
                    Try Fake Fact
                  </button>
                  <button onClick={() => fillDemo("mixed")} className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 transition-colors">
                    Try Mixed Content
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Verify Accuracy"
              )}
            </button>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-center animate-in zoom-in-95">
            {error}
          </div>
        )}

        {/* Results Section */}
        {(results || citationResults) && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
              <p className="text-sm text-slate-400">
                Found {mode === "claims" ? results?.length : citationResults?.length} {mode === "claims" ? "verifiable claims" : "citations"}
              </p>
            </div>

            <div className="grid gap-6">
              {mode === "claims" && results?.map((claim, idx) => (
                <ClaimCard key={idx} result={claim} />
              ))}
              {mode === "citations" && citationResults?.map((citation, idx) => (
                <CitationCard key={idx} result={citation} />
              ))}
            </div>

            {((mode === "claims" && results?.length === 0) || (mode === "citations" && citationResults?.length === 0)) && (
              <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                No {mode === "claims" ? "verifiable claims" : "citations"} found in the provided text.
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="relative mt-auto border-t border-slate-800/40 bg-slate-900/20 backdrop-blur-md py-8 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400/70">
            <Info className="h-4 w-4" />
            AI Integrity Insights
          </div>
          <div className="h-16 flex items-center justify-center relative w-full">
            {HALLUCINATION_FACTS.map((fact, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-1000 transform",
                  factIndex === idx
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none",
                )}
              >
                <p
                  className={cn(
                    "text-base md:text-lg font-medium leading-relaxed max-w-2xl px-4",
                    fact.type === "damage" ? "text-red-400/90" : "text-green-400/90",
                  )}
                >
                  {fact.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2">
            {HALLUCINATION_FACTS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  factIndex === idx ? "w-6 bg-blue-500" : "w-1.5 bg-slate-800 hover:bg-slate-700",
                )}
              />
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}


