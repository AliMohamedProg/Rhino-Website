"use client"

import { Suspense } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { DiscoverByStyle } from "@/components/home/DiscoverByStyle"
import { NewCollection } from "@/components/home/NewCollection"
import { BestSellers } from "@/components/home/BestSellers"
import { OurStory } from "@/components/home/OurStory"
import { ArtOfLiving } from "@/components/home/ArtOfLiving"
import type { PublicSlider, PublicCategory, PublicProduct } from "@/lib/products"

interface HomeClientProps {
  initialSliders: PublicSlider[]
  initialCategories: PublicCategory[]
  initialStyles: PublicCategory[]
  initialBestSellers: PublicProduct[]
  initialProducts: PublicProduct[]
  initialCollections: PublicProduct[]
}

export function HomeClient({
  initialSliders,
  initialCategories,
  initialStyles,
  initialBestSellers,
  initialProducts,
  initialCollections
}: HomeClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero initialSliders={initialSliders} />
        <DiscoverByStyle initialStyles={initialStyles} />
        <ArtOfLiving />
        <NewCollection initialProducts={initialCollections} />
        <BestSellers initialBestSellers={initialBestSellers} />
        <OurStory />
      </main>
      <Footer />
    </div>
  )
}

