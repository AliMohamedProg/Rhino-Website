import { getPublicSliders } from "@/lib/products"
import { HomeClient } from "@/components/home/home-client"

export default async function HomePage() {
  // Fetch sliders on the server for instant rendering on reload
  const initialSliders = await getPublicSliders()

  return <HomeClient initialSliders={initialSliders} />
}
