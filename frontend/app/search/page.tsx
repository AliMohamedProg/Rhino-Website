"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Search } from "lucide-react"
import { formatPrice } from "@/lib/products"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { language, t } = useLanguage()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()

  const [products, setProducts] = useState<any[]>([])
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

  const handleAddToCart = async (product: any) => {
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
  }

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: language === "ar" ? product.nameAr : product.nameEn,
        price: product.price,
        image: product.image || "/placeholder.svg",
      })
    }
  }

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
                <div
                  key={product.id}
                  className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <Link href={`/product/${product.id}`} className="block relative">
                    <div className="relative h-48 md:h-56">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={language === "ar" ? product.nameAr : product.nameEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleWishlistToggle(product)
                        }}
                        className={`absolute top-2 end-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isInWishlist(product.id)
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-card/80 text-foreground hover:bg-card"
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={isInWishlist(product.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 md:p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 mb-2 hover:text-secondary transition-colors">
                        {language === "ar" ? product.nameAr : product.nameEn}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-secondary">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      size="sm"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={16} className="me-2" />
                      {t("products.addToCart")}
                    </Button>
                  </div>
                </div>
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
