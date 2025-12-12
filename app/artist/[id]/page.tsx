"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackButton from "@/components/back-button"
import type { Artist, Artwork } from "@/lib/types"
import { getArtists, getArtworksByArtist } from "@/lib/storage"
import Link from "next/link"
import { Mail, Globe } from "lucide-react"

export default function ArtistPage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])

  useEffect(() => {
    const artists = getArtists()
    const found = artists.find((a) => a.id === params.id)
    setArtist(found || null)

    if (found) {
      const artistArtworks = getArtworksByArtist(found.id)
      setArtworks(artistArtworks)
    }
  }, [params.id])

  if (!artist) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Artist not found</p>
            <Link href="/browse" className="text-primary hover:underline">
              Back to browse
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BackButton />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              <img
                src={artist.imageUrl || "/placeholder.svg"}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(artist.categories || []).map((cat) => (
                    <div
                      key={cat}
                      className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">{artist.name}</h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{artist.bio}</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                {artist.email && (
                  <a
                    href={`mailto:${artist.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                  >
                    <Mail size={20} className="text-primary" />
                    <span className="truncate">{artist.email}</span>
                  </a>
                )}
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                  >
                    <Globe size={20} className="text-primary" />
                    <span className="truncate">Visit Website</span>
                  </a>
                )}
                {!artist.email && !artist.website && (
                  <p className="text-sm text-muted-foreground italic">No contact information provided</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Artworks</h2>
            {artworks.length === 0 ? (
              <p className="text-muted-foreground">No artworks uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artworks.map((artwork) => (
                  <div key={artwork.id} className="rounded-lg overflow-hidden bg-card border border-border">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                      <img
                        src={artwork.imageUrl || "/placeholder.svg"}
                        alt={artwork.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2">{artwork.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{artwork.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">₹{artwork.priceInr.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">${artwork.priceUsd.toFixed(2)}</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
