"use client";

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-8 relative">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight"></span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2">
          <Link href="/verify" className="transition-colors hover:text-primary">
            Verification Engine
          </Link>
          <Link href="https://github.com/ByteQuest-2025/GFGBQ-Team-syntaxnchill/blob/main/README.md" target="_blank" className="transition-colors hover:text-primary">
            API Docs
          </Link>
          <div className="relative group">
            <button className="transition-colors hover:text-primary cursor-pointer">
              Connect with Us
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-background border border-border/50 rounded-lg shadow-xl p-6 space-y-4">
                <div className="text-center font-bold text-foreground text-lg">Team SyntaxNChill</div>
                <div className="h-px bg-white/20 my-3"></div>
                <div className="flex items-center justify-between text-foreground">
                  <span className="text-base">Mitul Sheth</span>
                  <div className="flex gap-3">
                    <Link href="https://www.linkedin.com/in/mitul-sheth71" target="_blank" className="hover:text-primary transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href="https://github.com/aristocrat71" target="_blank" className="hover:text-primary transition-colors">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-between text-foreground">
                  <span className="text-base">Priyanshu Makwana</span>
                  <div className="flex gap-3">
                    <Link href="https://www.linkedin.com/in/priyanshu-makwana-277b93261/" target="_blank" className="hover:text-primary transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href="https://github.com/priyanshu-prime" target="_blank" className="hover:text-primary transition-colors">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile: Only Connect with Us */}
        <nav className="md:hidden flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
            >
              Connect with Us
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 transition-all duration-200">
                <div className="bg-background border border-border/50 rounded-lg shadow-xl p-6 space-y-4">
                  <div className="text-center font-bold text-foreground text-lg">Team SyntaxNChill</div>
                  <div className="h-px bg-white/20 my-3"></div>
                  <div className="flex items-center justify-between text-foreground">
                    <span className="text-base">Mitul Sheth</span>
                    <div className="flex gap-3">
                      <Link href="https://www.linkedin.com/in/mitul-sheth71" target="_blank" className="hover:text-primary transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link href="https://github.com/aristocrat71" target="_blank" className="hover:text-primary transition-colors">
                        <Github className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-foreground">
                    <span className="text-base">Priyanshu Makwana</span>
                    <div className="flex gap-3">
                      <Link href="https://www.linkedin.com/in/priyanshu-makwana-277b93261/" target="_blank" className="hover:text-primary transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link href="https://github.com/priyanshu-prime" target="_blank" className="hover:text-primary transition-colors">
                        <Github className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <Link href="https://github.com/ByteQuest-2025/GFGBQ-Team-syntaxnchill" target="_blank">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  )
}
