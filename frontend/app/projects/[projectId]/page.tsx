"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingBagIcon } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

type ProjectProduct = {
  id: string
  name: string
  image: string
}

type Project = {
  id: string
  name: string
  description: string
  allianceId: string
  mainImage: string
  images: string[]
  products: ProjectProduct[]
}

const normalizeImageUrl = (value: unknown) => {
  const normalized = String(value ?? "").trim()
  return normalized && normalized.toLowerCase() !== "string" ? normalized : ""
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return

    const fetchProject = async () => {
      try {
        setLoading(true)
        const data = await ApiClient.get<any>(`api/Project/${projectId}`)
        const normalized: Project = {
          id: String(data.id ?? data.Id ?? ""),
          name: String(data.name ?? data.Name ?? ""),
          description: String(data.description ?? data.Description ?? ""),
          allianceId: String(data.allianceId ?? data.AllianceId ?? ""),
          mainImage: normalizeImageUrl(data.mainImage ?? data.MainImage),
          images: Array.isArray(data.images ?? data.Images)
            ? (data.images ?? data.Images).map((img: any) => normalizeImageUrl(img.imageUrl ?? img.ImageUrl)).filter(Boolean)
            : [],
          products: Array.isArray(data.products ?? data.Products)
            ? (data.products ?? data.Products).map((item: any) => ({
              id: String(item.id ?? item.Id ?? ""),
              name: String(item.nameEn ?? item.NameEn ?? item.nameAr ?? item.NameAr ?? ""),
              image: normalizeImageUrl(item.mainImage ?? item.MainImage ?? item.images?.[0]?.imageUrl ?? item.Images?.[0]?.ImageUrl),
            }))
            : [],
        }

        setProject(normalized)
      } catch (err) {
        console.error("Failed to fetch project:", err)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <h1 className="text-2xl font-serif text-mahogany">Loading...</h1>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <h1 className="text-2xl font-serif text-mahogany">Project Not Found</h1>
      </div>
    )
  }

  const allImages = [project.mainImage, ...project.images].filter(Boolean)
  const uniqueImages = [...new Set(allImages)]
  const secondaryImages = uniqueImages.slice(1, 3)
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] tracking-[0.3em] font-bold text-taupe uppercase mb-4 block">
                Alliance Project
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-mahogany uppercase tracking-tight">
                {project.name}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div className="md:col-span-2 aspect-[4/3] rounded-[2rem] overflow-hidden relative group">
              <img
                src={project.mainImage || project.images[0] || "/placeholder.jpg"}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 text-white/60 text-[8px] tracking-[0.2em] font-bold uppercase">
                Main Image
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {secondaryImages.length > 0 ? secondaryImages.map((img, idx) => (
                <div key={idx} className="flex-1 rounded-[2rem] overflow-hidden relative group">
                  <img
                    src={img}
                    alt={`${project.name} detail ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
              )) : (
                <div className="flex-1 rounded-[2rem] border border-dashed border-mahogany/20 flex items-center justify-center text-taupe uppercase tracking-widest text-xs">
                  No more images
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-serif text-mahogany italic leading-snug">
                Project Overview
              </h2>
              <div className="w-12 h-0.5 bg-mahogany/20 mt-6" />
            </div>
            <div className="md:col-span-8">
              <div className="space-y-6 text-mahogany/80 leading-relaxed max-w-2xl">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-12 border-b border-mahogany/10 pb-8">
              <h2 className="text-3xl font-serif text-mahogany">Items We Use</h2>
              <Link href="/products" className="text-[10px] tracking-[0.2em] font-bold text-taupe uppercase border-b border-taupe/30 pb-1 hover:text-mahogany hover:border-mahogany transition-all">
                View Full Collection
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {project.products.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-mahogany text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ShoppingBagIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-mahogany uppercase tracking-wider mb-1">{item.name}</h4>
                    <p className="text-[10px] text-taupe italic">Project Selection</p>
                  </div>
                </div>
              ))}
            </div>
            {project.products.length === 0 && (
              <div className="py-10 text-center border border-dashed border-mahogany/20 rounded-[2rem]">
                <p className="text-taupe uppercase tracking-widest font-bold">No products linked yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
