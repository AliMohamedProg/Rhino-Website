"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronUp, ChevronDown, Filter } from "lucide-react"
import { formatPrice } from "@/lib/products"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { ProductCard } from "@/components/ui/ProductCard"

interface Item {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  price: number
  oldPrice?: number
  discountAmount: number
  stockNumber: number
  overallRating: number
  categoryId: string
  colorsEn?: string
  colorsAr?: string
  mainImage?: string
}

interface Category {
  id: string
  nameAr: string
  nameEn: string
}

interface ReviewStats {
  average: number
  count: number
}

function toSafeNumber(value: unknown): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function getOriginalPriceValue(price: number, oldPrice: number, discountAmount: number): number | undefined {
  if (oldPrice > price) return oldPrice
  if (discountAmount > 0 && discountAmount < 100 && price > 0) {
    return Math.round(price / (1 - discountAmount / 100))
  }
  return undefined
}

function getOriginalPriceLabel(price: number, oldPrice: number, discountAmount: number): string | undefined {
  const originalPriceValue = getOriginalPriceValue(price, oldPrice, discountAmount)
  return originalPriceValue && originalPriceValue > price
    ? `${formatPrice(originalPriceValue)} EGP`
    : undefined
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.slug as string

  const { language } = useLanguage()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  const [products, setProducts] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [hideOutOfStock, setHideOutOfStock] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [sortBy, setSortBy] = useState("featured")
  const [availabilityOpen, setAvailabilityOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>("")
  const [reviewStatsByProductId, setReviewStatsByProductId] = useState<Record<string, ReviewStats>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [itemsData, categoriesData] = await Promise.all([
          ApiClient.get<any[]>("api/Items"),
          ApiClient.get<any[]>("api/Category"),
        ])

        const normalizedCategories = (Array.isArray(categoriesData) ? categoriesData : [])
          .map((cat) => ({
            id: cat.id ?? cat.Id ?? "",
            nameAr: cat.nameAr ?? cat.NameAr ?? "",
            nameEn: cat.nameEn ?? cat.NameEn ?? "",
          }))
          .filter((cat) => Boolean(cat.id))

        setCategories(normalizedCategories)

        const matchedCategory = normalizedCategories.find(
          (cat) =>
            cat.id === categoryId ||
            cat.nameEn?.toLowerCase() === categoryId.toLowerCase()
        )
        const targetCategoryId = matchedCategory?.id ?? categoryId

        const normalized = (Array.isArray(itemsData) ? itemsData : []).map((item) => ({
          ...item,
          id: item.id ?? item.Id ?? "",
          nameAr: item.nameAr ?? item.NameAr ?? "",
          nameEn: item.nameEn ?? item.NameEn ?? "",
          descriptionAr: item.descriptionAr ?? item.DescriptionAr ?? "",
          descriptionEn: item.descriptionEn ?? item.DescriptionEn ?? "",
          price: toSafeNumber(item.price ?? item.Price),
          oldPrice: toSafeNumber(item.oldPrice ?? item.OldPrice),
          stockNumber: toSafeNumber(item.stockNumber ?? item.StockNumber),
          categoryId: item.categoryId ?? item.CategoryId ?? "",
          overallRating: toSafeNumber(item.overallRating ?? item.OverallRating),
          discountAmount: toSafeNumber(item.discountAmount ?? item.DiscountAmount),
          mainImage: item.mainImage ?? item.MainImage ?? item.image ?? item.Image ?? "",
          colorsEn: item.colorsEn ?? item.ColorsEn ?? item.colors ?? item.Colors ?? "",
          colorsAr: item.colorsAr ?? item.ColorsAr ?? item.colors ?? item.Colors ?? "",
        })) as Item[]
        setActiveCategoryId(targetCategoryId)
        setProducts(normalized)
        setSelectedCategories([targetCategoryId])

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId])

  useEffect(() => {
    if (products.length === 0) {
      setReviewStatsByProductId({})
      return
    }

    let cancelled = false
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")
    const productIds = Array.from(new Set(products.map((p) => p.id).filter(Boolean)))

    const fetchReviewStats = async () => {
      const entries = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const [avgRes, countRes] = await Promise.all([
              fetch(`${apiBase}/api/review/get-average-reviews?productId=${encodeURIComponent(productId)}`),
              fetch(`${apiBase}/api/review/get-reviews-count?productId=${encodeURIComponent(productId)}`)
            ])

            if (!avgRes.ok || !countRes.ok) return [productId, null] as const

            const average = await avgRes.json()
            const count = await countRes.json()

            return [productId, { average: Number(average) || 0, count: Number(count) || 0 }] as const
          } catch {
            return [productId, null] as const
          }
        })
      )

      if (cancelled) return

      const nextStats: Record<string, ReviewStats> = {}
      for (const [productId, stats] of entries) {
        if (stats) nextStats[productId] = stats
      }
      setReviewStatsByProductId(nextStats)
    }

    fetchReviewStats()
    return () => {
      cancelled = true
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (hideOutOfStock) result = result.filter(p => p.stockNumber > 0)
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (selectedCategories.length)
      result = result.filter(p => selectedCategories.includes(p.categoryId))

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break
      case "price-high": result.sort((a, b) => b.price - a.price); break
      case "rating":
        result.sort(
          (a, b) =>
            (reviewStatsByProductId[b.id]?.average ?? b.overallRating) -
            (reviewStatsByProductId[a.id]?.average ?? a.overallRating)
        )
        break
    }

    return result
  }, [products, hideOutOfStock, priceRange, selectedCategories, sortBy, reviewStatsByProductId])

  const categoryNameById = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, cat) => {
        acc[cat.id] = language === "ar" ? cat.nameAr : cat.nameEn
        return acc
      }, {}),
    [categories, language]
  )

  const activeCategoryName =
    categoryNameById[activeCategoryId] ||
    categoryNameById[categoryId] ||
    (language === "ar" ? "التصنيف" : "Category")

  const resetFilters = () => {
    setHideOutOfStock(false)
    setPriceRange([0, 500000])
    setSelectedCategories([activeCategoryId || categoryId])
    setSortBy("featured")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-[#f8efe6] via-[#f7efe7] to-[#f5ebe0] pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_60px_rgba(123,63,50,0.08)] mb-6">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#7B3F32]/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#C1AFA0]/30 blur-2xl" />
            <p className="text-[11px] tracking-[0.25em] text-[#7B3F32]/70 font-semibold uppercase">
              {language === "ar" ? "تسوق حسب التصنيف" : "Shop By Category"}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mt-2">{activeCategoryName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-sm text-[#7B3F32] border border-[#7B3F32]/15">
                {filteredProducts.length} {language === "ar" ? "منتج" : "products"}
              </span>
              {hideOutOfStock && (
                <span className="inline-flex items-center rounded-full bg-[#7B3F32] text-white px-4 py-1.5 text-sm">
                  {language === "ar" ? "المتاح فقط" : "In stock only"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <aside className="w-full lg:w-72">
              <div className="bg-white/80 border border-white/60 rounded-2xl p-5 sticky top-28 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#7B3F32]/10">
                  <Filter size={18} className="text-[#7B3F32]" />
                  <span className="font-semibold tracking-wide text-[#3D2B1F]">{language === "ar" ? "تصفية" : "Filter"}</span>
                </div>

                {/* Availability */}
                <Collapsible open={availabilityOpen} onOpenChange={setAvailabilityOpen}>
                  <CollapsibleTrigger className="flex justify-between items-center w-full py-2.5 px-2 rounded-xl hover:bg-[#7B3F32]/5 transition-colors text-[#3D2B1F]">
                    {language === "ar" ? "التوافر" : "Availability"} {availabilityOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-2 px-2">
                    <label className="flex items-center gap-2 text-sm text-[#5A4A40]">
                      <Checkbox
                        checked={hideOutOfStock}
                        onCheckedChange={(v) => setHideOutOfStock(!!v)}
                      />
                      {language === "ar" ? "المتاح فقط" : "In Stock Only"}
                    </label>
                  </CollapsibleContent>
                </Collapsible>

                {/* Price */}
                <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
                  <CollapsibleTrigger className="flex justify-between items-center w-full py-2.5 px-2 rounded-xl hover:bg-[#7B3F32]/5 transition-colors text-[#3D2B1F]">
                    {language === "ar" ? "السعر" : "Price"} {priceOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-2 px-2">
                    <Slider value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} max={500000} step={500} />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Categories */}
                <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <CollapsibleTrigger className="flex justify-between items-center w-full py-2.5 px-2 rounded-xl hover:bg-[#7B3F32]/5 transition-colors text-[#3D2B1F]">
                    {language === "ar" ? "التصنيفات" : "Categories"} {categoryOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 py-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#7B3F32]/5 transition-colors text-sm text-[#5A4A40]">
                        <Checkbox
                          checked={selectedCategories.includes(cat.id)}
                          onCheckedChange={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                            )
                          }
                        />
                        {language === "ar" ? cat.nameAr : cat.nameEn}
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>



                <Button onClick={resetFilters} variant="outline" className="w-full mt-5 rounded-xl border-[#7B3F32]/20 hover:bg-[#7B3F32] hover:text-white transition-colors">
                  {language === "ar" ? "إعادة تعيين" : "Reset"}
                </Button>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 mb-5 p-4 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-bold text-[#3D2B1F]">{language === "ar" ? "المنتجات" : "Products"}</h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 rounded-xl border-[#7B3F32]/20 bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low</SelectItem>
                    <SelectItem value="price-high">Price: High</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-3xl border border-white/60 bg-white/70 p-6 min-h-[460px] animate-pulse"
                    >
                      <div className="h-56 rounded-2xl bg-[#7B3F32]/10 mb-6" />
                      <div className="h-4 w-2/5 bg-[#7B3F32]/10 rounded mb-4" />
                      <div className="h-7 w-4/5 bg-[#7B3F32]/15 rounded mb-3" />
                      <div className="h-4 w-full bg-[#7B3F32]/10 rounded mb-2" />
                      <div className="h-4 w-3/4 bg-[#7B3F32]/10 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-white/60 bg-white/75 backdrop-blur-sm p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                  <h3 className="text-2xl font-bold text-[#3D2B1F] mb-2">{language === "ar" ? "لا توجد منتجات" : "No products found"}</h3>
                  <p className="text-[#7B3F32]/75 mb-6">
                    {language === "ar"
                      ? "جرّب تغيير الفلاتر للعثور على نتائج."
                      : "Try adjusting your filters to find matching products."}
                  </p>
                  <Button onClick={resetFilters} className="rounded-xl bg-[#7B3F32] hover:bg-[#5e3127] text-white">
                    {language === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      category={(categoryNameById[product.categoryId] || "FURNITURE").toUpperCase()}
                      title={language === "ar" ? product.nameAr : product.nameEn}
                      description={language === "ar" ? product.nameAr : product.nameEn}
                      price={`${formatPrice(product.price)} EGP`}
                      discountAmount={product.discountAmount || 0}
                      originalPrice={getOriginalPriceLabel(product.price, product.oldPrice ?? 0, product.discountAmount || 0)}
                      rating={reviewStatsByProductId[product.id]?.average ?? product.overallRating ?? 0}
                      reviewsCountVal={reviewStatsByProductId[product.id]?.count ?? 0}
                      mainImage={product.mainImage}
                      colorsRaw={product.colorsEn}
                      stockNumber={product.stockNumber}
                      isWishlisted={isInWishlist(product.id)}
                      onAddToCart={async (productId, selectedColorName) => {
                        await addItem(productId, 1, selectedColorName)
                      }}
                      onToggleWishlist={(productId) => {
                        const originalPriceValue = getOriginalPriceValue(product.price, product.oldPrice ?? 0, product.discountAmount || 0)
                        toggleItem({
                          id: productId,
                          name: { ar: product.nameAr, en: product.nameEn },
                          price: product.price,
                          originalPrice: originalPriceValue,
                          image: product.mainImage || "/placeholder.svg",
                        })
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
