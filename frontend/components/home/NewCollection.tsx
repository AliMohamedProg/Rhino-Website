"use client"

import { ProductCard } from "@/components/ui/ProductCard";
import { formatPrice, type PublicProduct } from "@/lib/products";

interface NewCollectionsProps {
    initialProducts: PublicProduct[]
}

export function NewCollections({ initialProducts }: NewCollectionsProps) {
    const displayProducts = (initialProducts || []).slice(0, 3).map(p => ({
        id: p.id,
        badge: "NEW",
        category: "FURNITURE",
        title: p.nameEn,
        description: p.descriptionEn,
        price: `${formatPrice(p.price)} EGP`,
        originalPrice: p.discountAmount && p.discountAmount > 0 
            ? `${formatPrice(Math.round(p.price / (1 - p.discountAmount / 100)))} EGP` 
            : "",
        rating: 4.9, 
        reviewsCount: 124, 
        mainImage: p.mainImage,
        colorsRaw: p.colorsEn,
    }));



    return (
        <section className="py-24 px-8 bg-blush">
            <div className="max-w-7xl mx-auto flex flex-col">

                <div className="flex flex-col gap-4 mb-20 px-2">
                    <span className="text-[10px] tracking-[0.4em] font-bold text-taupe uppercase">
                        Curated Ranges
                    </span>
                    <h2 className="text-5xl md:text-7xl font-serif text-mahogany italic">
                        New Collections
                    </h2>
                </div>

                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full no-scrollbar">
                    {displayProducts.map((product, index) => (
                        <div key={index} className="min-w-[85vw] md:min-w-0 snap-center">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}