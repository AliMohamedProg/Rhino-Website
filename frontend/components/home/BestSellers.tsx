"use client"

import { ProductCard } from "@/components/ui/ProductCard";
import { type PublicProduct } from "@/lib/products";

interface BestSellersProps {
  initialBestSellers: PublicProduct[]
}

export function BestSellers({ initialBestSellers }: BestSellersProps) {
  return (
    <section className="py-24 px-8 bg-white min-h-screen" id="catalog">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        <div className="flex flex-col items-center gap-4 mb-20 text-center">
          <span className="text-[10px] tracking-[0.4em] font-bold text-taupe uppercase">
            Customer Favorites
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-mahogany italic">
            Best Sellers
          </h2>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl mx-auto no-scrollbar">
          {(initialBestSellers || []).slice(0, 3).map((product, index) => (
            <div key={index} className="min-w-[85vw] md:min-w-0 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
