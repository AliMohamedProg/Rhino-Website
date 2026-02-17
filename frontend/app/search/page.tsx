"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ShoppingCart, Search } from "lucide-react"
import { formatPrice } from "@/lib/products"

type SearchItem = {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  price: number
  discountAmount: number
  stockNumber: number
  colors?: string
  mainImage?: string
}

function SearchProductCard({ product }: { product: SearchItem }) {
  const { language, t } = useLanguage()
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [adding, setAdding] = useState(false)

  const colors = product.colors
    ? product.colors.split(",").map((c) => c.trim()).filter(Boolean)
    : []
  const displayColors = colors.slice(0, 3)
  const originalPrice = product.price + product.discountAmount
  const isInStock = product.stockNumber > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (colors.length > 0 && !selectedColor) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار لون قبل الإضافة للسلة"
          : "Please select a color before adding to cart"
      )
      return
    }

    try {
      setAdding(true)
      const res = await fetch("https://localhost:7282/api/Cart/add-to-cart", {
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
          src={product.mainImage || "/placeholder.svg"}
          alt={language === "ar" ? product.nameAr : product.nameEn}
          fill
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
            {formatPrice(product.price)} {t("products.price")}
          </span>
          {product.discountAmount > 0 && (
            <span className="line-through text-sm text-muted-foreground">
              {formatPrice(originalPrice)}
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
            {adding ? (language === "ar" ? "جاري الإضافة..." : "Adding...") : t("products.addToCart")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { language, t } = useLanguage()

  const [products, setProducts] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://localhost:7282/api/items")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        setProducts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p className="text-center py-20">Loading...</p>
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const searchLower = query.toLowerCase()
    const name = language === "ar" ? product.nameAr : product.nameEn
    const description = language === "ar" ? product.descriptionAr : product.descriptionEn
    return (
      (name && name.toLowerCase().includes(searchLower)) ||
      (description && description.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {language === "ar" ? "نتائج البحث" : "Search Results"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? `${filteredProducts.length} نتيجة لـ "${query}"`
                : `${filteredProducts.length} results for "${query}"`}
            </p>
          </div>

          {/* Results */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <SearchProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {language === "ar" ? "لم يتم العثور على نتائج" : "No results found"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "ar"
                  ? `لم نجد أي منتجات تطابق "${query}". جرب البحث بكلمات أخرى.`
                  : `We couldn't find any products matching "${query}". Try different keywords.`}
              </p>
              <Link href="/">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
