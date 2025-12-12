"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AL</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">ArtLink Hub</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Discover
            </Link>
            <Link href="/browse" className="text-sm hover:text-primary transition-colors">
              Browse Artists
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Become an Artist
            </Link>
          </nav>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
            <Link href="/" className="block text-sm hover:text-primary">
              Discover
            </Link>
            <Link href="/browse" className="block text-sm hover:text-primary">
              Browse Artists
            </Link>
            <Link
              href="/register"
              className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium text-center"
            >
              Become an Artist
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
