import { Button } from "@/components/ui/button"
import { ShieldCheck, Github } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Team SyntaxNChill</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/verify" className="transition-colors hover:text-primary">
            Verification Engine
          </Link>
          <Link href="https://github.com/ByteQuest-2025/GFGBQ-Team-syntaxnchill/blob/main/README.md" className="transition-colors hover:text-primary">
            API Docs
          </Link>
          <Link href="#" className="transition-colors hover:text-primary">
            Connect with Us
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/ByteQuest-2025/GFGBQ-Team-syntaxnchill" target="_blank">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  )
}
