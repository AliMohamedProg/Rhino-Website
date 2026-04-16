
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
import { getImageUrl, cn, parseColors } from "@/lib/utils"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

type Product = {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  price: number
  discountAmount: number
  stockNumber: number
  colorsEn: string
  colorsAr: string
  materialEn?: string
  materialAr?: string
  overallRating: number
  images?: string[]
  mainImage?: string
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
        const data = await ApiClient.get(`api/Items/${id}`)
        const colorsValue = data.colors ?? data.Colors ?? ""
        const rawImages = data.images ?? data.Images ?? []
        const price = Number(data.price ?? data.Price ?? 0)
        const discountAmount = Number(data.discountAmount ?? data.DiscountAmount ?? 0)
        const stockNumber = Number(data.stockNumber ?? data.StockNumber ?? 0)
        const normalizedImages = Array.isArray(rawImages)
          ? rawImages
            .map((img: any) => {
              if (typeof img === "string") return img
              return img?.imageUrl || img?.ImageUrl || ""
            })
            .filter((img: string) => img.length > 0)
          : []
        const mainImage = data.mainImage ?? data.MainImage ?? ""
        const images = [mainImage, ...normalizedImages].filter((img) => img && img.length > 0)
        const uniqueImages = Array.from(new Set(images))

        const normalizedProduct = {
          ...data,
          colors: colorsValue,
          material: data.material ?? data.Material ?? "",
          images: uniqueImages,
          mainImage,
          price: Number.isFinite(price) ? price : 0,
          discountAmount: Number.isFinite(discountAmount) ? discountAmount : 0,
          stockNumber: Number.isFinite(stockNumber) ? stockNumber : 0,
        }

        setProduct(normalizedProduct)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")}/api/review/get-reviews?productId=${id}`)
        if (res.ok) {
          const data = await res.json()
          const emailToName = (email?: string) => {
            if (!email || typeof email !== "string") return null
            const at = email.indexOf("@")
            const raw = (at >= 0 ? email.slice(0, at) : email).trim()
            return raw.length ? raw : null
          }

          // Backend DTO is `ReviewDto` => { review, rating, userEmail, createdDate, ... }
          const normalizedReviews = (Array.isArray(data) ? data : []).map((r: any) => ({
            id: (r.id ?? r.Id ?? Date.now().toString()).toString(),
            title: r.title || (language === "ar" ? "تقييم" : "Review"),
            date: (r.createdDate ?? r.CreatedDate)
              ? String(r.createdDate ?? r.CreatedDate).split("T")[0]
              : new Date().toISOString().split("T")[0],
            rating: Number(r.rating ?? r.Rating ?? 0),
            text: String(r.review ?? r.Review ?? "").trim(),
            userName:
              emailToName(r.userName ?? r.UserName ?? r.userEmail ?? r.UserEmail) ||
              (language === "ar" ? "مستخدم" : "User"),
          }))
          setReviews(normalizedReviews)
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
      }
    }
    if (id) fetchReviews()
  }, [id, language])

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
        <Navbar />
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
        <Navbar />
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

  const discountedPrice = product.discountAmount > 0 ? product.price * (1 - product.discountAmount / 100) : product.price
  const colors = parseColors(product.colorsEn)

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.mainImage || "/placeholder.svg"]

  const maxQty = product.stockNumber > 0 ? product.stockNumber : Number.MAX_SAFE_INTEGER
  const increment = () => setQuantity(q => Math.min(q + 1, maxQty))
  const decrement = () => setQuantity(q => Math.max(1, q - 1))

  const submitReview = async () => {
    if (!reviewText.trim() || !reviewTitle.trim()) return

    try {
      const payload = {
        productId: id,
        title: reviewTitle,
        review: reviewText,
        rating: reviewRating
      }

      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")}/api/review/add-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      })

      if (res.ok) {
        const text = await res.text()
        let r: any = {}
        try {
          r = text ? JSON.parse(text) : {}
        } catch (e) {
          console.log("Response is not JSON, treating as success string")
        }

        const newReview: Review = {
          id: r?.id || Date.now().toString(),
          title: reviewTitle,
          date: new Date().toISOString().split("T")[0],
          rating: reviewRating,
          text: reviewText,
          userName: language === "ar" ? "أنت" : "You",
        }
        setReviews([newReview, ...reviews])
        setShowReviewForm(false)
        setReviewText("")
        setReviewTitle("")
        setReviewRating(5)
        setCurrentReviewIndex(0)
      } else {
        const errText = await res.text()
        console.error("Failed to add review:", errText)
        alert(language === "ar" ? "فشل إضافة التقييم. ربما تحتاج لتسجيل الدخول." : "Failed to add review. You might need to login.")
      }
    } catch (err) {
      console.error("Error submitting review:", err)
    }
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
      <Navbar />

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
                src={getImageUrl(productImages[selectedImageIndex])}
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
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImageIndex === index ? "border-primary ring-2 ring-primary/30" : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <Image
                    src={getImageUrl(img)}
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



              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-foreground">{formatPrice(discountedPrice)}</span>
                {product.discountAmount > 0 && (
                  <span className="text-xl line-through text-gray-400">{formatPrice(product.price)}</span>
                )}
                {product.discountAmount > 0 && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(product.discountAmount)}% {language === "ar" ? "خصم" : "OFF"}
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
              {colors.length > 0 && (
                <div className="mb-6">
                  <span className="text-gray-500 block mb-3 font-semibold uppercase tracking-wider text-xs">
                    Select Finish
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className="group flex flex-col items-center gap-2"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                            selectedColor === color.name
                              ? "border-primary ring-2 ring-primary/20 scale-110 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 shadow-sm"
                          )}
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor === color.name && (
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              color.hex.toLowerCase() === "#ffffff" || color.name.toLowerCase() === "white" ? "bg-black" : "bg-white"
                            )} />
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold tracking-wide transition-colors uppercase",
                          selectedColor === color.name ? "text-primary" : "text-gray-400"
                        )}>
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Material */}
              {product.materialEn && product.materialEn.trim().length > 0 && (
                <div className="mb-6">
                  <span className="text-gray-500 block mb-2">{t("products.material")}:</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 border rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                      {language === "ar" ? product.materialAr : product.materialEn}
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-500">{language === "ar" ? "الكمية:" : "Quantity:"}</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      decrement()
                    }}
                    className="px-4 h-10"
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-14 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      increment()
                    }}
                    className="px-4 h-10"
                    disabled={product.stockNumber > 0 && quantity >= product.stockNumber}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3 mb-6">
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={async () => {
                    if (colors.length > 0 && !selectedColor) {
                      alert(language === "ar" ? "يرجى اختيار اللون أولاً" : "Please select a color first");
                      return;
                    }
                    try {
                      await addItem(product.id, quantity, selectedColor || "Default")
                      window.location.href = "/cart"
                    } catch (error) {
                      console.error("Failed to add to cart:", error)
                    }
                  }}

                  disabled={!isInStock || (colors.length > 0 && !selectedColor)}
                >
                  <ShoppingCart size={22} />
                  {(colors.length > 0 && !selectedColor)
                    ? "Select Color"
                    : t("products.addToCart")}
                </Button>


                <Button
                  variant="outline"
                  className="flex items-center justify-center h-12 px-4"
                  onClick={() =>
                    toggleItem({
                      id: product.id,
                      name: { ar: product.nameAr, en: product.nameEn },
                      price: discountedPrice,
                      originalPrice: product.price,
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
                  {product.materialEn && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">{language === "ar" ? "الخامة" : "Material"}</span>
                      <span className="font-semibold">{language === "ar" ? product.materialAr : product.materialEn}</span>
                    </div>
                  )}
                  {colors.length > 0 && (
                    <div className="flex justify-between items-start py-2">
                      <span className="text-gray-500">Available Colors</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {colors.map((color, index) => (
                          <span key={index} className="px-3 py-1 border rounded-full text-sm bg-gray-100 font-medium">
                            {color.name}
                          </span>
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
                          {[1, 2, 3, 4, 5].map(i => (
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
                    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-visible">
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
                            className="absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowLeft size={20} />
                          </button>
                          <button
                            onClick={nextReview}
                            disabled={currentReviewIndex === reviews.length - 1}
                            className="absolute -right-4 md:-right-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className={`w-2 h-2 rounded-full transition-all ${currentReviewIndex === index ? "bg-primary w-4" : "bg-gray-300"
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
      </section >

      <Footer />
    </div >
  )
}

// Stars Component
function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={18}
          className={i <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  )
}
