"use client";

import { useEffect, useState } from "react";
import { getPublicSliders, type PublicSlider } from "@/lib/products";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackBanners = [
  {
    id: "fb-1",
    image: "/our-story.png",
    title: "New Year.. New Home",
  },
  {
    id: "fb-2",
    image: "/hero.png",
    title: "Living Room Collection",
  },
];

export function Hero({ initialSliders }: { initialSliders?: PublicSlider[] }) {
  const [sliders, setSliders] = useState<PublicSlider[]>(initialSliders || [])
  const [loading, setLoading] = useState(initialSliders ? false : true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchSliders = async () => {
      if (initialSliders && initialSliders.length > 0) return

      try {
        const data = await getPublicSliders()
        setSliders(data.length > 0 ? data : [])
      } catch (error) {
        console.error("Error fetching sliders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSliders()
  }, [initialSliders])

  const banners = sliders.length > 0
    ? sliders.map((slider) => ({
      id: slider.id,
      image: slider.imageUrl,
      title: slider.title, // English only
    }))
    : fallbackBanners

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [banners.length])

  if (loading) {
    return (
      <section className="relative bg-secondary overflow-hidden h-[300px] sm:h-[400px] md:h-[500px]">
        <div className="absolute inset-0 bg-muted animate-pulse" />
      </section>
    )
  }

  const safeIndex = (currentSlide >= 0 && currentSlide < banners.length) ? currentSlide : 0;

  return (
    <section className="relative bg-secondary overflow-hidden group">
      <div className="relative h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === safeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={getImageUrl(banner.image)}
              alt="Banner Image"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                  <span className="text-[10px] md:text-[12px] tracking-[0.6em] font-bold text-white uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    PREMIUM COLLECTION 2024
                  </span>
                  <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight italic animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    {banner.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-mahogany p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-mahogany p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${index === safeIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}