"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-primary hover:underline mb-8 hover:opacity-80 transition-opacity"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  )
}
