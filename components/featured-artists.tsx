"use client"

import Link from "next/link"
import type { Artist } from "@/lib/types"

interface Props {
  artists: Artist[]
}

export default function FeaturedArtists({ artists }: Props) {
  const featured = artists.slice(0, 6)

  if (featured.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Featured Artists</h3>
          <div className="bg-card border border-border rounded-lg p-12">
            <p className="text-muted-foreground mb-6">No artists have registered yet.</p>
            <Link
              href="/register"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Be the First to Register
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-8">Featured Artists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((artist) => (
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
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{artist.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{artist.category}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
