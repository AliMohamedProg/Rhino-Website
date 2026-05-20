import { 
  getPublicSliders, 
  getPublicCategories, 
  getPublicStyles, 
  getPublicProducts, 
  getPublicBestSellers,
  getPublicCollections 
} from "@/lib/products"
import { HomeClient } from "@/components/home/home-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  // Fetch everything on the server for instant rendering
  const [initialSliders, initialCategories, initialStyles, initialBestSellers, initialProducts, initialCollections] = await Promise.all([
    getPublicSliders(),
    getPublicCategories(),
    getPublicStyles(),
    getPublicBestSellers(),
    getPublicProducts(),
    getPublicCollections()
  ])

  return (
    <HomeClient 
      initialSliders={initialSliders} 
      initialCategories={initialCategories}
      initialStyles={initialStyles}
      initialBestSellers={initialBestSellers}
      initialProducts={initialProducts}
      initialCollections={initialCollections}
    />
  )
}

