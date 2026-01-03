"use client";

import { useState, useEffect } from "react";
import { Check, AlertCircle, HelpCircle, Loader2, ExternalLink, Info, X } from "lucide-react";

// Utility for conditional classes
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface Source {
  title: string;
  url: string;
  snippet?: string;
}

interface ClaimResult {
  claim: string;
  status: "VERIFIED" | "HALLUCINATED" | "UNVERIFIABLE";
  reason: string;
  sources: Source[];
}

interface CitationResult {
  raw_citation: string;
  authors?: string;
  year?: string;
  title?: string;
  venue?: string;
  pages?: string;
  status: "VERIFIED" | "HALLUCINATED" | "UNVERIFIABLE";
  errors: string[];
  reason: string;
  sources: Source[];
}

type VerificationMode = "claims" | "citations";

const DEMO_FACTS = {
  true: "The capital of France is Paris. It is known for the Eiffel Tower, which was completed in 1889.",
  fake: "The moon is made of green cheese and was discovered by Buzz Aldrin in 1969 during the Apollo 11 mission.",
  mixed: "Water boils at 100 degrees Celsius at sea level. However, in the city of Atlantis, it freezes when heated.",
};

const DEMO_CITATIONS = {
  correct: `Residual connections help deep neural networks train effectively and enabled very deep "ResNet" architectures.
He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR) (pp. 770–778).`,
  wrongYear: `Residual connections help deep neural networks train effectively.
He, K., Zhang, X., Ren, S., & Sun, J. (2015). Deep residual learning for image recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR) (pp. 770–778).`,
  wrongVenue: `Residual connections help deep neural networks train effectively.
He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. Nature, 770–778.`,
};

const HALLUCINATION_FACTS = [
  {
    type: "damage",
    text: "AI hallucinations can lead to significant financial losses for businesses relying on automated decision-making.",
  },
  {
    type: "benefit",
    text: "Verifying AI output ensures the integrity of research and prevents the spread of scientific misinformation.",
  },
  {
    type: "damage",
    text: "In legal contexts, hallucinated case citations have led to sanctions and damaged professional reputations.",
  },
  {
    type: "benefit",
    text: "Cross-referencing claims builds trust with users by demonstrating a commitment to factual accuracy.",
  },
  {
    type: "damage",
    text: "Medical hallucinations in AI can provide dangerous or incorrect health advice if not properly audited.",
  },
];

export default function HallucinationDetector() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClaimResult[] | null>(null);
  const [citationResults, setCitationResults] = useState<CitationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [mode, setMode] = useState<VerificationMode>("claims");

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
    setInputText(DEMO_FACTS[type]);
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
              onChange={(e) => setInputText(e.target.value)}
            />
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
              {mode === "claims" ? (
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
              ) : (
                <>
                  <button onClick={() => fillCitationDemo("correct")} className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900/50 border border-green-800/50 hover:bg-green-900/30 hover:text-white text-slate-300 transition-colors">
                    Correct Citation
                  </button>
                  <button onClick={() => fillCitationDemo("wrongYear")} className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900/50 border border-yellow-800/50 hover:bg-yellow-900/30 hover:text-white text-slate-300 transition-colors">
                    Wrong Year
                  </button>
                  <button onClick={() => fillCitationDemo("wrongVenue")} className="px-4 py-2 text-sm font-medium rounded-full bg-slate-900/50 border border-red-800/50 hover:bg-red-900/30 hover:text-white text-slate-300 transition-colors">
                    Wrong Venue
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

function ClaimCard({ result }: { result: ClaimResult }) {
  const statusConfig = {
    VERIFIED: {
      color: "border-green-500/30 bg-green-500/5",
      icon: <Check className="h-5 w-5 text-green-500" />,
      label: "Verified",
      labelColor: "text-green-500",
    },
    HALLUCINATED: {
      color: "border-red-500/30 bg-red-500/5",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      label: "Hallucination Detected",
      labelColor: "text-red-500",
    },
    UNVERIFIABLE: {
      color: "border-yellow-500/30 bg-yellow-500/5",
      icon: <HelpCircle className="h-5 w-5 text-yellow-500" />,
      label: "Unverifiable",
      labelColor: "text-yellow-500",
    },
  };

  const config = statusConfig[result.status] || statusConfig.UNVERIFIABLE;

  return (
    <div className={cn("overflow-hidden border-l-4 rounded-r-xl border border-slate-800 transition-all hover:translate-x-1 duration-300", config.color)}>
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-wider", config.labelColor)}>
              {config.icon}
              {config.label}
            </div>
            <h3 className="text-xl font-semibold leading-tight text-slate-100">{result.claim}</h3>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="p-3 rounded bg-slate-950/50 text-slate-300 text-sm leading-relaxed border border-slate-800/50">
          <span className="font-bold block mb-1 text-slate-400">Reasoning:</span>
          {result.reason}
        </div>

        {result.sources.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">
              Supporting Sources
            </span>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((source, sIdx) => (
                <a
                  key={sIdx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 transition-colors group"
                >
                  {source.title}
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CitationCard({ result }: { result: CitationResult }) {
  const statusConfig = {
    VERIFIED: {
      color: "border-green-500/30 bg-green-500/5",
      icon: <Check className="h-5 w-5 text-green-500" />,
      label: "Citation Verified",
      labelColor: "text-green-500",
    },
    HALLUCINATED: {
      color: "border-red-500/30 bg-red-500/5",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      label: "Citation Error Detected",
      labelColor: "text-red-500",
    },
    UNVERIFIABLE: {
      color: "border-yellow-500/30 bg-yellow-500/5",
      icon: <HelpCircle className="h-5 w-5 text-yellow-500" />,
      label: "Cannot Verify",
      labelColor: "text-yellow-500",
    },
  };

  const config = statusConfig[result.status] || statusConfig.UNVERIFIABLE;

  return (
    <div className={cn("overflow-hidden border-l-4 rounded-r-xl border border-slate-800 transition-all hover:translate-x-1 duration-300", config.color)}>
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 w-full">
            <div className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-wider", config.labelColor)}>
              {config.icon}
              {config.label}
            </div>
            {result.title && (
              <h3 className="text-lg font-semibold leading-tight text-slate-100">&quot;{result.title}&quot;</h3>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 space-y-4">
        {/* Citation Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {result.authors && (
            <div className="bg-slate-900/50 rounded p-2 border border-slate-800/50">
              <span className="text-xs text-slate-500 block">Authors</span>
              <span className="text-slate-300">{result.authors}</span>
            </div>
          )}
          {result.year && (
            <div className="bg-slate-900/50 rounded p-2 border border-slate-800/50">
              <span className="text-xs text-slate-500 block">Year</span>
              <span className="text-slate-300">{result.year}</span>
            </div>
          )}
          {result.venue && (
            <div className="bg-slate-900/50 rounded p-2 border border-slate-800/50">
              <span className="text-xs text-slate-500 block">Venue</span>
              <span className="text-slate-300">{result.venue}</span>
            </div>
          )}
          {result.pages && (
            <div className="bg-slate-900/50 rounded p-2 border border-slate-800/50">
              <span className="text-xs text-slate-500 block">Pages</span>
              <span className="text-slate-300">{result.pages}</span>
            </div>
          )}
        </div>

        {/* Errors Found */}
        {result.errors && result.errors.length > 0 && (
          <div className="p-3 rounded bg-red-950/30 border border-red-900/50">
            <span className="font-bold block mb-2 text-red-400 text-sm">Errors Found:</span>
            <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
              {result.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Reasoning */}
        <div className="p-3 rounded bg-slate-950/50 text-slate-300 text-sm leading-relaxed border border-slate-800/50">
          <span className="font-bold block mb-1 text-slate-400">Analysis:</span>
          {result.reason}
        </div>

        {/* Sources */}
        {result.sources && result.sources.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">
              Reference Sources
            </span>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((source, sIdx) => (
                <a
                  key={sIdx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 transition-colors group"
                >
                  {source.title}
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
