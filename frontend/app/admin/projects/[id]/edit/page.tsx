"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { ProjectForm, type AdminProject } from "@/components/admin/project-form"

const normalizeProject = (project: any): AdminProject => ({
  id: String(project.id ?? project.Id ?? ""),
  name: String(project.name ?? project.Name ?? ""),
  description: String(project.description ?? project.Description ?? ""),
  allianceId: String(project.allianceId ?? project.AllianceId ?? ""),
  mainImage: String(
    project.mainImage ??
    project.MainImage ??
    project.images?.[0]?.imageUrl ??
    project.Images?.[0]?.ImageUrl ??
    ""
  ),
  imageUrls: Array.from(new Set(
    [
      project.mainImage ?? project.MainImage ?? "",
      ...(Array.isArray(project.images ?? project.Images)
        ? (project.images ?? project.Images).map((image: any) => String(image.imageUrl ?? image.ImageUrl ?? ""))
        : []),
    ].map((value) => value.trim()).filter(Boolean)
  )),
  productIds: Array.isArray(project.products ?? project.Products)
    ? (project.products ?? project.Products)
        .map((item: any) => String(item.id ?? item.Id ?? item.itemId ?? item.ItemId ?? ""))
        .filter(Boolean)
    : [],
})

export default function EditProjectPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<AdminProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const projects = await ApiClient.get<any[]>("api/admin/Projects")
        const found = Array.isArray(projects)
          ? projects.find((item) => String(item.id ?? item.Id ?? "") === id)
          : null

        setProject(found ? normalizeProject(found) : null)
      } catch (err) {
        console.error("Failed to fetch project:", err)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
        Loading...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Project not found</h2>
      </div>
    )
  }

  return <ProjectForm mode="edit" project={project} />
}
