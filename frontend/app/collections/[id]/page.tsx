"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Loader2, Package, Palette, Ruler, Sparkles, X } from "lucide-react"

import { ApiClient } from "@/app/ApiHelper/ApiClient"
import type { CollectionDto, ProductDto } from "@/app/ApiHelper/types"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/context/language-context"
import { formatPrice } from "@/lib/products"
import { cn, getImageUrl, parseColors } from "@/lib/utils"

function getProductName(item: ProductDto) {
  return item.name || item.nameEn || item.nameAr || "Unnamed item"
}

function getProductImage(item: ProductDto) {
  if (item.mainImage) return item.mainImage
  if (item.imageUrl) return item.imageUrl

  const firstImage = Array.isArray(item.images) ? item.images[0] : undefined
  if (typeof firstImage === "string") return firstImage
  if (firstImage && typeof firstImage === "object" && "imageUrl" in firstImage) {
    return String(firstImage.imageUrl || "")
  }

  return ""
}

export default function CollectionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { language } = useLanguage()

  const [collection, setCollection] = useState<CollectionDto | null>(null)
  const [baseCollection, setBaseCollection] = useState<CollectionDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingChange, setLoadingChange] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedFabric, setSelectedFabric] = useState("")
  const [selectedChangeId, setSelectedChangeId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await ApiClient.collection.getById(id)
        setCollection(data)
        setBaseCollection(data)
      } catch (error) {
        console.error("Failed to fetch collection details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCollection()
  }, [id])

  const galleryImages = useMemo(() => {
    if (!collection) return []

    const raw = [
      collection.mainImage || "",
      ...(collection.collectionImages?.map((image) => image.imageUrl || "") || []),
    ]

    return Array.from(new Set(raw.map((image) => image.trim()).filter(Boolean)))
  }, [collection])

  const colors = useMemo(() => parseColors(collection?.colors), [collection?.colors])

  useEffect(() => {
    setSelectedImageIndex(0)
    setIsZoomed(false)
  }, [collection?.id])

  useEffect(() => {
    setSelectedColor(colors[0]?.name || "")
  }, [colors])

  useEffect(() => {
    setSelectedFabric(collection?.collectionFabrics?.[0]?.name || "")
  }, [collection?.collectionFabrics])

  const handleChangeClick = async (changeId: string) => {
    if (!collection?.id) return

    // If clicking the already-selected change, reset to base
    if (selectedChangeId === changeId) {
      setSelectedChangeId(null)
      setCollection(baseCollection)
      return
    }

    setLoadingChange(true)
    setSelectedChangeId(changeId)
    try {
      const data = await ApiClient.collection.getWithChange(collection.id, changeId)
      // Preserve the changes list and collectionItems from the base collection
      setCollection({
        ...data,
        changes: baseCollection?.changes || data.changes,
        collectionItems: baseCollection?.collectionItems || data.collectionItems,
        collectionFabrics: baseCollection?.collectionFabrics || data.collectionFabrics,
        collectionImages: data.collectionImages?.length ? data.collectionImages : baseCollection?.collectionImages,
      })
    } catch (error) {
      console.error("Failed to fetch collection with change:", error)
    } finally {
      setLoadingChange(false)
    }
  }

  const allItems = useMemo(() => {
    if (!collection) return []
    return [
      ...(collection.items || []),
      ...(collection.collectionItems?.map(ci => ci.item).filter(Boolean) || [])
    ]
  }, [collection])
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8efe6] via-[#f7efe7] to-[#f5ebe0]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white/80 px-10 py-12 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-muted-foreground">Loading collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8efe6] via-[#f7efe7] to-[#f5ebe0]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center rounded-3xl border border-white/70 bg-white/80 px-10 py-12 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <h2 className="text-2xl font-bold text-[#2f2219] mb-2">Collection Not Found</h2>
            <p className="text-[#6f6157]">Sorry, we couldn't find this collection.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const originalPrice =
    collection.oldPrice ??
    (collection.discountAmount && collection.discountAmount > 0 && (collection.price ?? 0) > 0
      ? Math.round((collection.price ?? 0) / (1 - collection.discountAmount / 100))
      : 0)

  const discountedPrice = collection.price ?? 0
  const isInStock = (collection.stockNumber ?? 0) > 0
  const productImages = galleryImages.length > 0 ? galleryImages : [collection.mainImage || "/placeholder.svg"]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8efe6] via-[#f7efe7] to-[#f5ebe0]">
      <Header />

      <section className="container mx-auto px-4 pt-28 md:pt-32 pb-12">
        <div className="mb-6 text-sm text-muted-foreground inline-flex items-center rounded-full border border-[#7B3F32]/15 bg-white/80 px-4 py-2 backdrop-blur-sm">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Collections</span>
          <span className="mx-2">/</span>
          <span className="text-[#3D2B1F] font-medium">{collection.name || "Collection"}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div
              className="relative h-[450px] bg-white/75 rounded-3xl border border-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex items-center justify-center cursor-zoom-in backdrop-blur-sm"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={getImageUrl(productImages[selectedImageIndex])}
                alt={collection.name || "Collection"}
                fill
                className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"}`}
              />
              {!!collection.discountAmount && collection.discountAmount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full font-medium text-sm shadow-lg">
                  -{Math.round(collection.discountAmount)}%
                </span>
              )}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-medium text-sm shadow-lg flex items-center gap-1.5 ${isInStock ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {isInStock ? <Check size={14} /> : <X size={14} />}
                {isInStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all bg-white/80 ${
                    selectedImageIndex === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-[#7B3F32]/15 hover:border-[#7B3F32]/35"
                  }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${collection.name || "Collection"} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl p-6 md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white/80 hover:bg-white">
                  <ArrowLeft size={18} />
                </Button>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7b6f]">
                  {language === "ar" ? "تفاصيل المجموعة" : "Collection Details"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-[#2f2219]">
                {collection.name || "Collection"}
              </h1>
              {selectedChangeId && (
                <span className="inline-flex items-center gap-1.5 bg-[#7B3F32]/10 text-[#7B3F32] px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <Check size={12} /> Variant Applied
                </span>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-[#7B3F32]">
                  <Sparkles size={16} />
                  <span className="font-semibold">{(collection.overallRating ?? 0).toFixed(1)}</span>
                </div>
                <span className="text-sm font-medium text-[#6f6157]">
                  {allItems.length} included item{allItems.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-4xl font-bold text-[#7B3F32]">{formatPrice(discountedPrice)} EGP</span>
                {!!collection.discountAmount && collection.discountAmount > 0 && originalPrice > 0 && (
                  <span className="text-xl line-through text-gray-400">{formatPrice(originalPrice)} EGP</span>
                )}
                {!!collection.discountAmount && collection.discountAmount > 0 && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(collection.discountAmount)}% OFF
                  </span>
                )}
              </div>

              <div className="mb-6">
                <span className="text-[#6f6157]">Stock: </span>
                <span className={cn("font-semibold", isInStock ? "text-green-600" : "text-red-500")}>
                  {collection.stockNumber ?? 0} items
                </span>
              </div>

              {colors.length > 0 && (
                <div className="mb-6">
                  <span className="text-[#6f6157] block mb-3 font-semibold uppercase tracking-wider text-xs">
                    Select Finish
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color, index) => (
                      <button
                        key={`${color.name}-${index}`}
                        onClick={() => setSelectedColor(color.name)}
                        className="group flex flex-col items-center gap-2"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                            selectedColor === color.name
                              ? "border-primary ring-2 ring-primary/20 scale-110 shadow-lg"
                              : "border-[#7B3F32]/15 hover:border-[#7B3F32]/35 shadow-sm"
                          )}
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor === color.name && (
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                color.hex.toLowerCase() === "#ffffff" || color.name.toLowerCase() === "white" ? "bg-black" : "bg-white"
                              )}
                            />
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold tracking-wide transition-colors uppercase",
                          selectedColor === color.name ? "text-primary" : "text-[#8c7b6f]"
                        )}>
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!!collection.collectionFabrics?.length && (
                <div className="mb-6">
                  <span className="text-[#6f6157] block mb-3 font-semibold uppercase tracking-wider text-xs">
                    Select Fabric
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {collection.collectionFabrics.map((fabric) => (
                      <button
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric.name || "")}
                        className="group flex flex-col items-center gap-2"
                      >
                        <div
                          className={cn(
                            "relative w-12 h-12 rounded-lg border-2 transition-all duration-300 overflow-hidden",
                            selectedFabric === fabric.name
                              ? "border-primary ring-2 ring-primary/20 scale-110 shadow-lg"
                              : "border-[#7B3F32]/15 hover:border-[#7B3F32]/35 shadow-sm"
                          )}
                        >
                          <Image
                            src={getImageUrl(fabric.imageUrl || "")}
                            alt={fabric.name || "Fabric"}
                            fill
                            className="object-cover"
                          />
                          {selectedFabric === fabric.name && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold tracking-wide transition-colors uppercase",
                          selectedFabric === fabric.name ? "text-primary" : "text-[#8c7b6f]"
                        )}>
                          {fabric.name || "Fabric"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {collection.material && collection.material.trim().length > 0 && (
                <div className="mb-6">
                  <span className="text-[#6f6157] block mb-2">Material:</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 border border-[#7B3F32]/15 rounded-full text-sm font-medium bg-white text-[#3D2B1F]">
                      {collection.material}
                    </span>
                  </div>
                </div>
              )}

              {collection.changes && collection.changes.length > 0 && (
                <div className="mb-6">
                  <span className="text-[#6f6157] block mb-3 font-semibold uppercase tracking-wider text-xs">
                    Select Variant
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {collection.changes.map((change) => (
                      <button
                        key={change.id}
                        onClick={() => change.id && handleChangeClick(change.id)}
                        disabled={loadingChange}
                        className={cn(
                          "px-4 py-2 rounded-xl border-2 transition-all duration-300 flex items-center gap-2",
                          selectedChangeId === change.id
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-[#7B3F32]/15 bg-white/50 text-[#6f6157] hover:border-[#7B3F32]/35"
                        )}
                      >
                        <span className="text-xs font-bold uppercase truncate max-w-[120px]">
                          {change.changeName || change.newName}
                        </span>
                        {loadingChange && selectedChangeId === change.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : selectedChangeId === change.id ? (
                          <Check size={12} />
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl border border-[#7B3F32]/10 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8c7b6f] mb-2">SKU</p>
                  <p className="font-semibold text-[#2f2219]">{collection.sku || "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-[#7B3F32]/10 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8c7b6f] mb-2">Dimensions</p>
                  <p className="font-semibold text-[#2f2219]">{collection.dimensions || "N/A"}</p>
                </div>
              </div>

              <p className="text-[#6f6157] leading-7">
                {collection.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white/80 p-1 border border-[#7B3F32]/10">
              <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
              <TabsTrigger value="changes" className="rounded-xl">Changes</TabsTrigger>
              <TabsTrigger value="items" className="rounded-xl">Included Items</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                  <Package className="h-5 w-5 text-[#7B3F32] mb-3" />
                  <p className="text-sm text-[#8c7b6f] mb-2">Collection Package</p>
                  <p className="font-semibold text-[#2f2219]">
                    Includes {allItems.length} item{allItems.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                  <Palette className="h-5 w-5 text-[#7B3F32] mb-3" />
                  <p className="text-sm text-[#8c7b6f] mb-2">Available Fabrics</p>
                  <p className="font-semibold text-[#2f2219]">{collection.collectionFabrics?.length || 0} options</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                  <Ruler className="h-5 w-5 text-[#7B3F32] mb-3" />
                  <p className="text-sm text-[#8c7b6f] mb-2">Dimensions</p>
                  <p className="font-semibold text-[#2f2219]">{collection.dimensions || "N/A"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="changes" className="mt-6">
              <div className="space-y-4">
                {collection.changes?.length ? collection.changes.map((change) => (
                  <button
                    key={change.id}
                    onClick={() => change.id && handleChangeClick(change.id)}
                    disabled={loadingChange}
                    className={cn(
                      "w-full text-left rounded-3xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer",
                      selectedChangeId === change.id
                        ? "border-2 border-[#7B3F32] bg-[#7B3F32]/5 ring-2 ring-[#7B3F32]/15"
                        : "border border-white/70 bg-white/80 hover:border-[#7B3F32]/40 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(0,0,0,0.08)]"
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-[#2f2219]">{change.changeName || change.newName || "Change"}</h3>
                          {selectedChangeId === change.id && (
                            <span className="flex items-center gap-1 bg-[#7B3F32] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                              <Check size={12} /> Active
                            </span>
                          )}
                          {loadingChange && selectedChangeId === change.id && (
                            <Loader2 size={16} className="animate-spin text-[#7B3F32]" />
                          )}
                        </div>
                        {change.newDescription && (
                          <p className="mt-2 text-[#6f6157]">{change.newDescription}</p>
                        )}
                      </div>
                      {change.overPrice !== undefined && change.overPrice > 0 && (
                        <span className="bg-[#ead7cb] text-[#7B3F32] px-3 py-1 rounded-full text-sm font-medium">
                          +{formatPrice(change.overPrice)} EGP
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {change.newDimensions && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#7B3F32]/10 bg-white px-4 py-2 text-sm font-medium text-[#3D2B1F]">
                          <Ruler size={14} /> {change.newDimensions}
                        </span>
                      )}
                      {change.newSKU && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#7B3F32]/10 bg-white px-4 py-2 text-sm font-medium text-[#3D2B1F]">
                          <Package size={14} /> {change.newSKU}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-[#8c7b6f]">
                      {selectedChangeId === change.id ? "Click again to deselect" : "Click to apply this variant"}
                    </p>
                  </button>
                )) : (
                  <div className="rounded-3xl border border-white/70 bg-white/80 p-6 text-[#6f6157] shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                    No custom changes available for this collection.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {allItems.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="flex items-center gap-4 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(0,0,0,0.08)]"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f5ebe0]">
                      <Image
                        src={getImageUrl(getProductImage(item))}
                        alt={getProductName(item)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-[#2f2219] truncate">{getProductName(item)}</p>
                      <p className="text-sm text-[#8b7d73] mb-2">{item.sku || "No SKU"}</p>
                      <p className="text-sm text-[#6f6157] line-clamp-2">{item.description || "Included in this collection package."}</p>
                      <p className="mt-3 text-base font-semibold text-[#7B3F32]">{formatPrice(item.price ?? 0)} EGP</p>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
