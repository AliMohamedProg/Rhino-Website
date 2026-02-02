"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductById, products, formatPrice } from "@/lib/products"
import dynamic from "next/dynamic"

const ReviewsWrapper = dynamic(() => import("@/components/product/reviews").then((m) => {
  const Reviews = m.default
  return ({ initialReviews }: any) => <Reviews initialReviews={initialReviews} />
}), { ssr: false })

export default function ProductPage() {
  const params = useParams()
  const product = getProductById(params.id as string)
  const { language, t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const allImages = [product.image, ...product.images]
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
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
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  {t("nav.home")}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/category/${product.category}`} className="hover:text-primary capitalize">
                  {product.category}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{product.name[language]}</li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative w-full h-96 md:h-[600px] bg-secondary rounded-lg overflow-hidden">
                <Image
                  src={allImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name[language]}
                  fill
                  className="object-contain"
                />
                {product.discount && (
                  <span className="absolute top-4 start-4 bg-accent text-accent-foreground text-sm font-medium px-3 py-1 rounded">
                    -{product.discount}% {t("products.off")}
                  </span>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt=""
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name[language]}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviews} {t("products.reviews")})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)} {t("products.price")}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)} {t("products.price")}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-destructive"}`}>
                {product.inStock ? t("products.inStock") : t("products.outOfStock")}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{t("cart.quantity")}:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart size={20} className="me-2" />
                  {t("products.addToCart")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    toggleItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                    })
                  }
                >
                  <Heart size={20} className={isInWishlist(product.id) ? "fill-accent text-accent" : ""} />
                </Button>
              </div>

              {/* Tabs: Description + Reviews */}
              <Tabs defaultValue="description" className="mt-8">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">{t("products.description")}</TabsTrigger>
                  <TabsTrigger value="reviews">{isRTL ? "التعليقات" : "Reviews"}</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed">{product.description[language]}</p>
                </TabsContent>

                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{product.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">• {product.reviews} {t("products.reviews")}</span>
                      </div>
                    </div>

                    {/* Sample reviews (mock) */}
                        {/* Reviews carousel + add-review form */}
                        {product.reviews > 0 ? (
                          <div>
                            {/* import ReviewsCarousel lazily */}
                            {/* Keep initial mock reviews for demonstration */}
                            {/* generate small set of mock reviews to pass as initialReviews */}
                            {/* @ts-ignore */}
                            <ReviewsWrapper
                              initialReviews={Array.from({ length: Math.min(product.reviews, 6) }).map((_, i) => ({
                                id: Number(`${product.id}${i}`),
                                author: `${product.name[language]} ${i + 1}`,
                                rating: Math.max(1, Math.round(product.rating) - (i % 3)),
                                date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
                                textEn: `Great product! ${i + 1}`,
                                textAr: `منتج رائع! ${i + 1}`,
                              }))}
                            />
                          </div>
                        ) : (
                          <div className="text-muted-foreground">{t("common.noData")}</div>
                        )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-6">{t("products.related")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="group">
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      <div className="relative h-40 bg-secondary">
                        <Image
                          src={p.image || "/placeholder.svg"}
                          alt={p.name[language]}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2">{p.name[language]}</h3>
                        <span className="font-bold text-foreground">
                          {formatPrice(p.price)} {t("products.price")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
