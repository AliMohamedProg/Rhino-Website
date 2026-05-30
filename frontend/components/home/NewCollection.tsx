"use client"

import { useEffect, useRef, useState } from "react"
import { ProductCard } from "@/components/ui/ProductCard"
import { getPublicCollections, type PublicProduct, formatPrice } from "@/lib/products"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { ScrollArrows } from "@/components/ui/ScrollArrows"

interface NewCollectionProps {
    initialProducts: PublicProduct[]
}

interface ReviewStats {
    average: number
    count: number
}

export function NewCollection({ initialProducts }: NewCollectionProps) {
    const { language } = useLanguage()
    const { addItem } = useCart()
    const { toggleItem, isInWishlist } = useWishlist()
    const reviewStatsByProductId: Record<string, ReviewStats> = {}
    const scrollRef = useRef<HTMLDivElement>(null)
    const [collections, setCollections] = useState<PublicProduct[]>(initialProducts || [])

    useEffect(() => {
        if (initialProducts.length > 0) return
        let active = true

        const loadCollections = async () => {
            try {
                const data = await getPublicCollections()
                if (!active) return
                setCollections(data)
            } catch (error) {
                console.error("Failed to load collections:", error)
            }
        }

        loadCollections()
        return () => {
            active = false
        }
    }, [initialProducts])

    return (
        <section className="py-24 px-8 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col">
                <div className="flex flex-col gap-4 mb-20 px-2">
                    <span className="text-[10px] tracking-[0.4em] font-bold text-taupe uppercase">
                        Curated Ranges
                    </span>
                    <h2 className="text-5xl md:text-7xl font-serif text-mahogany italic">
                        New Collections
                    </h2>
                </div>

                <div className="relative max-w-7xl mx-auto w-full px-4 md:px-8 overflow-hidden">
                    <ScrollArrows scrollRef={scrollRef} scrollAmount={350} />
                    <div ref={scrollRef} className="flex overflow-x-hidden pb-8 snap-x snap-mandatory w-full gap-4 md:gap-8 no-scrollbar">
                        {collections.slice(0, 8).map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-[48%] md:w-[380px] snap-center">
                                <ProductCard
                                    product={product}
                                    key={product.id}
                                    id={product.id}
                                    href={`/collections/${product.id}`}
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
