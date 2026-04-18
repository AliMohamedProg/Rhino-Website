"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { getImageUrl } from "@/lib/utils"

type ApiItem = {
  id: string
  nameAr: string
  nameEn: string
  price: number
  discountAmount: number
  stockNumber: number
  colorsEn?: string
  colorsAr?: string
  mainImage?: string
  image?: string
}

function ProductCard({ product }: { product: ApiItem }) {
  const { language, t } = useLanguage()
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [adding, setAdding] = useState(false)

  const quantity = 1
  const discount = product.discountAmount ?? 0
  const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price

  const colorsEn = product.colorsEn
    ? product.colorsEn.split(',').map(c => c.trim()).filter(Boolean)
    : []

  const colorsAr = product.colorsAr
    ? product.colorsAr.split(',').map(c => c.trim()).filter(Boolean)
    : []

  // Take up to 3 colors to display
  const displayColors = language === "ar" ? colorsAr : colorsEn

   const handleAddToCart = async (e: React.MouseEvent) => {
     e.preventDefault() // Prevent navigation to product page
     e.stopPropagation()

     if (colorsEn.length > 0 && !selectedColor) {
       toast.error(language === "ar" ? "يرجى اختيار لون قبل الإضافة للسلة" : "Please select a color before adding to cart")
       return
     }

     try {
       setAdding(true)
       setError("")
       const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")}/api/Cart/add-to-cart`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         credentials: "include",
         body: JSON.stringify({
           productId: product.id,
           quantity,
           color: selectedColor || "Default"
         })
       })

       if (res.ok) {
         toast.success(language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart successfully")
         // Wait a moment before redirecting to allow cart to update
         setTimeout(() => {
           window.location.href = "/cart"
         }, 500)
       } else if (res.status === 401) {
         window.location.href = "/login"
       } else {
         toast.error(language === "ar" ? "فشل الإضافة إلى السلة" : "Failed to add to cart")
       }
     } catch (error) {
       console.error("Failed to add to cart:", error)
       toast.error(language === "ar" ? "حدث خطأ أثناء الإضافة" : "An error occurred")
     } finally {
       setAdding(false)
     }
   }

  return (
    <div className="flex-shrink-0 w-[280px] bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link href={`/product/${product.id}`} className="block relative h-[200px] bg-secondary">
        <Image
          src={getImageUrl(product.mainImage || product.image)}
          alt={language === "ar" ? product.nameAr : product.nameEn}
          fill
          sizes="280px"
          loading="lazy"
          className="object-cover"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 start-2 bg-red-600 text-xs px-2 py-1 rounded text-white font-medium">
            {language === "ar" ? `${discount}%-` : `-${discount}%`}
          </span>
        )}

        {/* Stock Badge - Below discount */}
        <span className={`absolute bottom-2 start-2 px-2 py-1 text-xs rounded font-medium ${product.stockNumber > 0 ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
          {product.stockNumber > 0
            ? (language === "ar" ? "متاح" : "In Stock")
            : (language === "ar" ? "غير متاح" : "Out of Stock")
          }
        </span>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
            {language === "ar" ? product.nameAr : product.nameEn}
          </h3>
        </Link>

        <div className="flex gap-2 mb-3">
          <span className="font-bold text-foreground">
            {formatPrice(discountedPrice)} {t("products.price")}
          </span>
          {discount > 0 && (
            <span className="line-through text-sm text-muted-foreground">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Color Selection */}
        {displayColors.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {displayColors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedColor(color)
                    setError("")
                  }}
                  className={`px-2 py-1 text-xs border rounded transition-all ${selectedColor === color
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                    }`}
                  title={color}
                >
                  {color
                  }
                </button>
              ))}
            </div>
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
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

export function ProductCarousel() {
  const { t, dir } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState<ApiItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestDiscounts = async () => {
      try {
        const data = await ApiClient.get("api/Items/best-discounts")
        const normalized = (data as any[]).map((item) => {
          const price = Number(item.price ?? item.Price ?? 0)
          const discountAmount = Number(item.discountAmount ?? item.DiscountAmount ?? 0)
          const stockNumber = Number(item.stockNumber ?? item.StockNumber ?? 0)
          const images = item.images ?? item.Images ?? []
          const firstImage =
            Array.isArray(images) && images.length > 0
              ? images[0]?.imageUrl || images[0]?.ImageUrl || images[0]
              : ""
          const mainImage =
            item.mainImage ??
            item.MainImage ??
            item.image ??
            item.Image ??
            firstImage ??
            ""
          return {
            id: item.id ?? item.Id,
            nameAr: item.nameAr ?? item.NameAr ?? "",
            nameEn: item.nameEn ?? item.NameEn ?? "",
            price: Number.isFinite(price) ? price : 0,
            discountAmount: Number.isFinite(discountAmount) ? discountAmount : 0,
            stockNumber: Number.isFinite(stockNumber) ? stockNumber : 0,
            colorsEn: item.colorsEn ?? item.ColorsEn ?? item.colors ?? item.Colors ?? "",
            colorsAr: item.colorsAr ?? item.ColorsAr ?? item.colors ?? item.Colors ?? "",
            mainImage,
            image: item.image ?? item.Image ?? "",
          } as ApiItem
        })
        setProducts(normalized)
      } catch (error) {
        console.error("Failed to fetch best discounts", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBestDiscounts()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const actualDirection =
        dir === "rtl" ? (direction === "left" ? "right" : "left") : direction

      scrollRef.current.scrollBy({
        left: actualDirection === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (loading) return null

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            {t("products.deals")}
          </h2>

          <Link href="/product" className="text-sm font-medium text-primary hover:underline">
            {t("products.viewMore")}
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center border hover:bg-muted"
          >
            {dir === "rtl" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center border hover:bg-muted"
          >
            {dir === "rtl" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </section>
  )
}
