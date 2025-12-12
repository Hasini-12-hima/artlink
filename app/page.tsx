"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import FeaturedArtists from "@/components/featured-artists"
import Categories from "@/components/categories"
import Footer from "@/components/footer"
import type { Artist } from "@/lib/types"
import { getArtists } from "@/lib/storage"

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([])

  useEffect(() => {
    const stored = getArtists()
    setArtists(stored)
  }, [])

  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <FeaturedArtists artists={artists} />
      <Footer />
    </main>
  )
}
