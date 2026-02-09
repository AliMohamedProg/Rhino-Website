"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Heart, Star, ArrowLeft, ArrowRight } from "lucide-react"

import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { formatPrice } from "@/lib/products"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

type Product = {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  price: number
  discountAmount: number
  stockNumber: number
  colors: string
  overallRating: number
}

type Review = {
  id: string
  title: string
  date: string
  rating: number
  text: string
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { language, t } = useLanguage()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const [reviews, setReviews] = useState<Review[]>([])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7282/api/Items/${id}`)
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Dummy reviews
  useEffect(() => {
    setReviews([
      { id: "1", title: "Elegant Dining Set", date: "2026-02-07", rating: 4, text: "Great product!" },
      { id: "2", title: "Modern Chair", date: "2026-02-06", rating: 5, text: "Excellent quality and design." },
      { id: "3", title: "Wooden Table", date: "2026-02-05", rating: 3, text: "Good, but a bit heavy." },
      { id: "4", title: "Luxury Sofa", date: "2026-02-04", rating: 5, text: "Super comfy and stylish!" },
    ])
  }, [])

  if (loading) return null
  if (!product) return null

  const originalPrice = product.price + product.discountAmount
  const colorsArray = product.colors
    ? product.colors.split(",").map(c => c.trim())
    : []

  const increment = () => setQuantity(q => q + 1)
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

  const submitReview = () => {
    const newReview: Review = {
      id: (reviews.length + 1).toString(),
      title: "New Review",
      date: new Date().toISOString().split("T")[0],
      rating: reviewRating,
      text: reviewText,
    }
    setReviews([newReview, ...reviews])
    setShowReviewForm(false)
    setReviewText("")
    setReviewRating(5)
    setCurrentReviewIndex(0)
  }

  const nextReview = () => {
    if (currentReviewIndex < reviews.length - 1) setCurrentReviewIndex(i => i + 1)
  }
  const prevReview = () => {
    if (currentReviewIndex > 0) setCurrentReviewIndex(i => i - 1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div className="relative h-[450px] bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center">
            <Image
              src="/placeholder.svg"
              alt={language === "ar" ? product.nameAr : product.nameEn}
              fill
              className="object-cover"
            />
            {product.discountAmount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-medium text-sm shadow">
                -{product.discountAmount}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            {/* Title */}
            <h1 className="text-3xl font-extrabold mb-4">
              {language === "ar" ? product.nameAr : product.nameEn}
            </h1>

            {/* Review Summary */}
            <div className="flex items-center mb-4 gap-2">
              <Stars value={product.overallRating} />
              <span className="text-gray-600">{product.overallRating} / 5</span>
              <span className="text-gray-400">· {reviews.length} Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.discountAmount > 0 && (
                <span className="line-through text-gray-400">{formatPrice(originalPrice)}</span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-4">
              <span className="text-gray-500">{language === "ar" ? "الكمية المتوفرة:" : "Stock:"} </span>
              <span className="font-medium">{product.stockNumber}</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-500">{language === "ar" ? "الكمية:" : "Quantity:"}</span>
              <Button variant="outline" onClick={decrement}>-</Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button variant="outline" onClick={increment}>+</Button>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-3 mb-8">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2"
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: { ar: product.nameAr, en: product.nameEn },
                    price: product.price,
                    originalPrice,
                    image: "/placeholder.svg",
                    quantity,
                  })
                }
              >
                <ShoppingCart size={20} />
                {t("products.addToCart")}
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={() =>
                  toggleItem({
                    id: product.id,
                    name: { ar: product.nameAr, en: product.nameEn },
                    price: product.price,
                    originalPrice,
                    image: "/placeholder.svg",
                  })
                }
              >
                <Heart
                  size={20}
                  className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}
                />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none mb-6">
                <TabsTrigger value="description">{t("products.description")}</TabsTrigger>
                <TabsTrigger value="specification">{language === "ar" ? "المواصفات" : "Specification"}</TabsTrigger>
                <TabsTrigger value="reviews">{language === "ar" ? "التقييمات" : "Reviews"}</TabsTrigger>
              </TabsList>

              {/* Description */}
              <TabsContent value="description" className="pt-4">
                <p className="text-gray-700 leading-relaxed">{language === "ar" ? product.descriptionAr : product.descriptionEn}</p>
              </TabsContent>

              {/* Specification */}
              <TabsContent value="specification" className="pt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === "ar" ? "الكمية المتوفرة" : "Stock Available"}</span>
                  <span className="font-medium">{product.stockNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === "ar" ? "التقييم" : "Rating"}</span>
                  <span className="font-medium">{product.overallRating} / 5</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">{language === "ar" ? "الألوان المتاحة" : "Available Colors"}</span>
                  <div className="flex flex-wrap gap-2">
                    {colorsArray.map(color => (
                      <span key={color} className="px-3 py-1 border rounded-full text-sm bg-gray-100">{color}</span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-4">

                  {/* Add Review */}
                  <Button className="mb-4 w-full" onClick={() => setShowReviewForm(prev => !prev)}>
                    {language === "ar" ? "إضافة تقييم" : "Add Review"}
                  </Button>

                  {showReviewForm && (
                    <div className="border p-4 rounded-lg space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span>Rating:</span>
                        <select
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="border p-1 rounded"
                        >
                          {[1,2,3,4,5].map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <textarea
                        className="w-full border p-2 rounded"
                        rows={3}
                        placeholder="Your review"
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                      />
                      <Button onClick={submitReview}>{language === "ar" ? "إرسال" : "Submit"}</Button>
                    </div>
                  )}

                  {/* Carousel */}
                  {reviews.length > 0 && (
                    <div className="relative">
                      <div className="overflow-hidden">
                        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}>
                          {reviews.map(r => (
                            <div key={r.id} className="min-w-full p-4">
                              <div className="border rounded-lg p-4 shadow-sm bg-white">
                                <h4 className="font-semibold text-lg mb-2">{r.title}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <Stars value={r.rating} />
                                  <span className="text-gray-400 text-sm">{r.date}</span>
                                </div>
                                <p className="text-gray-700">{r.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrows */}
                      <div className="absolute top-1/2 left-2 -translate-y-1/2">
                        <Button variant="outline" onClick={prevReview}><ArrowLeft /></Button>
                      </div>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2">
                        <Button variant="outline" onClick={nextReview}><ArrowRight /></Button>
                      </div>
                    </div>
                  )}

                </div>
              </TabsContent>

            </Tabs>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Stars Component
function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={16} className={i <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  )
}
