"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Heart, Star, ArrowLeft, ArrowRight, Share2, Check, X } from "lucide-react"

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
  images?: string[]
}

type Review = {
  id: string
  title: string
  date: string
  rating: number
  text: string
  userName: string
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { language, t } = useLanguage()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  const [reviews, setReviews] = useState<Review[]>([])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewRating, setReviewRating] = useState(5)

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7282/api/Items/${id}`)
        const data = await res.json()
        setProduct(data)
        if (data.colors) {
          const colorsArray = data.colors.split(",").map((c: string) => c.trim())
          if (colorsArray.length > 0) {
            setSelectedColor(colorsArray[0])
          }
        }
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
      { id: "1", title: "Elegant Dining Set", date: "2026-02-07", rating: 5, text: "Great product! Exactly as described. Fast shipping and excellent packaging.", userName: "Ahmed M." },
      { id: "2", title: "Modern Chair", date: "2026-02-06", rating: 5, text: "Excellent quality and design. Very comfortable and sturdy.", userName: "Sarah K." },
      { id: "3", title: "Wooden Table", date: "2026-02-05", rating: 4, text: "Good, but a bit heavy. Otherwise perfect!", userName: "Omar R." },
      { id: "4", title: "Luxury Sofa", date: "2026-02-04", rating: 5, text: "Super comfy and stylish! Worth every penny.", userName: "Fatima H." },
    ])
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "ar" ? product?.nameAr : product?.nameEn,
          text: language === "ar" ? product?.descriptionAr : product?.descriptionEn,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-muted-foreground">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">{language === "ar" ? "المنتج غير موجود" : "Product Not Found"}</h2>
            <p className="text-muted-foreground">{language === "ar" ? "عذراً، لم نتمكن من العثور على هذا المنتج" : "Sorry, we couldn't find this product"}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const originalPrice = product.price + product.discountAmount
  const colorsArray = product.colors
    ? product.colors.split(",").map(c => c.trim())
    : []

  // Demo images for gallery
  const productImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ]

  const increment = () => setQuantity(q => q + 1)
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

  const submitReview = () => {
    if (!reviewText.trim() || !reviewTitle.trim()) return
    
    const newReview: Review = {
      id: (reviews.length + 1).toString(),
      title: reviewTitle,
      date: new Date().toISOString().split("T")[0],
      rating: reviewRating,
      text: reviewText,
      userName: "You",
    }
    setReviews([newReview, ...reviews])
    setShowReviewForm(false)
    setReviewText("")
    setReviewTitle("")
    setReviewRating(5)
    setCurrentReviewIndex(0)
  }

  const nextReview = () => {
    if (currentReviewIndex < reviews.length - 1) setCurrentReviewIndex(i => i + 1)
  }
  const prevReview = () => {
    if (currentReviewIndex > 0) setCurrentReviewIndex(i => i - 1)
  }

  const isInStock = product.stockNumber > 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <span>{language === "ar" ? "الرئيسية" : "Home"}</span>
          <span className="mx-2">/</span>
          <span>{language === "ar" ? "المنتجات" : "Products"}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{language === "ar" ? product.nameAr : product.nameEn}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Product Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative h-[450px] bg-card rounded-xl shadow-md overflow-hidden flex items-center justify-center cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={productImages[selectedImageIndex]}
                alt={language === "ar" ? product.nameAr : product.nameEn}
                fill
                className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"}`}
              />
              {product.discountAmount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-lg font-medium text-sm shadow-lg">
                  {language === "ar" ? `خصم ${product.discountAmount}` : `-${product.discountAmount}`}
                </span>
              )}
              {/* Stock Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg font-medium text-sm shadow-lg flex items-center gap-1.5 ${isInStock ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {isInStock ? <Check size={14} /> : <X size={14} />}
                {isInStock ? (language === "ar" ? "متوفر" : "In Stock") : (language === "ar" ? "غير متوفر" : "Out of Stock")}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImageIndex === index ? "border-primary ring-2 ring-primary/30" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${language === "ar" ? product.nameAr : product.nameEn} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
                {language === "ar" ? product.nameAr : product.nameEn}
              </h1>

              {/* Review Summary */}
              <div className="flex items-center mb-4 gap-3">
                <Stars value={product.overallRating} />
                <span className="text-foreground font-medium">{product.overallRating} / 5</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-blue-600 hover:underline cursor-pointer">{reviews.length} {language === "ar" ? "تقييم" : "Reviews"}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-foreground">{formatPrice(product.price)}</span>
                {product.discountAmount > 0 && (
                  <span className="text-xl line-through text-gray-400">{formatPrice(originalPrice)}</span>
                )}
                {product.discountAmount > 0 && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round((product.discountAmount / originalPrice) * 100)}% {language === "ar" ? "خصم" : "OFF"}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                <span className="text-gray-500">{language === "ar" ? "الكمية المتوفرة:" : "Stock:"} </span>
                <span className={`font-semibold ${isInStock ? "text-green-600" : "text-red-500"}`}>
                  {product.stockNumber} {language === "ar" ? "قطعة" : "items"}
                </span>
              </div>

              {/* Colors */}
              {colorsArray.length > 0 && (
                <div className="mb-6">
                  <span className="text-gray-500 block mb-2">{language === "ar" ? "الألوان المتاحة:" : "Available Colors:"}</span>
                  <div className="flex flex-wrap gap-2">
                    {colorsArray.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                          selectedColor === color 
                            ? "border-primary bg-primary text-white" 
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-500">{language === "ar" ? "الكمية:" : "Quantity:"}</span>
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    onClick={decrement}
                    className="px-4 h-10"
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-14 text-center font-semibold text-lg">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    onClick={increment}
                    className="px-4 h-10"
                    disabled={quantity >= product.stockNumber}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3 mb-6">
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 h-12 text-lg"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: { ar: product.nameAr, en: product.nameEn },
                      price: product.price,
                      originalPrice,
                      image: "/placeholder.svg",
                    })
                  }
                  disabled={!isInStock}
                >
                  <ShoppingCart size={22} />
                  {t("products.addToCart")}
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center h-12 px-4"
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
                    size={22}
                    className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}
                  />
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center h-12 px-4"
                  onClick={handleShare}
                >
                  {showCopied ? (
                    <Check size={22} className="text-green-500" />
                  ) : (
                    <Share2 size={22} />
                  )}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full mt-4">
              <TabsList className="w-full justify-start border-b rounded-none mb-4 h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="description"
                  className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  {t("products.description")}
                </TabsTrigger>
                <TabsTrigger 
                  value="specification"
                  className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  {language === "ar" ? "المواصفات" : "Specification"}
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  {language === "ar" ? "التقييمات" : "Reviews"} ({reviews.length})
                </TabsTrigger>
              </TabsList>

              {/* Description */}
              <TabsContent value="description" className="pt-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-lg">{language === "ar" ? product.descriptionAr : product.descriptionEn}</p>
                </div>
              </TabsContent>

              {/* Specification */}
              <TabsContent value="specification" className="pt-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{language === "ar" ? "الكمية المتوفرة" : "Stock Available"}</span>
                    <span className="font-semibold">{product.stockNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{language === "ar" ? "التقييم" : "Rating"}</span>
                    <div className="flex items-center gap-2">
                      <Stars value={product.overallRating} />
                      <span className="font-semibold">{product.overallRating} / 5</span>
                    </div>
                  </div>
                  {colorsArray.length > 0 && (
                    <div className="flex justify-between items-start py-2">
                      <span className="text-gray-500">{language === "ar" ? "الألوان المتاحة" : "Available Colors"}</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {colorsArray.map((color, index) => (
                          <span key={index} className="px-3 py-1 border rounded-full text-sm bg-gray-100">{color}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-4">

                  {/* Add Review */}
                  <Button 
                    className="w-full mb-4 bg-blue-600 hover:bg-blue-700" 
                    onClick={() => setShowReviewForm(prev => !prev)}
                  >
                    {language === "ar" ? "إضافة تقييم" : "Add Review"}
                  </Button>

                  {showReviewForm && (
                    <div className="border p-5 rounded-xl space-y-3 mb-6 bg-white shadow-sm">
                      <div>
                        <label className="block text-sm font-medium mb-1">{language === "ar" ? "العنوان" : "Title"}</label>
                        <input
                          type="text"
                          className="w-full border p-2 rounded-lg"
                          placeholder={language === "ar" ? "أدخل عنوان التقييم" : "Enter review title"}
                          value={reviewTitle}
                          onChange={e => setReviewTitle(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{language === "ar" ? "التقييم:" : "Rating:"}</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <button key={i} onClick={() => setReviewRating(i)}>
                              <Star size={24} className={i <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{language === "ar" ? "التعليق" : "Comment"}</label>
                        <textarea
                          className="w-full border p-2 rounded-lg"
                          rows={3}
                          placeholder={language === "ar" ? "اكتب تجربتك مع المنتج" : "Share your experience with this product"}
                          value={reviewText}
                          onChange={e => setReviewText(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={submitReview}>{language === "ar" ? "إرسال" : "Submit"}</Button>
                        <Button variant="outline" onClick={() => setShowReviewForm(false)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
                      </div>
                    </div>
                  )}

                  {/* Carousel */}
                  {reviews.length > 0 && (
                    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="overflow-hidden">
                        <div 
                          className="flex transition-transform duration-300" 
                          style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                        >
                          {reviews.map(r => (
                            <div key={r.id} className="min-w-full">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-lg text-gray-900">{r.title}</h4>
                                    <p className="text-sm text-gray-500">{r.userName} · {r.date}</p>
                                  </div>
                                  <Stars value={r.rating} />
                                </div>
                                <p className="text-gray-700">{r.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrows */}
                      {reviews.length > 1 && (
                        <>
                          <button 
                            onClick={prevReview}
                            disabled={currentReviewIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowLeft size={20} />
                          </button>
                          <button 
                            onClick={nextReview}
                            disabled={currentReviewIndex === reviews.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowRight size={20} />
                          </button>
                        </>
                      )}

                      {/* Dots */}
                      <div className="flex justify-center gap-2 mt-4">
                        {reviews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentReviewIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentReviewIndex === index ? "bg-primary w-4" : "bg-gray-300"
                            }`}
                          />
                        ))}
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
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star 
          key={i} 
          size={18} 
          className={i <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
        />
      ))}
    </div>
  )
}
