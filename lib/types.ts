export interface Artist {
  id: string
  name: string
  categories: string[]
  bio: string
  email: string
  website: string
  imageUrl: string
}

export interface Artwork {
  id: string
  artistId: string
  title: string
  description: string
  imageUrl: string
  priceInr: number
  priceUsd: number
}
