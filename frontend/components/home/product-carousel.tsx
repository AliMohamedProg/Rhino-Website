"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"

type ApiItem = {
  id: string
  nameAr: string
  nameEn: string
  price: number
  discountAmount: number
}

export function ProductCarousel() {
  const { language, t, dir } = useLanguage()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
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
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[280px] bg-card rounded-lg border overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-[200px] bg-secondary">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src="/placeholder.svg"
                        alt={language === "ar" ? product.nameAr : product.nameEn}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {product.discountAmount > 0 && (
                      <span className="absolute top-2 start-2 bg-accent text-xs px-2 py-1 rounded text-white">
                        {language === "ar" ? `${product.discountAmount}%-` : `-${product.discountAmount}%` }
                      </span>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={() =>
                        toggleItem({
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
                      className="absolute top-2 end-2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center"
                    >
                      <Heart
                        size={18}
                        className={
                          isInWishlist(product.id)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium mb-2">
                      {language === "ar" ? product.nameAr : product.nameEn}
                    </h3>

                    <div className="flex gap-2 mb-3">
                      <span className="font-bold">
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
                </div>
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
