"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

interface Category {
  id: string
  nameAr: string
  nameEn: string
  imageUrl?: string
  currentState: number
}

export function CategoriesGrid() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiClient.get("api/category") as Category[]

        // لو حابب تخفي الديليتد / غير النشطة
        const activeCategories = data.filter(c => c.currentState === 1)

        setCategories(activeCategories)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-10 bg-secondary text-center">
        {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
      </section>
    )
  }

  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
          {language === "ar" ? "تسوق حسب الفئة" : "Shop by Category"}
        </h2>

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group"
            >
              <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors">
                <div className="relative h-32 md:h-40">
                  <Image
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={language === "ar" ? category.nameAr : category.nameEn}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3 text-center">
                  <h3 className="font-medium text-foreground text-sm md:text-base">
                    {language === "ar" ? category.nameAr : category.nameEn}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
