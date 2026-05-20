"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HeartIcon, StarIcon, ShoppingCartIcon } from "@/components/layout/LucideIcons";
import { Star } from "lucide-react";
import { getImageUrl, parseColors } from "@/lib/utils"
import { formatPrice } from "@/lib/products";
import { useCart } from "@/context/cart-context";
import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

interface ColorOption {
  name: string;
  hex: string;
  image: string;
}


type Review = {
  id: string
  title: string
  date: string
  rating: number
  text: string
  userName: string
}

interface ProductCardProps {
  product?: {
    id?: string;
    nameAr?: string;
    nameEn?: string;
    oldprice?: number;
    oldPrice?: number;
    price?: number;
    originalPrice?: number;
    discountAmount?: number;
    stockNumber?: number;
    colorsEn?: string;
    colorsAr?: string;
    mainImage?: string;
    image?: string;
    rating?: number;
    reviewsCountVal?: number;
  };
  id?: string;
  category?: string;
  title?: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  discountAmount?: number;
  rating?: number;
  reviewsCountVal?: number;
  mainImage?: string;
  colorsRaw?: string;
  colors?: ColorOption[];
  defaultColor?: string;
  stockNumber?: number;
  href?: string;
  isWishlisted?: boolean;
  onAddToCart?: (productId: string, selectedColorName: string) => void | Promise<void>;
  onToggleWishlist?: (productId: string) => void | Promise<void>;
}

export function ProductCard({
  product,
  id: propId,
  category = "PREMIUM STYLE",
  title: propTitle,
  description: propDescription,
  price: propPrice,
  originalPrice,
  discountAmount = 0,
  rating: propRating,
  reviewsCountVal: propReviewsCount,
  mainImage: propMainImage,
  colorsRaw: propColorsRaw,
  colors: providedColors,
  defaultColor,
  stockNumber: propStockNumber,
  href,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [fetchedAverageRating, setFetchedAverageRating] = useState(0)
  const [fetchedReviewsCount, setFetchedReviewsCount] = useState(0)
  const id = propId ?? product?.id
  const title = propTitle ?? (product ? (language === "ar" ? product.nameAr : product.nameEn) ?? "" : "")
  const description = propDescription ?? title
  const price = propPrice ?? (product ? `${product.price} EGP` : "")
  const rating = propRating ?? product?.rating ?? 0
  const reviewsCountVal = propReviewsCount ?? product?.reviewsCountVal ?? 0
  const mainImage = propMainImage ?? product?.mainImage ?? product?.image
  const colorsRaw = propColorsRaw ?? (product ? (language === "ar" ? product.colorsAr : product.colorsEn) ?? "" : "")
  const quantity = propStockNumber ?? product?.stockNumber
  const isInStock = quantity === undefined || quantity > 0;
  const parseNumberish = (value: unknown): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const normalized = value
        .replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)] ?? d)
        .replace(/[٫]/g, ".")
        .replace(/[٬،]/g, ",");
      const cleaned = normalized.replace(/,/g, "").replace(/[^\d.-]/g, "");
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value == null) return 0;
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };
  const discountAmountVal = parseNumberish(discountAmount ?? product?.discountAmount ?? 0);
  const normalizedDiscount = Number.isFinite(discountAmountVal)
    ? Math.min(99.99, Math.max(0, discountAmountVal))
    : 0;
  const currentPriceNum = (() => {
    const fromProduct = parseNumberish(product?.price);
    if (Number.isFinite(fromProduct) && fromProduct > 0) return fromProduct;
    return parseNumberish(price);
  })();
  const originalPriceNum = (() => {
    const fromOriginal = parseNumberish(product?.originalPrice);
    if (Number.isFinite(fromOriginal) && fromOriginal > 0) return fromOriginal;
    const fromOld = parseNumberish(product?.oldPrice);
    if (Number.isFinite(fromOld) && fromOld > 0) return fromOld;
    return parseNumberish(originalPrice);
  })();
  const hasValidCurrentPrice = currentPriceNum > 0;
  const hasExplicitOldPrice = hasValidCurrentPrice && originalPriceNum > currentPriceNum;
  const hasDiscount = hasValidCurrentPrice && (normalizedDiscount > 0 || hasExplicitOldPrice);

  let computedDiscountPercent = 0;
  let displayMainPrice = price;
  let displayLineThrough = originalPrice;

  if (hasExplicitOldPrice) {
    computedDiscountPercent = Math.round(((originalPriceNum - currentPriceNum) / originalPriceNum) * 100);
    displayMainPrice = `${formatPrice(currentPriceNum)} EGP`;
    displayLineThrough = `${formatPrice(originalPriceNum)} EGP`;
  } else if (normalizedDiscount > 0 && currentPriceNum > 0) {
    computedDiscountPercent = Math.round(normalizedDiscount);
    displayLineThrough = displayLineThrough ?? `${formatPrice(Math.round(currentPriceNum / (1 - normalizedDiscount / 100)))} EGP`;
    displayMainPrice = `${formatPrice(currentPriceNum)} EGP`;
  }
  const parsed = parseColors(colorsRaw);
  const colors = (providedColors && providedColors.length > 0)
    ? providedColors
    : (parsed.length > 0
      ? parsed.map(p => ({ ...p, image: mainImage || "/placeholder.svg" }))
      : [{ name: "Default", hex: "#5A5D63", image: mainImage || "/placeholder.svg" }]
    );

  const [selectedColor, setSelectedColor] = useState(
    colors.find((c) => c.name === defaultColor) || colors[0]
  );
  const [isAdding, setIsAdding] = useState(false);

  const navigateToProduct = () => {
    if (!id) return;
    router.push(href || `/product/${id}`);
  };

  const handleWishlist = async () => {
    if (!id || !onToggleWishlist) return;
    try {
      await onToggleWishlist(id);
    } catch (error) {
      console.error("Failed to toggle wishlist from card:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!id) return;

    try {
      setIsAdding(true);
      if (onAddToCart) {
        await onAddToCart(id, selectedColor.name || "Default");
      } else {
        await addItem(id, 1, selectedColor.name || "Default");
        toast.success(language === "ar" ? "تمت إضافة المنتج إلى السلة" : "Added to cart");
      }
    } catch (error) {
      console.error("Failed to add to cart from card:", error);
      toast.error(language === "ar" ? "فشل إضافة المنتج إلى السلة" : "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")

        const [reviewsRes, avgRes, countRes] = await Promise.all([
          fetch(`${apiBase}/api/review/get-reviews?productId=${id}`),
          fetch(`${apiBase}/api/review/get-average-reviews?productId=${id}`),
          fetch(`${apiBase}/api/review/get-reviews-count?productId=${id}`)
        ])

        if (reviewsRes.ok) {
          const data = await reviewsRes.json()
          const emailToName = (email?: string) => {
            if (!email || typeof email !== "string") return null
            const at = email.indexOf("@")
            const raw = (at >= 0 ? email.slice(0, at) : email).trim()
            return raw.length ? raw : null
          }

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

        if (avgRes.ok) {
          const avg = await avgRes.json()
          setFetchedAverageRating(Number(avg) || 0)
        }

        if (countRes.ok) {
          const count = await countRes.json()
          setFetchedReviewsCount(Number(count) || 0)
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
      }
    }
    if (id) fetchReviews()
  }, [id, language])

  return (
    <div className="relative w-full bg-white rounded-[2rem] p-5 md:p-6 flex flex-col gap-5 border border-[#7B3F32]/10 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(123,63,50,0.18)] hover:-translate-y-1.5 group h-full overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-10 h-32 w-32 rounded-full bg-[#7B3F32]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-[#C1AFA0]/35 blur-2xl" />
      {/* Top Section with Image */}
      <div className="relative bg-gradient-to-br from-[#f9f4ef] via-[#f7ece1] to-[#f1e2d4] rounded-[1.6rem] aspect-[1.2/1] flex items-center justify-center p-4 overflow-hidden border border-white/80">
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#7B3F32] text-white text-[10px] font-bold tracking-wide z-10">
            -{computedDiscountPercent}%
          </span>
        )}
        {/* Stock Status Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-wide z-10 ${isInStock ? "bg-green-500" : "bg-red-500"}`}>
          {isInStock ? (language === "ar" ? "متوفر" : "In Stock") : (language === "ar" ? "غير متوفر" : "Out of Stock")}
        </span>

        {/* Product Image */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 cursor-pointer"
          onClick={navigateToProduct}
        >
          <Image
            src={getImageUrl(selectedColor.image)}
            alt={title}
            width={400}
            height={300}
            className="object-contain drop-shadow-[0_16px_26px_rgba(0,0,0,0.14)]"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col gap-4 px-1">
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#8f7c71] uppercase">
            {category}
          </span>
          {/* Rating */}
          {reviewsCountVal > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-[#6f6157]">
                {fetchedAverageRating.toFixed(1)} ({reviewsCountVal} {language === "ar" ? "تقييم" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-bold text-[#2f2219] leading-tight font-sans cursor-pointer hover:text-mahogany transition-colors"
          onClick={navigateToProduct}
        >
          {title}
        </h3>


        {/* Description */}
        <p className="text-[13px] text-[#887467] leading-relaxed font-medium line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Select Finish */}
        <div className="flex flex-col gap-4 mt-2">
          <span className="text-[13px] font-bold text-[#2f2219]">
            Select Finish
          </span>
          <div className="flex items-center gap-5">
            {colors.map((color) => (
              <button
                type="button"
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className="flex flex-col items-center gap-2 group/color"
              >
                <div
                  className={`w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center border border-black/5 ${selectedColor.name === color.name
                    ? "ring-2 ring-[#2f2219] ring-offset-2"
                    : "hover:scale-105"
                    }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className={`text-[10px] font-bold transition-colors tracking-wide ${selectedColor.name === color.name ? "text-[#788896]" : "text-[#788896]/60"
                  }`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#e9ddd2] w-full mt-2" />

        {/* Pricing & Cart */}
        <div className="flex items-end justify-between gap-3 mt-2">
          <div className="flex flex-col">
            {hasDiscount && displayLineThrough && (
              <span className="text-[13px] text-[#A1A1A1] line-through font-medium">
                {displayLineThrough}
              </span>
            )}
            <span className={`text-3xl font-bold ${hasDiscount ? "text-red-600" : "text-[#2f2219]"}`}>
              {displayMainPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-red-500 font-medium">
                Save {computedDiscountPercent}%
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || !isInStock}
            className="flex items-center gap-2 bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white px-5 py-3.5 rounded-2xl hover:from-[#5f3026] hover:to-[#8e4f3f] transition-all active:scale-95 shadow-[0_10px_22px_rgba(123,63,50,0.38)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span className="text-[12px] font-bold tracking-tight">
              {isAdding ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
