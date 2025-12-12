"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackButton from "@/components/back-button"
import type { Artist } from "@/lib/types"
import { getArtists } from "@/lib/storage"
import { ART_CATEGORIES } from "@/lib/constants"
import Link from "next/link"

export default function BrowsePage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const stored = getArtists()
    setArtists(stored)
  }, [])

  const filtered = artists.filter((artist) => {
    const artistCategories = artist.categories || []
    const matchesCategory =
      selectedCategories.length === 0 || artistCategories.some((cat) => selectedCategories.includes(cat))
    const matchesSearch =
      !searchTerm ||
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <BackButton />
            <h1 className="text-3xl font-bold text-foreground mb-6">Browse Artists</h1>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex flex-wrap gap-2">
                {ART_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategories.includes(cat)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No artists found.</p>
                <Link href="/register" className="text-primary hover:underline">
                  Be the first to register
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="group rounded-lg overflow-hidden bg-card border border-border hover:border-primary transition-all hover:shadow-lg"
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                      <img
                        src={artist.imageUrl || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {artist.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{(artist.categories || []).join(", ")}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
