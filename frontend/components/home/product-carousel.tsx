"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"

type ApiItem = {
  id: string
  nameAr: string
  nameEn: string
  price: number
  discountAmount: number
  stockNumber: number
}

export function ProductCarousel() {
  const { language, t, dir } = useLanguage()
  const { addItem } = useCart()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState<ApiItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestDiscounts = async () => {
      try {
        const res = await fetch("https://localhost:7282/api/Items/best-discounts")
        const data = await res.json()
        setProducts(data)
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
            className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg"
          >
            {dir === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4"
          >
            {products.map((product) => {
              const originalPrice =
                product.price + product.discountAmount

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="flex-shrink-0 w-[280px] bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-[200px] bg-secondary">
                    <Image
                      src="/placeholder.svg"
                      alt={language === "ar" ? product.nameAr : product.nameEn}
                      fill
                      className="object-cover"
                    />

                    {/* Discount Badge */}
                    {product.discountAmount > 0 && (
                      <span className="absolute top-2 start-2 bg-red-600 text-xs px-2 py-1 rounded text-white font-medium">
                        {language === "ar" ? `${product.discountAmount}%-` : `-${product.discountAmount}%` }
                      </span>
                    )}

                    {/* Stock Badge - Below discount */}
                    <span className={`absolute bottom-2 start-2 px-2 py-1 text-xs rounded font-medium ${product.stockNumber > 0 ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                      {product.stockNumber > 0 
                        ? (language === "ar" ? "متاح" : "In Stock") 
                        : (language === "ar" ? "غير متاح" : "Out of Stock")
                      }
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-2">
                      {language === "ar" ? product.nameAr : product.nameEn}
                    </h3>

                    <div className="flex gap-2 mb-3">
                      <span className="font-bold text-foreground">
                        {formatPrice(product.price)} {t("products.price")}
                      </span>
                      <span className="line-through text-sm text-muted-foreground">
                        {formatPrice(originalPrice)}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: {
                            ar: product.nameAr,
                            en: product.nameEn,
                          },
                          price: product.price,
                          originalPrice,
                          image: "/placeholder.svg",
                        })
                      }
                    >
                      <ShoppingCart size={16} className="me-2" />
                      {t("products.addToCart")}
                    </Button>
                  </div>
                </Link>
              )
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg"
          >
            {dir === "rtl" ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
      </div>
    </section>
  )
}

