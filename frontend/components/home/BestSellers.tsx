"use client"

import { useEffect, useRef, useState } from "react"
import { ProductCard } from "@/components/ui/ProductCard"
import { getPublicBestSellers, type PublicProduct, formatPrice } from "@/lib/products"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { ScrollArrows } from "@/components/ui/ScrollArrows"

interface BestSellersProps {
  initialBestSellers: PublicProduct[]
}

interface ReviewStats {
  average: number
  count: number
}

export function BestSellers({ initialBestSellers }: BestSellersProps) {
  const { language } = useLanguage()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const reviewStatsByProductId: Record<string, ReviewStats> = {}
  const scrollRef = useRef<HTMLDivElement>(null)
  const [bestSellers, setBestSellers] = useState<PublicProduct[]>(initialBestSellers || [])

  useEffect(() => {
    if (initialBestSellers.length > 0) return
    let active = true

    const loadBestSellers = async () => {
      try {
        const data = await getPublicBestSellers()
        if (!active) return
        setBestSellers(data)
      } catch (error) {
        console.error("Failed to load best sellers:", error)
      }
    }

    loadBestSellers()
    return () => {
      active = false
    }
  }, [initialBestSellers])

  return (
    <section className="py-24 px-8 bg-white min-h-screen" id="catalog">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="flex flex-col justify-center items-center gap-4 mb-10 px-2">
          <span className="text-[10px] tracking-[0.4em] font-bold text-taupe uppercase">
            Customer Favorites
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-mahogany italic">
            Best Sellers
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-4 md:px-8 overflow-hidden">
          <ScrollArrows scrollRef={scrollRef} scrollAmount={350} />
          <div ref={scrollRef} className="flex overflow-x-hidden pb-8 snap-x snap-mandatory w-full gap-4 md:gap-8 no-scrollbar">
            {bestSellers.slice(0, 8).map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[48%] md:w-[382px] snap-center">
                <ProductCard
                  product={product}
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  description={product.description}
                  price={`${formatPrice(product.price)} EGP`}
                  discountAmount={product.discountAmount || 0}
                  originalPrice={
                    (product.discountAmount ?? 0) > 0
                      ? `${formatPrice(Math.round(product.price / (1 - (product.discountAmount ?? 0) / 100)))} EGP`
                      : undefined
                  }
                  rating={reviewStatsByProductId[product.id]?.average ?? (product as any).overallRating ?? 0}
                  reviewsCountVal={reviewStatsByProductId[product.id]?.count ?? 0}
                  mainImage={product.mainImage}
                  colorsRaw={product.colors}
                  stockNumber={product.stockNumber}
                  isWishlisted={isInWishlist(product.id)}
                  onAddToCart={async (productId, selectedColorName) => {
                    await addItem(productId, 1, selectedColorName)
                  }}
                  onToggleWishlist={(productId) => {
                    const discountedPrice =
                      (product.discountAmount ?? 0) > 0
                        ? product.price * (1 - (product.discountAmount ?? 0) / 100)
                        : product.price
                    toggleItem({
                      id: productId,
                      name: product.name,
                      price: discountedPrice,
                      originalPrice: (product.discountAmount ?? 0) > 0 ? product.price : undefined,
                      image: product.mainImage || "/placeholder.svg",
                    })
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}