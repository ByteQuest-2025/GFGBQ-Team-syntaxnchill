"use client";

import { useState } from "react";

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface ClaimResult {
  claim: string;
  start_char: number;
  end_char: number;
  status: "VERIFIED" | "HALLUCINATED" | "UNVERIFIABLE";
  reason: string;
  sources: Source[];
}

interface VerifyResponse {
  results: ClaimResult[];
}

const DEMO_EXAMPLES = [
  "Elon Musk founded Google in 1998 and later acquired Twitter.",
  "The Eiffel Tower is located in Paris, France and was completed in 1889.",
  "Albert Einstein discovered penicillin in 1928 while working at NASA.",
  "Python was created by Guido van Rossum and first released in 1991.",
];

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<ClaimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleVerify = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VerifyResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 border-green-500 text-green-800";
      case "HALLUCINATED":
        return "bg-red-100 border-red-500 text-red-800";
      case "UNVERIFIABLE":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "✓";
      case "HALLUCINATED":
        return "✗";
      case "UNVERIFIABLE":
        return "?";
      default:
        return "•";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Hallucination Detector
          </h1>
          <p className="text-gray-400">
            Paste text below to verify factual claims against real sources
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text containing claims to verify..."
            className="w-full h-40 bg-gray-700 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={handleVerify}
              disabled={loading || !text.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {loading ? "Verifying..." : "Verify Now"}
            </button>
            <button
              onClick={() => {
                setText("");
                setResults([]);
                setError(null);
              }}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Demo Examples */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => setText(example)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
              >
                Example {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing claims...</p>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Results ({results.length} claim{results.length !== 1 ? "s" : ""} found)
            </h2>
            {results.map((result, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold uppercase text-sm">
                        {result.status}
                      </span>
                    </div>
                    <p className="font-medium mb-2">&quot;{result.claim}&quot;</p>
                    <p className="text-sm opacity-80 mb-3">{result.reason}</p>

                    {/* Sources */}
                    {result.sources.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold mb-1">Sources:</p>
                        <ul className="space-y-1">
                          {result.sources.map((source, sIndex) => (
                            <li key={sIndex} className="text-xs">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:no-underline"
                              >
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>Built for 24-Hour Hackathon | Team syntaxnchill</p>
        </footer>
      </div>
    </main>
  );
}
