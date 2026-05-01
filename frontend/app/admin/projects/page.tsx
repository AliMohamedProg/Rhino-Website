"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Plus, Trash2, FolderKanban, Pencil } from "lucide-react"
import Link from "next/link"

type Alliance = {
  id: string
  name: string
}

type ProjectRow = {
  id: string
  name: string
  description: string
  allianceId: string
  imageUrl: string
  productCount: number
  createdDate: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [alliances, setAlliances] = useState<Alliance[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectRow | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [projectsData, alliancesData] = await Promise.all([
        ApiClient.get<any[]>("api/admin/Projects"),
        ApiClient.get<any[]>("api/admin/Alliance"),
      ])

      const normalizedProjects = Array.isArray(projectsData)
        ? projectsData.map((project) => ({
            id: String(project.id ?? project.Id ?? ""),
            name: String(project.name ?? project.Name ?? ""),
            description: String(project.description ?? project.Description ?? ""),
            allianceId: String(project.allianceId ?? project.AllianceId ?? ""),
            imageUrl: String(
              project.mainImage ??
              project.MainImage ??
              project.images?.[0]?.imageUrl ??
              project.Images?.[0]?.ImageUrl ??
              ""
            ),
            productCount: Array.isArray(project.products ?? project.Products)
              ? (project.products ?? project.Products).length
              : 0,
            createdDate: String(project.createdDate ?? project.CreatedDate ?? ""),
          }))
        : []

      const normalizedAlliances = Array.isArray(alliancesData)
        ? alliancesData.map((alliance) => ({
            id: String(alliance.id ?? alliance.Id ?? ""),
            name: String(alliance.name ?? alliance.Name ?? ""),
          }))
        : []

      setProjects(normalizedProjects)
      setAlliances(normalizedAlliances)
    } catch (err) {
      console.error("Failed to fetch projects:", err)
      setProjects([])
      setAlliances([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const allianceNameById = useMemo(
    () => new Map(alliances.map((alliance) => [alliance.id, alliance.name])),
    [alliances]
  )

  const confirmDelete = async () => {
    if (!projectToDelete) return
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Projects/delete-project/${projectToDelete.id}`, {})
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
      await fetchData()
    } catch (err) {
      console.error("Failed to delete project:", err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (project: ProjectRow) => (
        <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.name} className="h-full w-full object-cover" />
          ) : (
            <FolderKanban className="h-4 w-4 text-slate-300" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Project Name",
      render: (project: ProjectRow) => <span className="font-bold text-[#3a2c26]">{project.name}</span>,
    },
    {
      key: "alliance",
      header: "Alliance",
      render: (project: ProjectRow) => (
        <span className="text-slate-600">{allianceNameById.get(project.allianceId) || "Unknown"}</span>
      ),
    },
    {
      key: "products",
      header: "Products",
      render: (project: ProjectRow) => <span className="text-slate-600">{project.productCount}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (project: ProjectRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/admin/projects/${project.id}/edit`} className="flex items-center">
                <Pencil className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setProjectToDelete(project)
                setDeleteDialogOpen(true)
              }}
              className="hover:bg-red-50 text-red-600 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Projects</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage alliance projects</p>
        </div>

        <Button asChild className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0">
          <Link href="/admin/projects/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4 shrink-0" />
            Add Project
          </Link>
        </Button>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading projects...</div>
          ) : (
            <DataTable data={projects} columns={columns} searchPlaceholder="Search projects..." searchKey="name" />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">
              Are you sure you want to delete <span className="font-semibold text-[#7B3F32]">"{projectToDelete?.name}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-500/20">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
