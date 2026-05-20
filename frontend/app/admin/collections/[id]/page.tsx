"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { getImageUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CollectionDto, ProductDto } from "@/app/ApiHelper/types"

function getCollectionItemImage(item: ProductDto) {
  if (item.mainImage) return item.mainImage
  if (item.imageUrl) return item.imageUrl

  const firstImage = Array.isArray(item.images) ? item.images[0] : undefined
  if (typeof firstImage === "string") return firstImage
  if (firstImage && typeof firstImage === "object" && "imageUrl" in firstImage) {
    return firstImage.imageUrl || ""
  }

  return ""
}

function getCollectionItemName(item: ProductDto) {
  return item.name || item.nameEn || item.nameAr || "Unnamed item"
}

export default function CollectionDetailsPage() {
  const params = useParams()
  const router = useRouter()
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
        <Button onClick={() => router.push("/admin/collections")}>Back to Collections</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-[#7B3F32] hover:bg-[#f7ebe4]">
            <Link href="/admin/collections">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7d73]">Collection Details</p>
            <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">{collection.name}</h1>
          </div>
        </div>

        <Button asChild className="bg-[#7B3F32] text-white hover:bg-[#5f3026] rounded-2xl px-6 h-11 font-bold">
          <Link href={`/admin/collections/${collection.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" /> Edit Collection
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                <Image 
                  src={getImageUrl(collection.mainImage || "")} 
                  alt={collection.name || ""} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-slate-600 leading-relaxed">{collection.description || "No description provided."}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Collection Items ({(collection.items?.length || 0) + (collection.collectionItems?.filter(ci => ci.item).length || 0)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Check both top-level items and nested collectionItems */}
                {[
                  ...(collection.items || []),
                  ...(collection.collectionItems?.map(ci => ci.item).filter(Boolean) || [])
                ].map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-white hover:border-[#7B3F32]/20 transition-colors">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                      <Image src={getImageUrl(getCollectionItemImage(item))} alt={getCollectionItemName(item)} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{getCollectionItemName(item)}</p>
                      <p className="text-sm text-slate-500">{item.sku || "No SKU"}</p>
                      <p className="text-sm font-bold text-[#7B3F32]">{item.price?.toLocaleString() || 0} EGP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {collection.changes && collection.changes.length > 0 && (
            <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Price Variants (Changes)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collection.changes.map((change) => (
                    <div key={change.id} className="p-4 rounded-2xl border border-slate-100 bg-[#faf4ef]/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#2f2219]">{change.changeName || change.newName}</h4>
                        {change.overPrice && (
                          <Badge className="bg-[#7B3F32]">+{change.overPrice.toLocaleString()} EGP</Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#6f6157] mb-3">{change.newDescription}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {change.newDimensions && (
                          <span className="px-2 py-1 bg-white rounded-md border border-[#7B3F32]/10">Dim: {change.newDimensions}</span>
                        )}
                        {change.newSKU && (
                          <span className="px-2 py-1 bg-white rounded-md border border-[#7B3F32]/10">SKU: {change.newSKU}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-bottom border-slate-50">
                <span className="text-slate-500">Price</span>
                <span className="font-bold text-[#7B3F32]">{collection.price?.toLocaleString()} EGP</span>
              </div>
              {collection.oldPrice && collection.oldPrice > 0 && (
                <div className="flex justify-between py-2 border-bottom border-slate-50">
                  <span className="text-slate-500">Old Price</span>
                  <span className="text-slate-400 line-through">{collection.oldPrice.toLocaleString()} EGP</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-bottom border-slate-50">
                <span className="text-slate-500">SKU</span>
                <span className="font-medium">{collection.sku || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-bottom border-slate-50">
                <span className="text-slate-500">Stock</span>
                <Badge variant={collection.stockNumber && collection.stockNumber > 0 ? "default" : "destructive"}>
                  {collection.stockNumber || 0} in stock
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-bottom border-slate-50">
                <span className="text-slate-500">Material</span>
                <span className="font-medium">{collection.material || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-bottom border-slate-50">
                <span className="text-slate-500">Colors</span>
                <span className="font-medium truncate max-w-[150px]">{collection.colors || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          {collection.collectionFabrics && collection.collectionFabrics.length > 0 && (
            <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Fabrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {collection.collectionFabrics.map((fabric) => (
                    <div key={fabric.id} className="flex flex-col items-center gap-2 p-2 rounded-xl border border-slate-50 bg-white shadow-sm">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-50">
                        <Image src={getImageUrl(fabric.imageUrl || "")} alt={fabric.name || ""} fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-semibold text-center truncate w-full">{fabric.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
