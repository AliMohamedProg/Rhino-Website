"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { products, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Search } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { language, t } = useLanguage()
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const searchLower = query.toLowerCase()
    return (
      product.name.en.toLowerCase().includes(searchLower) ||
      product.name.ar.includes(query) ||
      product.description.en.toLowerCase().includes(searchLower) ||
      product.description.ar.includes(query) ||
      product.category.toLowerCase().includes(searchLower)
    )
  })

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const handleWishlistToggle = (product: (typeof products)[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
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
                        alt={product.name[language]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badges */}
                      <div className="absolute top-2 start-2 flex flex-col gap-1">
                        {product.discount && (
                          <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                            -{product.discount}%
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                            {t("products.new")}
                          </span>
                        )}
                      </div>
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
                        <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 md:p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 mb-2 hover:text-secondary transition-colors">
                        {product.name[language]}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-secondary">
                        {formatPrice(product.price)} {t("products.price")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
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
