import { Check, AlertCircle, HelpCircle, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";
import { CitationResult } from "../types";

export function CitationCard({ result }: { result: CitationResult }) {
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
