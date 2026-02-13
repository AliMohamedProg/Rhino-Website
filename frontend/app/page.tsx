"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroBanner } from "@/components/home/hero-banner"
import { ProductCarousel } from "@/components/home/product-carousel"
import { CategoriesGrid } from "@/components/home/categories-grid"

/** Home page. Auth state is handled by AuthProvider (no duplicate /api/auth/me call). */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <ProductCarousel />
        <CategoriesGrid />
        <ProductCarousel />
      </main>
      <Footer />
    </div>
  )
}



