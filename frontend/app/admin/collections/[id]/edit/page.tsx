"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CollectionForm } from "@/components/admin/collection-form"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import type { CollectionDto } from "@/app/ApiHelper/types"

export default function EditCollectionPage() {
  const params = useParams()
  const id = params.id as string
  const [collection, setCollection] = useState<CollectionDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await ApiClient.collection.getById(id)
        setCollection(data)
      } catch (err) {
        console.error("Failed to fetch collection:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCollection()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-500 font-medium">Loading collection details...</div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-slate-500 font-medium">Collection not found</p>
      </div>
    )
  }

  return <CollectionForm mode="edit" collection={collection} />
}
