export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface ClaimResult {
  claim: string;
  status: "VERIFIED" | "HALLUCINATED" | "UNVERIFIABLE";
  reason: string;
  sources: Source[];
}

export interface CitationResult {
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

export type VerificationMode = "claims" | "citations";
