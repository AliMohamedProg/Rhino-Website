import { getPublicSliders, getPublicCategories, getPublicProducts, getPublicBestSellers } from "@/lib/products"
import { HomeClient } from "@/components/home/home-client"

export default async function HomePage() {
  // Fetch everything on the server for instant rendering
  const [initialSliders, initialCategories, initialBestSellers, initialProducts] = await Promise.all([
    getPublicSliders(),
    getPublicCategories(),
    getPublicBestSellers(),
    getPublicProducts()
  ])

  return (
    <HomeClient 
      initialSliders={initialSliders} 
      initialCategories={initialCategories}
      initialBestSellers={initialBestSellers}
      initialProducts={initialProducts}
    />
  )
}

