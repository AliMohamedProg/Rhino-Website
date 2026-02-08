"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { products, formatPrice } from "@/lib/products"

export function ProductCarousel() {
  const { language, t, dir } = useLanguage()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const actualDirection = dir === "rtl" ? (direction === "left" ? "right" : "left") : direction
      scrollRef.current.scrollBy({
        left: actualDirection === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{t("products.deals")}</h2>
          </div>
          <Link href="/product" className="text-sm font-medium text-primary hover:underline">
            {t("products.viewMore")}
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center text-foreground hover:bg-secondary transition-colors -ms-4"
            aria-label="Scroll left"
          >
            {dir === "rtl" ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] bg-card rounded-lg border border-border overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative h-[200px] bg-secondary">
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name[language]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-2 start-2 flex flex-col gap-1">
                    {product.discount && (
                      <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                    {product.isNew && (
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                        {t("products.new")}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() =>
                      toggleItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                      })
                    }
                    className="absolute top-2 end-2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
                    aria-label={t("products.addToWishlist")}
                  >
                    <Heart
                      size={18}
                      className={isInWishlist(product.id) ? "fill-accent text-accent" : "text-muted-foreground"}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {product.name[language]}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(product.price)} {t("products.price")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                      })
                    }
                  >
                    <ShoppingCart size={16} className="me-2" />
                    {t("products.addToCart")}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center text-foreground hover:bg-secondary transition-colors -me-4"
            aria-label="Scroll right"
          >
            {dir === "rtl" ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      </div>
    </section>
  )
}
