"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "@/components/layout/LucideIcons"
import { getPublicStyles, type PublicCategory } from "@/lib/products"
import { ScrollArrows } from "@/components/ui/ScrollArrows"

const FALLBACK_STYLES = [
  {
    id: "fallback-bedroom",
    nameEn: "Bedroom",
    imageUrl: "/Gemini_Generated_Image_o20qsuo20qsuo20q.png",
  },
  {
    id: "fallback-living-room",
    nameEn: "Living Room",
    imageUrl: "/hero.png",
  },
  {
    id: "fallback-dining-room",
    nameEn: "Dining Room",
    imageUrl: "/green-sofa.png",
  },
  {
    id: "fallback-workshop",
    nameEn: "Workshop",
    imageUrl: "/Gemini_Generated_Image_cdx4nlcdx4nlcdx4.png",
  },
]

interface DiscoverByStyleProps {
  initialStyles?: PublicCategory[]
}

export function DiscoverByStyle({ initialStyles = [] }: DiscoverByStyleProps) {
  const [styles, setStyles] = useState<PublicCategory[]>(
    initialStyles.filter((category) => category.nameEn)
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialStyles.length > 0) return
    let active = true

    const loadCategories = async () => {
      try {
        const categories = await getPublicStyles()
        if (!active) return
        setStyles(categories.filter((category) => category.nameEn))
      } catch (error) {
        console.error("Failed to load discover categories:", error)
      }
    }

    loadCategories()
    return () => {
      active = false
    }
  }, [initialStyles])

  const items = styles.length > 0 ? styles : FALLBACK_STYLES

  return (
    <section className="py-24 px-8 bg-white" id="discover">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif text-mahogany italic">
            Discover by Style
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-4 md:px-8">
          <ScrollArrows scrollRef={scrollRef} scrollAmount={300} />
           <div ref={scrollRef} className="flex overflow-x-hidden pb-12 snap-x snap-mandatory w-fit min-w-full gap-8 no-scrollbar">
            {items.map((style) => (
            <Link
              key={style.id}
              href={styles.length > 0 ? `/category/${encodeURIComponent(style.id)}` : "/product"}
              className="group relative flex-shrink-0 w-[80vw] md:w-[300px] aspect-[3/5] rounded-[3rem] overflow-hidden cursor-pointer snap-center shadow-lg transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="absolute inset-0 bg-[#F5F5F5]">
                <img
                  src={style.imageUrl || "/placeholder.jpg"}
                  alt={style.nameEn}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              {/* Overlay Gradient - Fixed (Always Visible) */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-100" />

              {/* Text Content - Fixed (Always Visible) */}
              <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col items-center">
                <h3 className="text-3xl font-serif text-mahogany mb-3 italic">{style.nameEn}</h3>
                <div className="flex items-center gap-3 opacity-100 translate-y-0">
                  <p className="text-[9px] tracking-[0.25em] font-bold text-taupe uppercase">
                    EXPLORE STYLE
                  </p>
                  <ArrowRightIcon className="w-3 h-3 text-taupe" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
