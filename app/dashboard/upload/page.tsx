"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackButton from "@/components/back-button"
import { getLoggedInArtist, saveArtwork, getArtworks } from "@/lib/storage"
import type { Artist } from "@/lib/types"

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")

  const [artist, setArtist] = useState<Artist | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "/art-sample.jpg",
    priceInr: 0,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedIn = getLoggedInArtist()
    if (!loggedIn) {
      router.push("/register")
      return
    }
    setArtist(loggedIn)

    if (editId) {
      const artworks = getArtworks()
      const artwork = artworks.find((a) => a.id === editId)
      if (artwork) {
        setFormData({
          title: artwork.title,
          description: artwork.description,
          imageUrl: artwork.imageUrl,
          priceInr: artwork.priceInr,
        })
      }
    }

    setLoading(false)
  }, [editId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priceInr" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!artist) return

    if (!formData.title || !formData.description || !formData.imageUrl || formData.priceInr <= 0) {
      alert("Please fill in all fields with valid values")
      return
    }

    if (editId) {
      const artworks = getArtworks()
      const index = artworks.findIndex((a) => a.id === editId)
      if (index !== -1) {
        artworks[index] = {
          ...artworks[index],
          ...formData,
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("artlink_artworks", JSON.stringify(artworks))
        }
      }
    } else {
      saveArtwork({
        artistId: artist.id,
        ...formData,
      })
    }

    setSubmitted(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!artist) return null

  const conversionRate = 0.012
  const priceUsd = Math.round(formData.priceInr * conversionRate * 100) / 100

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <BackButton />
            <h1 className="text-3xl font-bold text-foreground mb-2">{editId ? "Edit Artwork" : "Upload Artwork"}</h1>
            <p className="text-muted-foreground mb-8">
              {editId ? "Update your artwork details" : "Share your latest creation with our community"}
            </p>

            {submitted ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {editId ? "Artwork Updated!" : "Artwork Uploaded!"}
                </h2>
                <p className="text-muted-foreground">Redirecting to your profile...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Artwork Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Give your artwork a title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe your artwork..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image URL *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/image-error.png"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price (INR) *</label>
                    <input
                      type="number"
                      name="priceInr"
                      value={formData.priceInr}
                      onChange={handleChange}
                      required
                      min="0"
                      step="100"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price (USD) - Auto</label>
                    <div className="px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground">
                      ${priceUsd}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    {editId ? "Update Artwork" : "Upload Artwork"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-card border border-border py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
