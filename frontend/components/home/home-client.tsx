"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroBanner } from "@/components/home/hero-banner"
import type { PublicSlider } from "@/lib/products"

// Lazy-load below-the-fold components
const ProductCarousel = dynamic(
  () => import("@/components/home/product-carousel").then(mod => ({ default: mod.ProductCarousel })),
  { ssr: false, loading: () => <div className="py-10 bg-background"><div className="container mx-auto px-4"><div className="h-[350px] bg-muted animate-pulse rounded-lg" /></div></div> }
)

const CategoriesGrid = dynamic(
  () => import("@/components/home/categories-grid").then(mod => ({ default: mod.CategoriesGrid })),
  { ssr: false, loading: () => <div className="py-10 bg-secondary"><div className="container mx-auto px-4"><div className="h-[200px] bg-muted animate-pulse rounded-lg" /></div></div> }
)

export function HomeClient({ initialSliders }: { initialSliders: PublicSlider[] }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner initialSliders={initialSliders} />
        <Suspense fallback={null}>
          <ProductCarousel />
        </Suspense>
        <Suspense fallback={null}>
          <CategoriesGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
