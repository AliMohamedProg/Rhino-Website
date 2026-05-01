"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

type Project = {
  id: string
  name: string
  description: string
  mainImage: string
}

const normalizeImageUrl = (value: unknown) => {
  const normalized = String(value ?? "").trim()
  return normalized && normalized.toLowerCase() !== "string" ? normalized : ""
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const data = await ApiClient.get<any[]>("api/Project")
        const normalized = Array.isArray(data)
          ? data.map((project) => ({
              id: String(project.id ?? project.Id ?? ""),
              name: String(project.name ?? project.Name ?? ""),
              description: String(project.description ?? project.Description ?? ""),
              mainImage: normalizeImageUrl(project.mainImage ?? project.MainImage),
            }))
          : []
        setProjects(normalized.filter((project) => project.id && project.name))
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-[10px] tracking-[0.3em] font-bold text-mahogany uppercase mb-4 block">
              Projects
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-mahogany mb-8">
              Featured Projects
            </h1>
            <p className="text-sm md:text-base text-mahogany/70 max-w-2xl mx-auto leading-relaxed">
              Discover completed projects and the products used in each space.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-mahogany/60">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] mb-5">
                    <img
                      src={project.mainImage || "/placeholder.jpg"}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <h2 className="text-2xl font-serif text-mahogany mb-2">{project.name}</h2>
                  <p className="text-sm text-mahogany/70 line-clamp-3">{project.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-mahogany/20 rounded-[2rem]">
              <p className="text-taupe uppercase tracking-widest font-bold">No projects available.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
