"use client"

import { ProductCard } from "@/components/ui/ProductCard";
import { type PublicProduct } from "@/lib/products";
import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
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

interface NewStylesProps {
    initialProducts: PublicProduct[]
}

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

interface ReviewStats {
    average: number
    count: number
}

export function NewStyles({ initialProducts }: NewStylesProps) {
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
    const [reviewStatsByProductId, setReviewStatsByProductId] = useState<Record<string, ReviewStats>>({})
    return (
        <section className="py-24 px-8 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col">

                <div className="flex flex-col gap-4 mb-20 px-2">
                    <span className="text-[10px] tracking-[0.4em] font-bold text-taupe uppercase">
                        Curated Ranges
                    </span>
                    <h2 className="text-5xl md:text-7xl font-serif text-mahogany italic">
                        New Styles
                    </h2>
                </div>

                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full no-scrollbar">
                    {(initialProducts || []).slice(0, 3).map((product, index) => (
                        <div key={index} className="min-w-[85vw] md:min-w-0 snap-center">
                            <ProductCard product={product}
                                key={product.id}
                                id={product.id}
                                title={language === "ar" ? product.nameAr : product.nameEn}
                                description={
                                    language === "ar"
                                        ? product.descriptionAr || product.nameAr
                                        : product.descriptionEn || product.nameEn
                                }
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
                                colorsRaw={product.colorsEn}
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
                                        name: { ar: product.nameAr, en: product.nameEn },
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
        </section>
    );
}
