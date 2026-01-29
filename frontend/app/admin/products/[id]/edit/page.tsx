"use client"

import { useParams } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { mockProducts } from "@/lib/admin-data"

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Product not found</h2>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" />
}
