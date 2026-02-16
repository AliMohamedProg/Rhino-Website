"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ShoppingCart, ChevronUp, ChevronDown, Filter, Star } from "lucide-react"
import { formatPrice } from "@/lib/products"

interface Item {
  id: string
  nameAr: string
  nameEn: string
  price: number
  discountAmount: number
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

  const [products, setProducts] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [hideOutOfStock, setHideOutOfStock] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("featured")
  const [availabilityOpen, setAvailabilityOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch products by category
        const res = await fetch(`https://localhost:7282/api/Category/${categoryId}`)
        const data: Item[] = await res.json()
        setProducts(data)

        // fetch all categories for sidebar
       
      } catch (err) {
        console.error(err)
      } 
    }
    fetchData()
  }, [categoryId])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (hideOutOfStock) result = result.filter(p => p.stockNumber > 0)
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (selectedCategories.length)
      result = result.filter(p => selectedCategories.includes(p.categoryId))

    switch (sortBy) {
      case "price-low": result.sort((a,b) => a.price - b.price); break
      case "price-high": result.sort((a,b) => b.price - a.price); break
      case "rating": result.sort((a,b) => b.overallRating - a.overallRating); break
    }

    return result
  }, [products, hideOutOfStock, priceRange, selectedCategories, sortBy])

  const resetFilters = () => {
    setHideOutOfStock(false)
    setPriceRange([0, 50000])
    setSelectedCategories([])
  }


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
                  <span className="font-semibold">{language === "ar" ? "تصفية" : "Filter"}</span>
                </div>

                {/* Availability */}
                <Collapsible open={availabilityOpen} onOpenChange={setAvailabilityOpen}>
                  <CollapsibleTrigger className="flex justify-between w-full py-2">
                    Availability {availabilityOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={hideOutOfStock}
                        onCheckedChange={(v) => setHideOutOfStock(!!v)}
                      />
                      {language === "ar" ? "المتاح فقط" : "In Stock Only"}
                    </label>
                  </CollapsibleContent>
                </Collapsible>

                {/* Price */}
                <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
                  <CollapsibleTrigger className="flex justify-between w-full py-2">
                    Price {priceOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-2">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={50000} step={500} />
                  </CollapsibleContent>
                </Collapsible>

               

                <Button onClick={resetFilters} variant="outline" className="w-full mt-4">
                  {language === "ar" ? "إعادة تعيين" : "Reset"}
                </Button>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">{language === "ar" ? "المنتجات" : "Products"}</h1>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low</SelectItem>
                    <SelectItem value="price-high">Price: High</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <Link key={product.id} href={`/product/${product.id}`} className="block border rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-56">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={language === "ar" ? product.nameAr : product.nameEn}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    {/* Stock Badge - Below image */}
                    <div className="absolute bottom-20 left-2">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          product.stockNumber > 0 ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                        }`}
                      >
                        {product.stockNumber > 0
                          ? language === "ar" ? "متاح" : "In Stock"
                          : language === "ar" ? "غير متاح" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2">{language === "ar" ? product.nameAr : product.nameEn}</h3>

                      <div className="flex items-center gap-2 my-2">
                        <span className="font-bold">{formatPrice(product.price)}</span>
                        <Star size={14} className="text-yellow-400" />
                        <span className="text-sm">{product.overallRating}</span>
                      </div>

                      <Button
                        onClick={async (e) => {
                          e.preventDefault()
                          try {
                            const res = await fetch("https://localhost:7282/api/Cart/add-to-cart", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ productId: product.id, quantity: 1 })
                            })
                            
                            if (res.ok) {
                              window.location.href = "/cart"
                            } else if (res.status === 401) {
                              window.location.href = "/login"
                            }
                          } catch (error) {
                            console.error("Failed to add to cart:", error)
                          }
                        }}
                        className="w-full"
                      >
                        <ShoppingCart size={16} className="mr-2" /> Add to Cart
                      </Button>
                    </div>
                  </Link>
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
