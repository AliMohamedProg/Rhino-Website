"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
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
  discountAmount: number // decimal ex: 0.25
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

function getColorNamesFromApi(item: any, language: "en" | "ar"): string[] {
  const source = item?.colors ?? item?.Colors
  if (!Array.isArray(source)) return []

  return source
    .map((color: any) => {
      if (typeof color === "string") return color.trim()
      if (language === "ar") {
        return (color?.nameAr ?? color?.NameAr ?? color?.nameEn ?? color?.NameEn ?? "").trim()
      }
      return (color?.nameEn ?? color?.NameEn ?? color?.nameAr ?? color?.NameAr ?? "").trim()
    })
    .filter(Boolean)
}

export default function CategoryPage() {
  const { language } = useLanguage()

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await ApiClient.get("api/Items")
        const normalized = (items as any[]).map((item) => ({
          ...item,
          id: item.id ?? item.Id ?? "",
          nameAr: item.nameAr ?? item.NameAr ?? "",
          nameEn: item.nameEn ?? item.NameEn ?? "",
          descriptionAr: item.descriptionAr ?? item.DescriptionAr ?? "",
          descriptionEn: item.descriptionEn ?? item.DescriptionEn ?? "",
          price: item.price ?? item.Price ?? 0,
          stockNumber: item.stockNumber ?? item.StockNumber ?? 0,
          overallRating: item.overallRating ?? item.OverallRating ?? 0,
          categoryId: item.categoryId ?? item.CategoryId ?? "",
          discountAmount: item.discountAmount ?? item.DiscountAmount ?? 0,
          mainImage: item.mainImage ?? item.MainImage ?? item.image ?? item.Image ?? "",
          colorsEn:
            item.colorsEn ??
            item.ColorsEn ??
            getColorNamesFromApi(item, "en").join(","),
          colorsAr:
            item.colorsAr ??
            item.ColorsAr ??
            getColorNamesFromApi(item, "ar").join(","),
        })) as Item[]
        setProducts(normalized)

        const catData = await ApiClient.get("api/category")
        setCategories(catData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categoryNameById = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, cat) => {
        acc[cat.id] = language === "ar" ? cat.nameAr : cat.nameEn
        return acc
      }, {}),
    [categories, language]
  )

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (hideOutOfStock)
      result = result.filter(p => p.stockNumber > 0)

    result = result.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    if (selectedCategories.length)
      result = result.filter(p =>
        selectedCategories.includes(p.categoryId)
      )

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.overallRating - a.overallRating)
        break
    }

    return result
  }, [products, hideOutOfStock, priceRange, selectedCategories, sortBy])

  if (loading)
    return <p className="text-center py-20">Loading...</p>

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />

      <main className="flex-1 bg-background w-full min-h-0 pt-24 md:pt-28">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <aside className="w-full h-full lg:w-72">
              <div className="bg-card border rounded-lg p-4 sticky top-4">

                <div className="flex items-center gap-2 mb-6">
                  <Filter size={18} />
                  <span className="font-semibold">
                    {language === "ar" ? "تصفية" : "Filter"}
                  </span>
                </div>

                {/* Availability */}
                <Collapsible open={availabilityOpen} onOpenChange={setAvailabilityOpen}>
                  <CollapsibleTrigger className="flex justify-between w-full py-2">
                    {language === "ar" ? "التوافر" : "Availability"}
                    {availabilityOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={hideOutOfStock}
                        onCheckedChange={v => setHideOutOfStock(!!v)}
                      />
                      {language === "ar" ? "المتاح فقط" : "In Stock Only"}
                    </label>
                  </CollapsibleContent>
                </Collapsible>

                {/* Price */}
                <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
                  <CollapsibleTrigger className="flex justify-between w-full py-2">
                    {language === "ar" ? "السعر" : "Price"}
                    {priceOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(v) => setPriceRange(v as [number, number])}
                      max={500000}
                      step={500}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Categories */}
                <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <CollapsibleTrigger className="flex justify-between w-full py-2">
                    {language === "ar" ? "التصنيفات" : "Categories"}
                    {categoryOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex gap-2">
                        <Checkbox
                          checked={selectedCategories.includes(cat.id)}
                          onCheckedChange={() =>
                            setSelectedCategories(prev =>
                              prev.includes(cat.id)
                                ? prev.filter(c => c !== cat.id)
                                : [...prev, cat.id]
                            )
                          }
                        />
                        {language === "ar" ? cat.nameAr : cat.nameEn}
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    category={(categoryNameById[product.categoryId] || "FURNITURE").toUpperCase()}
                    title={language === "ar" ? product.nameAr : product.nameEn}
                    description={
                      language === "ar"
                        ? product.descriptionAr || product.nameAr
                        : product.descriptionEn || product.nameEn
                    }
                    price={`${formatPrice(product.price)} EGP`}
                    discountAmount={product.discountAmount || 0}
                    originalPrice={
                      product.discountAmount > 0
                        ? `${formatPrice(Math.round(product.price / (1 - product.discountAmount / 100)))} EGP`
                        : undefined
                    }
                    rating={product.overallRating || 4.8}
                    reviewsCount={89}
                    mainImage={product.mainImage}
                    colorsRaw={product.colorsEn}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

