"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import type { Product } from "@/lib/admin-data"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { mapAdminItemToProduct, type AdminCategoryDto, type AdminItemDto } from "@/lib/admin-items"

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const [items, categories] = await Promise.all([
          ApiClient.get("api/admin/Item"),
          ApiClient.get("api/admin/Categories"),
        ])

        const found = (items as AdminItemDto[]).find((item) => item.id === id)
        if (found) {
          setProduct(mapAdminItemToProduct(found, categories as AdminCategoryDto[]))
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error("Failed to fetch product:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
        Loading...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">
          {"Product not found"}
        </h2>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" />
}
