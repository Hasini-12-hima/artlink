"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackButton from "@/components/back-button"
import { getLoggedInArtist, logoutArtist, updateArtist, getArtworksByArtist } from "@/lib/storage"
import { ART_CATEGORIES } from "@/lib/constants"
import type { Artist, Artwork } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedIn = getLoggedInArtist()
    if (!loggedIn) {
      router.push("/register")
      return
    }
    setArtist(loggedIn)
    setEditData(loggedIn)
    const artistWorks = getArtworksByArtist(loggedIn.id)
    setArtworks(artistWorks)
    setLoading(false)
  }, [router])

  const handleCategoryToggle = (category: string) => {
    if (!editData) return
    setEditData({
      ...editData,
      categories: editData.categories.includes(category)
        ? editData.categories.filter((c) => c !== category)
        : [...editData.categories, category],
    })
  }

  const handleSaveProfile = () => {
    if (!editData) return
    if (editData.categories.length === 0) {
      alert("Please select at least one category")
      return
    }
    updateArtist(editData)
    setArtist(editData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logoutArtist()
    router.push("/")
  }

  const handleDeleteArtwork = (artworkId: string) => {
    const confirmed = confirm("Are you sure you want to delete this artwork?")
    if (!confirmed) return

    const { getArtworks, deleteArtwork } = require("@/lib/storage")
    deleteArtwork(artworkId)
    setArtworks(artworks.filter((a) => a.id !== artworkId))
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

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <BackButton />
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
              >
                Logout
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-8">
                {/* Profile Info */}
                <div className="bg-card border border-border rounded-lg p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-6">
                      <img
                        src={artist.imageUrl || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{artist.name}</h2>
                        <p className="text-muted-foreground text-sm mb-3">
                          Categories: {(artist.categories || []).join(", ")}
                        </p>
                        {artist.email && (
                          <p className="text-muted-foreground text-sm">
                            <a href={`mailto:${artist.email}`} className="text-primary hover:underline">
                              {artist.email}
                            </a>
                          </p>
                        )}
                        {artist.website && (
                          <p className="text-muted-foreground text-sm">
                            <a
                              href={artist.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {artist.website}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-medium text-foreground mb-2">Bio</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{artist.bio}</p>
                  </div>
                </div>

                {/* My Artworks */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">My Artworks</h2>
                    <button
                      onClick={() => router.push(`/dashboard/upload`)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Upload New Artwork
                    </button>
                  </div>

                  {artworks.length === 0 ? (
                    <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
                      <p className="text-muted-foreground mb-4">You haven't uploaded any artworks yet.</p>
                      <button
                        onClick={() => router.push(`/dashboard/upload`)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Upload Your First Artwork
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artworks.map((artwork) => (
                        <div
                          key={artwork.id}
                          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={artwork.imageUrl || "/placeholder.svg"}
                            alt={artwork.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-foreground mb-1">{artwork.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{artwork.description}</p>
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-bold text-primary">
                                ₹{artwork.priceInr.toLocaleString()} / ${artwork.priceUsd}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => router.push(`/dashboard/upload?id=${artwork.id}`)}
                                className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteArtwork(artwork.id)}
                                className="flex-1 px-3 py-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Edit Profile Form */
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveProfile()
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editData?.name || ""}
                      onChange={(e) => editData && setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Art Categories (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ART_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-2 rounded-lg border font-medium transition-colors ${
                            editData?.categories.includes(cat)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                    <textarea
                      value={editData?.bio || ""}
                      onChange={(e) => editData && setEditData({ ...editData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={editData?.email || ""}
                      onChange={(e) => editData && setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                    <input
                      type="url"
                      value={editData?.website || ""}
                      onChange={(e) => editData && setEditData({ ...editData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setEditData(artist)
                      }}
                      className="flex-1 bg-card border border-border py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
