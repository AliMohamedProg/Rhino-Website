"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/utils"
import { getPublicSliders, type PublicSlider } from "@/lib/products"

// Fallback banners if API fails
const fallbackBanners = [
  {
    id: 1,
    image: "/placeholder.svg?height=500&width=1200",
    title: { en: "New Year.. New Home", ar: "سنة جديدة .. بيت جديد" },
    subtitle: { en: "We Wish You Merry Christmas", ar: "نتمنى لكم عيد ميلاد سعيد" },
    cta: { en: "Shop Now", ar: "تسوق الآن" },
    href: "/category/furniture",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=500&width=1200",
    title: { en: "Living Room Collection", ar: "مجموعة غرف المعيشة" },
    subtitle: { en: "Up to 40% Off", ar: "خصم يصل إلى 40%" },
    cta: { en: "Explore", ar: "استكشف" },
    href: "/category/living",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=500&width=1200",
    title: { en: "Dream Bedroom", ar: "غرفة نوم الأحلام" },
    subtitle: { en: "Complete Sets Available", ar: "أطقم كاملة متوفرة" },
    cta: { en: "Shop Sets", ar: "تسوق الأطقم" },
    href: "/category/bedroom",
  },
]

export function HeroBanner({ initialSliders }: { initialSliders?: PublicSlider[] }) {
  const { language, dir } = useLanguage()
  const [sliders, setSliders] = useState<PublicSlider[]>(initialSliders || [])
  const [loading, setLoading] = useState(initialSliders ? false : true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchSliders = async () => {
      if (initialSliders && initialSliders.length > 0) return // Skip fetch if we have SSR data
      
      try {
        const data = await getPublicSliders()
        if (data.length > 0) {
          setSliders(data)
        } else {
          setSliders([])
        }
      } catch (error) {
        console.error("Error fetching sliders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSliders()
  }, [initialSliders])

  // Use API sliders or fallback
  const banners = sliders.length > 0
    ? sliders.map((slider) => ({
      id: slider.id,
      image: slider.imageUrl,
      title: { en: slider.titleEn, ar: slider.titleAr },
      subtitle: { en: "", ar: "" },
      cta: { en: "Shop Now", ar: "تسوق الآن" },
      href: "/product",
    }))
    : fallbackBanners

  // Update currentSlide when banners change
  useEffect(() => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => prev % banners.length)
    }
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (loading) {
    return (
      <section className="relative bg-secondary overflow-hidden">
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
          <div className="absolute inset-0 bg-muted animate-pulse" />
        </div>
      </section>
    )
  }

  // Ensure currentSlide is within bounds before rendering
  const safeIndex = (currentSlide >= 0 && currentSlide < banners.length) ? currentSlide : 0;

  return (
    <section className="relative bg-secondary overflow-hidden group">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        {/* Render all images but only show the current one with opacity to prevent flickers/disappearance */}
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === safeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={getImageUrl(banner.image)}
              alt={banner.title[language] || "Banner Image"}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center">
              <div className={`container mx-auto px-4 ${dir === "rtl" ? "flex justify-start" : ""}`}>
                <div className={`max-w-2xl ${dir === "rtl" ? "pr-8 md:pr-12 text-right" : "pl-8 md:pl-12"}`}>
                  <p className="text-primary-foreground/90 text-sm md:text-base mb-2">{banner.subtitle[language]}</p>
                  <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
                    {banner.title[language]}
                  </h1>
                  <Link href={banner.href}>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {banner.cta[language]}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 hover:bg-card flex items-center justify-center text-foreground transition-all z-20 md:opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          {dir === "rtl" ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
        <button
          onClick={nextSlide}
          className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 hover:bg-card flex items-center justify-center text-foreground transition-all z-20 md:opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          {dir === "rtl" ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === safeIndex ? "bg-accent" : "bg-card/50 hover:bg-card"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
