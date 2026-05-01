"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRightIcon } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

type Alliance = {
  id: string
  name: string
  imageUrl?: string
}

type Project = {
  id: string
  name: string
  description: string
  mainImage: string
  imageUrls: string[]
}

const normalizeImageUrl = (value: unknown) => {
  const normalized = String(value ?? "").trim()
  return normalized && normalized.toLowerCase() !== "string" ? normalized : ""
}

export default function AllianceProjectsPage() {
  const params = useParams()
  const allianceId = params.allianceId as string
  const [alliance, setAlliance] = useState<Alliance | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!allianceId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [alliancesData, projectsData] = await Promise.all([
          ApiClient.get<any[]>("api/Alliances"),
          ApiClient.get<any[]>(`api/Project/by-alliance/${allianceId}`),
        ])

        const foundAlliance = Array.isArray(alliancesData)
          ? alliancesData.find((item) => String(item.id ?? item.Id ?? "") === allianceId)
          : null

        setAlliance(foundAlliance ? {
          id: String(foundAlliance.id ?? foundAlliance.Id ?? ""),
          name: String(foundAlliance.name ?? foundAlliance.Name ?? ""),
          imageUrl: normalizeImageUrl(foundAlliance.imageUrl ?? foundAlliance.ImageUrl),
        } : null)

        const normalizedProjects = Array.isArray(projectsData)
          ? projectsData.map((project) => ({
            id: String(project.id ?? project.Id ?? ""),
            name: String(project.name ?? project.Name ?? ""),
            description: String(project.description ?? project.Description ?? ""),
            mainImage: normalizeImageUrl(project.mainImage ?? project.MainImage),
            imageUrls: Array.isArray(project.images ?? project.Images)
              ? (project.images ?? project.Images).map((img: any) => normalizeImageUrl(img.imageUrl ?? img.ImageUrl)).filter(Boolean)
              : [],
          }))
          : []

        setProjects(normalizedProjects.filter((project) => project.id && project.name))
      } catch (err) {
        console.error("Failed to fetch alliance projects:", err)
        setAlliance(null)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [allianceId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <h1 className="text-2xl font-serif text-mahogany">Loading...</h1>
      </div>
    )
  }

  if (!alliance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
        <h1 className="text-2xl font-serif text-mahogany">Alliance Not Found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex items-center gap-2 text-[10px] tracking-widest font-bold text-taupe uppercase">
            <Link href="/alliances" className="hover:text-mahogany transition-colors">WE ARE PART OF</Link>
            <span>/</span>
            <span className="text-mahogany">{alliance.name}</span>
          </div>

          <div className="mb-20">
            <h1 className="text-5xl md:text-7xl font-serif text-mahogany mb-6">{alliance.name}</h1>
            <p className="text-base text-mahogany/70 max-w-2xl leading-relaxed">
              Explore featured projects created under this alliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] mb-6">
                    <div className="absolute inset-0 bg-mahogany/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={project.mainImage || project.imageUrls[0] || "/placeholder.jpg"}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute bottom-6 left-6 z-20">
                      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4">
                        <span className="text-[10px] tracking-[0.2em] font-bold text-white uppercase block mb-1">
                          Alliance Project
                        </span>
                        <h3 className="text-2xl font-serif text-white">{project.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] font-bold text-taupe uppercase">Project</span>
                      <p className="text-xs text-mahogany/60 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-mahogany/20 flex items-center justify-center group-hover:bg-mahogany group-hover:border-mahogany transition-all duration-300">
                      <ArrowRightIcon className="w-4 h-4 text-mahogany group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-mahogany/20 rounded-[2rem]">
                <p className="text-taupe uppercase tracking-widest font-bold">No projects featured yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
