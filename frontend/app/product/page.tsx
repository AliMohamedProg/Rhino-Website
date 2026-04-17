"use client"

import { useState, useEffect, useMemo, type MouseEvent } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
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
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import { formatPrice } from "@/lib/products"
import { getImageUrl } from "@/lib/utils"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

interface Item {
  id: string
  nameAr: string
  nameEn: string
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

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.slug as string

  const { language, t } = useLanguage()

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
          discountAmount: item.discountAmount ?? item.DiscountAmount ?? 0,
          mainImage: item.mainImage ?? item.MainImage ?? item.image ?? item.Image ?? "",
          colorsEn: item.colorsEn ?? item.ColorsEn ?? item.colors ?? item.Colors ?? "",
          colorsAr: item.colorsAr ?? item.ColorsAr ?? item.colors ?? item.Colors ?? "",
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
  }, [categoryId])

  const ProductGridCard = ({ product }: { product: Item }) => {
    const [selectedColor, setSelectedColor] = useState("")
    const [adding, setAdding] = useState(false)

    const colorsEn = product.colorsEn
      ? product.colorsEn.split(",").map((c) => c.trim()).filter(Boolean)
      : []
    const colorsAr = product.colorsAr
      ? product.colorsAr.split(",").map((c) => c.trim()).filter(Boolean)
      : []
    const colors = language === "ar" ? colorsAr : colorsEn
    const displayColors = colors
    const discountedPrice = product.discountAmount > 0 ? product.price * (1 - product.discountAmount / 100) : product.price
    const isInStock = product.stockNumber > 0

    const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (colorsEn.length > 0 && !selectedColor) {
        toast.error(
          language === "ar"
            ? "يرجى اختيار لون قبل الإضافة للسلة"
            : "Please select a color before adding to cart"
        )
        return
      }

      try {
        setAdding(true)
        const res = await fetch("https://rhino-web.runasp.net/api/Cart/add-to-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
            color: selectedColor || "Default",
          }),
        })

        if (res.ok) {
          window.location.href = "/cart"
        } else if (res.status === 401) {
          window.location.href = "/login"
        }
      } catch (error) {
        console.error("Failed to add to cart:", error)
      } finally {
        setAdding(false)
      }
    }

    return (
      <div className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
        <Link href={`/product/${product.id}`} className="block relative h-48 md:h-56 bg-secondary">
          <Image
            src={getImageUrl(product.mainImage)}
            alt={language === "ar" ? product.nameAr : product.nameEn}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.discountAmount > 0 && (
            <span className="absolute top-2 start-2 bg-red-600 text-xs px-2 py-1 rounded text-white font-medium">
              {language === "ar" ? `${product.discountAmount}%-` : `-${product.discountAmount}%`}
            </span>
          )}

          <span
            className={`absolute bottom-2 start-2 px-2 py-1 text-xs rounded font-medium ${
              isInStock ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {isInStock
              ? language === "ar" ? "متاح" : "In Stock"
              : language === "ar" ? "غير متاح" : "Out of Stock"}
          </span>
        </Link>

        <div className="p-3 md:p-4 flex flex-col flex-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 mb-2 hover:text-primary transition-colors">
              {language === "ar" ? product.nameAr : product.nameEn}
            </h3>
          </Link>

          <div className="flex gap-2 mb-3">
            <span className="font-bold text-foreground">
              {formatPrice(discountedPrice)} {t("products.price")}
            </span>
            {product.discountAmount > 0 && (
              <span className="line-through text-sm text-muted-foreground">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {displayColors.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {displayColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedColor(color)
                    }}
                    className={`px-2 py-1 text-xs border rounded transition-all ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                    }`}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
              disabled={adding}
            >
              <ShoppingCart size={16} className="me-2" />
              {adding
                ? language === "ar" ? "جاري الإضافة..." : "Adding..."
                : t("products.addToCart")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <aside className="w-full lg:w-72">
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
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductGridCard key={product.id} product={product} />
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

