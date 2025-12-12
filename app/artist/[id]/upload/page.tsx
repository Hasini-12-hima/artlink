"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackButton from "@/components/back-button"
import { saveArtwork, convertToUsd } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function UploadPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "/placeholder.svg",
    priceInr: 0,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priceInr" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || formData.priceInr <= 0) {
      alert("Please fill all fields with valid data")
      return
    }

    saveArtwork({
      artistId: params.id,
      ...formData,
    })

    setSubmitted(true)
    setTimeout(() => {
      router.push(`/artist/${params.id}`)
    }, 2000)
  }

  const priceUsd = convertToUsd(formData.priceInr)

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <BackButton />
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Artwork</h1>
            <p className="text-muted-foreground mb-8">Share your creative work with our community.</p>

            {submitted ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Artwork Uploaded!</h2>
                <p className="text-muted-foreground">Your artwork has been added to your portfolio. Redirecting...</p>
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
                    placeholder="e.g., Sunset Over Mountains"
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
                    placeholder="Describe your artwork, materials, inspiration, etc..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image URL *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price in INR *</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-foreground">₹</span>
                      <input
                        type="number"
                        name="priceInr"
                        value={formData.priceInr}
                        onChange={handleChange}
                        required
                        min="1"
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter price in INR"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price in USD</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-foreground">$</span>
                      <input
                        type="number"
                        value={priceUsd.toFixed(2)}
                        disabled
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Auto-converted at rate 1 INR = ${(1 * 0.012).toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Upload Artwork
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
