"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HeartIcon, StarIcon, ShoppingCartIcon } from "@/components/layout/LucideIcons";
import { getImageUrl, parseColors } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";

interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

interface ProductCardProps {
  product?: {
    id?: string;
    nameAr?: string;
    nameEn?: string;
    price?: number;
    discountAmount?: number;
    stockNumber?: number;
    colorsEn?: string;
    colorsAr?: string;
    mainImage?: string;
    image?: string;
    rating?: number;
    reviewsCount?: number;
  };
  id?: string;
  category?: string;
  title?: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  discountAmount?: number;
  rating?: number;
  reviewsCount?: number;
  mainImage?: string;
  colorsRaw?: string;
  colors?: ColorOption[];
  defaultColor?: string;
  stockNumber?: number;
  isWishlisted?: boolean;
  onAddToCart?: (productId: string, selectedColorName: string) => void | Promise<void>;
  onToggleWishlist?: (productId: string) => void | Promise<void>;
}

export function ProductCard({
  product,
  id: propId,
  category = "PREMIUM FURNITURE",
  title: propTitle,
  description: propDescription,
  price: propPrice,
  originalPrice,
  discountAmount = 0,
  rating: propRating,
  reviewsCount: propReviewsCount,
  mainImage: propMainImage,
  colorsRaw: propColorsRaw,
  colors: providedColors,
  defaultColor,
  stockNumber: propStockNumber,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { language } = useLanguage();

  const id = propId ?? product?.id
  const title = propTitle ?? (product ? (language === "ar" ? product.nameAr : product.nameEn) ?? "" : "")
  const description = propDescription ?? title
  const price = propPrice ?? (product ? `${product.price} EGP` : "")
  const rating = propRating ?? product?.rating ?? 0
  const reviewsCount = propReviewsCount ?? product?.reviewsCount ?? 0
  const mainImage = propMainImage ?? product?.mainImage ?? product?.image
  const colorsRaw = propColorsRaw ?? (product ? (language === "ar" ? product.colorsAr : product.colorsEn) ?? "" : "")
  const stockNumber = propStockNumber ?? product?.stockNumber
  const isInStock = stockNumber === undefined || stockNumber > 0;
  const discountAmountVal = discountAmount ?? product?.discountAmount ?? 0
  const hasDiscount = discountAmountVal > 0;
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
    router.push(`/product/${id}`);
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

  return (
    <div className="relative w-full bg-white rounded-[2rem] p-5 md:p-6 flex flex-col gap-5 border border-[#7B3F32]/10 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(123,63,50,0.18)] hover:-translate-y-1.5 group h-full overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-10 h-32 w-32 rounded-full bg-[#7B3F32]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-[#C1AFA0]/35 blur-2xl" />
      {/* Top Section with Image */}
      <div className="relative bg-gradient-to-br from-[#f9f4ef] via-[#f7ece1] to-[#f1e2d4] rounded-[1.6rem] aspect-[1.2/1] flex items-center justify-center p-4 overflow-hidden border border-white/80">
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#7B3F32] text-white text-[10px] font-bold tracking-wide z-10">
            -{discountAmountVal}%
          </span>
        )}
        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10 border border-[#7B3F32]/10"
        >
          <HeartIcon className={`w-4 h-4 ${isWishlisted ? "text-[#E53935] fill-[#E53935]" : "text-[#B89A8A]"}`} />
        </button>

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
          <div className="flex items-center gap-1.5 rounded-full bg-[#f7efe7] px-2.5 py-1 border border-[#7B3F32]/10">
            <StarIcon className="w-3.5 h-3.5 text-[#FBC02D] fill-[#FBC02D]" />
            <span className="text-[11px] font-bold text-[#3D2B1F]">
              {rating} ({reviewsCount})
            </span>
          </div>
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
            {hasDiscount && originalPrice && (
              <span className="text-[13px] text-[#A1A1A1] line-through font-medium">
                {originalPrice}
              </span>
            )}
            {hasDiscount && !originalPrice && price && (
              <span className="text-[13px] text-[#A1A1A1] line-through font-medium">
                {price}
              </span>
            )}
            <span className={`text-3xl font-bold ${hasDiscount ? "text-red-600" : "text-[#2f2219]"}`}>
              {hasDiscount 
                ? (() => {
                    // Parse and calculate discounted price from the passed price string
                    const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
                    const discounted = Math.round(numPrice - (numPrice * discountAmountVal / 100));
                    return `${discounted.toLocaleString()} EGP`;
                  })()
                : price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-red-500 font-medium">
                Save {discountAmountVal}%
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
