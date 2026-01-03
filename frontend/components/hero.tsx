import { Button } from "@/components/ui/button"
import { Play, CheckCircle2, ShieldCheck, Search } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
            <ShieldCheck className="mr-2 h-3 w-3" />
            AI Hallucination & Citation Verification System
          </div>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl max-w-5xl">
            Trust your AI with <span className="text-primary italic">verifiable truth.</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-pretty">
            Eliminate hallucinations and validate every claim. Our system cross-references AI outputs with primary
            sources, ensuring your LLM results are accurate, cited, and trustworthy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
              <Link href="/verify">Try Out Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-semibold border-border/50 bg-secondary/10 hover:bg-secondary/20"
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> Watch Demo
            </Button>
          </div>
        </div>

        <div className="mt-16 relative group">
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium absolute left-1/2 -translate-x-1/2">
                <Search className="h-3.5 w-3.5" />
                Verification Report: Claim #402
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Original AI Output
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-sm italic text-muted-foreground">
                  "The new fiscal policy led to a 12% increase in regional GDP during Q3."
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">Verification Analysis</div>
                  <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    98% CONFIDENCE
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" /> Supporting Citation
                    </div>
                    <div className="text-sm">
                      Found in:{" "}
                      <span className="underline decoration-emerald-500/30">
                        IMF Regional Economic Outlook (Oct 2025)
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Page 42, Paragraph 3: "...growth peaked at 12.1%..."
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-2 opacity-50">
                    <div className="text-xs font-bold text-muted-foreground">Cross-Reference 2</div>
                    <div className="text-sm">World Bank Data Portal</div>
                    <div className="text-xs text-muted-foreground italic">Fetching latest dataset...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-primary/10 blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>

      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />
    </section>
  )
}
