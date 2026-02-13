"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
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
  Heart,
  ChevronUp,
  ChevronDown,
  Filter,
  Star
} from "lucide-react"
import { formatPrice } from "@/lib/products"

interface Item {
  id: string
  nameAr: string
  nameEn: string
  price: number
  discountAmount: number // decimal ex: 0.25
  stockNumber: number
  overallRating: number
  categoryId: string
  image?: string
}

interface Category {
  id: string
  nameAr: string
  nameEn: string
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.slug as string

  const { language } = useLanguage()
  const { addItem } = useCart()

  const [products, setProducts] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [hideOutOfStock, setHideOutOfStock] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sortBy, setSortBy] = useState("featured")

  const [availabilityOpen, setAvailabilityOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch("https://localhost:7282/api/Items")
        setProducts(await itemsRes.json())

        const catRes = await fetch("https://localhost:7282/api/category")
        setCategories(await catRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

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
                      onValueChange={setPriceRange}
                      max={50000}
                      step={500}
                    />
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
                {filteredProducts.map(product => {
                const hasDiscount = product.discountAmount > 0

                const discountPercent = product.discountAmount

                const finalPrice = hasDiscount
                ? Math.round(product.price * (1 - product.discountAmount / 100))
                : product.price

                  return (
                    <Link key={product.id} href={`/product/${product.id}`} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-56">
                        <Image
                          src={product.image || "/placeholder.png"}
                          alt={language === "ar" ? product.nameAr : product.nameEn}
                          fill
                          className="object-cover"
                        />

                        {hasDiscount && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                            -{discountPercent}%
                          </span>
                        )}

                        {/* Stock Badge - Below discount */}
                        <span className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded font-medium ${product.stockNumber > 0 ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                          {product.stockNumber > 0 
                            ? (language === "ar" ? "متاح" : "In Stock") 
                            : (language === "ar" ? "غير متاح" : "Out of Stock")
                          }
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2">
                          {language === "ar" ? product.nameAr : product.nameEn}
                        </h3>

                        <div className="flex items-center gap-2 my-2">
                          <span className="font-bold text-foreground">
                            {formatPrice(finalPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          <Star size={14} className="text-yellow-400 ml-auto" />
                          <span className="text-sm">{product.overallRating}</span>
                        </div>

                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault()
                            addItem({
                              id: product.id,
                              name: language === "ar" ? product.nameAr : product.nameEn,
                              price: finalPrice,
                              image: product.image || "/placeholder.png"
                            })
                          }}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

