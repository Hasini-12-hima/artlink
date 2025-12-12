import type { Artist, Artwork } from "./types"

const ARTISTS_KEY = "artlink_artists"
const ARTWORKS_KEY = "artlink_artworks"
const LOGGED_IN_ARTIST_KEY = "artlink_logged_in_artist"

const INR_TO_USD_RATE = 0.012

export function convertToUsd(inr: number): number {
  return Math.round(inr * INR_TO_USD_RATE * 100) / 100
}

export function getArtists(): Artist[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(ARTISTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveArtist(artistData: Omit<Artist, "id">): Artist {
  const artist: Artist = {
    ...artistData,
    id: Date.now().toString(),
  }

  const artists = getArtists()
  artists.push(artist)

  if (typeof window !== "undefined") {
    localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists))
  }

  return artist
}

export function getArtworks(): Artwork[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(ARTWORKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveArtwork(artworkData: Omit<Artwork, "id" | "priceUsd">): Artwork {
  const artwork: Artwork = {
    ...artworkData,
    id: Date.now().toString(),
    priceUsd: convertToUsd(artworkData.priceInr),
  }

  const artworks = getArtworks()
  artworks.push(artwork)

  if (typeof window !== "undefined") {
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks))
  }

  return artwork
}

export function getArtworksByArtist(artistId: string): Artwork[] {
  return getArtworks().filter((art) => art.artistId === artistId)
}

export function setLoggedInArtist(artist: Artist): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOGGED_IN_ARTIST_KEY, JSON.stringify(artist))
  }
}

export function getLoggedInArtist(): Artist | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(LOGGED_IN_ARTIST_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function logoutArtist(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOGGED_IN_ARTIST_KEY)
  }
}

export function updateArtist(updatedArtist: Artist): void {
  const artists = getArtists()
  const index = artists.findIndex((a) => a.id === updatedArtist.id)
  if (index !== -1) {
    artists[index] = updatedArtist
    if (typeof window !== "undefined") {
      localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists))
      setLoggedInArtist(updatedArtist)
    }
  }
}

export function deleteArtwork(artworkId: string): void {
  const artworks = getArtworks()
  const filtered = artworks.filter((a) => a.id !== artworkId)
  if (typeof window !== "undefined") {
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(filtered))
  }
}
