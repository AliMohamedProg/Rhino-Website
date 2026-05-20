"use client"

import Link from "next/link"
import { ArrowRightIcon, LeafIcon } from "lucide-react"
import { getPublicCategories, type PublicCategory } from "@/lib/products"
import { useState, useEffect } from "react"

interface GridItemProps {
  title: string
  description?: string
  image: string
  href: string
  className?: string
  badge?: string
  badgeIcon?: React.ReactNode
}

function GridItem({ title, description, image, href, className, badge, badgeIcon }: GridItemProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:shadow-2xl ${className}`}
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase text-[#0B2A27] shadow-sm">
          {badgeIcon}
          {badge}
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="inline-block px-8 py-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl transition-all duration-500 group-hover:bg-white/30">
          <h3 className="text-2xl md:text-3xl font-serif text-[#0B2A27] mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-[#0B2A27]/70 mb-4 max-w-[240px] leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2 group/link">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              EXPLORE CATEGORY
            </span>
            <ArrowRightIcon className="w-3 h-3 text-primary transition-transform duration-300 group-hover/link:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ArtOfLiving() {
  const [categories, setCategories] = useState<PublicCategory[]>([])


  useEffect(() => {
    const fetchCats = async () => {
      const data = await getPublicCategories()
      setCategories(data || [])
    }
    fetchCats()
  }, [])

  // If we have real categories, map them. Otherwise show empty or fallback.
  const displayCategories = categories.length > 0 ? categories : []

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-20 px-2">
          <h2 className="text-5xl md:text-7xl font-serif text-mahogany italic">
            The Art of Living
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
          {displayCategories.map((cat, index) => {
            // Determine layout based on index for variety
            let className = ""
            if (index === 0) className = "md:col-span-2 md:row-span-2"
            else if (index === 1) className = "md:col-span-1"
            else className = "md:col-span-1"

            return (
              <GridItem
                key={cat.id}
                title={cat.name}
                image={cat.imageUrl || "/art-living-1.png"}
                href={`/category/${cat.id}`}
                className={className}
                badge={index === 0 ? "Sustainable Choice" : undefined}
                badgeIcon={index === 0 ? <LeafIcon className="w-3 h-3 text-primary" /> : undefined}
              />
            )
          })}

          {/* Fallback items if API returns few items */}
          {displayCategories.length === 0 && (
            <>
              <GridItem title="Living Room" image="/art-living-1.png" href="/category/living" className="md:col-span-2 md:row-span-2" />
              <GridItem title="Kitchen & Dining" image="/art-living-2.png" href="/category/dining" />
              <GridItem title="Bedroom" image="/art-living-3.png" href="/category/bedroom" />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
