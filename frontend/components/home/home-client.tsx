"use client"

import { Suspense } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { DiscoverByStyle } from "@/components/home/DiscoverByStyle"
import { NewCollections } from "@/components/home/NewCollection"
import { BestSellers } from "@/components/home/BestSellers"
import { OurStory } from "@/components/home/OurStory"
import type { PublicSlider, PublicCategory, PublicProduct } from "@/lib/products"

interface HomeClientProps {
  initialSliders: PublicSlider[]
  initialCategories: PublicCategory[]
  initialBestSellers: PublicProduct[]
  initialProducts: PublicProduct[]
}

export function HomeClient({
  initialSliders,
  initialCategories,
  initialBestSellers,
  initialProducts
}: HomeClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero initialSliders={initialSliders} />
        <DiscoverByStyle initialCategories={initialCategories} />
        <NewCollections initialProducts={initialProducts} />
        <BestSellers initialBestSellers={initialBestSellers} />
        <OurStory />
      </main>
      <Footer />
    </div>
  )
}

