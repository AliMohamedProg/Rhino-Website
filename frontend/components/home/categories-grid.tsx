"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { categories } from "@/lib/products"

export function CategoriesGrid() {
  const { language } = useLanguage()

  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
          {language === "ar" ? "تسوق حسب الفئة" : "Shop by Category"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="group">
              <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors">
                <div className="relative h-32 md:h-40">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name[language]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium text-foreground text-sm md:text-base">{category.name[language]}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
