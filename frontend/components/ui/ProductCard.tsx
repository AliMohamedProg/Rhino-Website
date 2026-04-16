// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { HeartIcon, StarIcon, ShoppingCartIcon } from "./LucideIcons";

// interface ColorOption {
//   name: string;
//   hex: string;
//   image: string;
// }

// interface ProductCardProps {
//   badge?: string;
//   category: string;
//   title: string;
//   description: string;
//   price: string;
//   originalPrice: string;
//   rating?: number;
//   reviewsCount?: number;
//   colors: ColorOption[];
//   defaultColor?: string;
// }

"use client";

import Image from "next/image";
import { useState } from "react";
import { HeartIcon, StarIcon, ShoppingCartIcon } from "@/components/layout/LucideIcons";
import { getImageUrl, parseColors } from "@/lib/utils";

interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

interface ProductCardProps {
  id?: string;
  badge?: string;
  category: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  rating?: number;
  reviewsCount?: number;
  mainImage?: string;
  colorsRaw?: string;
  colors?: ColorOption[];
  defaultColor?: string;
}

export function ProductCard({
  id,
  badge = "New Arrival",
  category = "PREMIUM FURNITURE",
  title,
  description,
  price,
  originalPrice,
  rating = 4.9,
  reviewsCount = 124,
  mainImage,
  colorsRaw,
  colors: providedColors,
  defaultColor,
}: ProductCardProps) {
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


  return (
    <div className="bg-white rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-sm border border-gray-100 max-w-sm transition-all duration-300 hover:shadow-xl group">
      {/* Top Section with Image */}
      <div className="relative bg-[#F8F8F8] rounded-[2rem] aspect-[1.2/1] flex items-center justify-center p-4 overflow-hidden">
        {/* Badge */}
        <div className="absolute top-4 left-4 bg-[#333333] text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wider z-10">
          {badge}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10">
          <HeartIcon className="w-4 h-4 text-[#E53935] fill-[#E53935]" />
        </button>

        {/* Product Image */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 cursor-pointer"
          onClick={() => id && (window.location.href = `/product/${id}`)}
        >
          <Image
            src={getImageUrl(selectedColor.image)}
            alt={title}
            width={400}
            height={300}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 px-2">
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#A1A1A1] uppercase">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5 text-[#FBC02D] fill-[#FBC02D]" />
            <span className="text-[11px] font-bold text-[#333333]">
              {rating} ({reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="text-2xl font-bold text-black leading-tight font-sans cursor-pointer hover:text-mahogany transition-colors"
          onClick={() => id && (window.location.href = `/product/${id}`)}
        >
          {title}
        </h3>


        {/* Description */}
        <p className="text-[13px] text-taupe leading-relaxed font-medium">
          {description}
        </p>

        {/* Select Finish */}
        <div className="flex flex-col gap-4 mt-2">
          <span className="text-[13px] font-bold text-black">
            Select Finish
          </span>
          <div className="flex items-center gap-6">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className="flex flex-col items-center gap-2 group/color"
              >
                <div
                  className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${selectedColor.name === color.name
                      ? "ring-2 ring-black ring-offset-2"
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
        <div className="h-[1px] bg-[#EEEEEE] w-full mt-2" />

        {/* Pricing & Cart */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[13px] text-[#A1A1A1] line-through font-medium">
              {originalPrice}
            </span>
            <span className="text-3xl font-bold text-black">
              {price}
            </span>
          </div>
          <button className="flex items-center gap-2 bg-mahogany text-white px-6 py-4 rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-lg">
            <ShoppingCartIcon className="w-5 h-5" />
            <span className="text-[13px] font-bold tracking-tight">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
