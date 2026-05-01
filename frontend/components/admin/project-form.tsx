"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X } from "lucide-react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { getImageUrl } from "@/lib/utils"
import type { AdminItemDto } from "@/lib/admin-items"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Alliance = {
  id: string
  name: string
}

type ProductOption = {
  id: string
  name: string
  imageUrl: string
  sku: string
}

export type AdminProject = {
  id: string
  name: string
  description: string
  allianceId: string
  mainImage: string
  imageUrls: string[]
  productIds: string[]
}

interface ProjectFormProps {
  mode: "create" | "edit"
  project?: AdminProject
}

const emptyProject: AdminProject = {
  id: "",
  name: "",
  description: "",
  allianceId: "",
  mainImage: "",
  imageUrls: [],
  productIds: [],
}

const normalizeProject = (project?: AdminProject): AdminProject => ({
  ...emptyProject,
  ...project,
  imageUrls: Array.from(
    new Set(
      [project?.mainImage ?? "", ...(project?.imageUrls ?? [])]
        .map((url) => url.trim())
        .filter(Boolean)
    )
  ),
  productIds: Array.from(new Set((project?.productIds ?? []).map((id) => id.trim()).filter(Boolean))),
})

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter()
  const [alliances, setAlliances] = useState<Alliance[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [formData, setFormData] = useState<AdminProject>(normalizeProject(project))

  useEffect(() => {
    setFormData(normalizeProject(project))
  }, [project])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [alliancesData, productsData] = await Promise.all([
          ApiClient.get<any[]>("api/admin/Alliance"),
          ApiClient.get<AdminItemDto[]>("api/admin/Item"),
        ])

        const normalizedAlliances = Array.isArray(alliancesData)
          ? alliancesData.map((alliance) => ({
              id: String(alliance.id ?? alliance.Id ?? ""),
              name: String(alliance.name ?? alliance.Name ?? ""),
            }))
          : []

        const normalizedProducts = Array.isArray(productsData)
          ? productsData.map((product) => ({
              id: String(product.id ?? ""),
              name: String(product.nameEn ?? product.nameAr ?? ""),
              imageUrl: String(product.mainImage ?? product.images?.[0]?.imageUrl ?? ""),
              sku: String(product.sku ?? ""),
            }))
          : []

        setAlliances(normalizedAlliances)
        setProducts(normalizedProducts.filter((item) => item.id && item.name))
      } catch (err) {
        console.error("Failed to fetch project data:", err)
        setAlliances([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()
    if (!query) return products

    return products.filter((item) => (
      item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query)
    ))
  }, [products, productSearch])

  const handleChange = (field: "name" | "description" | "allianceId", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of Array.from(files)) {
        const uploadRes = await ApiClient.upload("api/Upload", file)
        const url = uploadRes?.url || uploadRes?.imageUrl || uploadRes
        if (url) uploadedUrls.push(url)
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          mainImage: prev.mainImage || uploadedUrls[0] || "",
          imageUrls: Array.from(new Set([...prev.imageUrls, ...uploadedUrls])),
        }))
      }
    } catch (err) {
      console.error("Failed to upload project images:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleProductSelection = (productId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      productIds: checked
        ? Array.from(new Set([...prev.productIds, productId]))
        : prev.productIds.filter((id) => id !== productId),
    }))
  }

  const removeImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: prev.mainImage === imageUrl ? prev.imageUrls.filter((url) => url !== imageUrl)[0] || "" : prev.mainImage,
      imageUrls: prev.imageUrls.filter((url) => url !== imageUrl),
    }))
  }

  const setMainImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: imageUrl,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.allianceId) {
        alert("Please select an alliance")
        return
      }

      if (!formData.mainImage) {
        alert("Please select a main image")
        return
      }

      const payload = {
        id: formData.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        allianceId: formData.allianceId,
        mainImage: formData.mainImage,
        imageUrls: formData.imageUrls,
        productIds: formData.productIds,
      }

      const result = mode === "create"
        ? await ApiClient.post("api/admin/Projects/add-project", payload)
        : await ApiClient.post(`api/admin/Projects/edit-project/${formData.id}`, payload)

      if (result === false) {
        alert("Failed to save project.")
        return
      }

      router.push("/admin/projects")
    } catch (err) {
      console.error("Failed to save project:", err)
      alert("Failed to save project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#8f3f2a]/15 bg-white/85 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-[#d66a49]/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-[#c7aea2]/26 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-[#8f3f2a] hover:bg-[#f7ebe4]">
              <Link href="/admin/projects">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7d73]">Projects</p>
              <h1 className="admin-title text-2xl font-bold">
                {mode === "create" ? "Create Project" : "Edit Project"}
              </h1>
              <p className="admin-subtitle mt-1 text-sm">
                {mode === "create"
                  ? "Add project details, images, alliance, and linked products"
                  : "Update project details, gallery, alliance, and linked products"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              type="button"
              asChild
              className="h-11 rounded-xl border-[#8f3f2a]/20 text-[#6f6157] hover:bg-[#f7ebe4]"
            >
              <Link href="/admin/projects">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="h-11 rounded-xl border-0 bg-gradient-to-r from-[#8f3f2a] to-[#c16043] px-6 font-semibold text-white"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-[#4b3d34]">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter project name"
                  className="admin-input h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-[#4b3d34]">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Write a detailed project description"
                  className="admin-input min-h-32"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Project Images</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                id="project-images-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleUploadImages(e.target.files)
                  e.target.value = ""
                }}
              />

              <div className="grid gap-4 sm:grid-cols-4">
                {formData.imageUrls.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-[#8f3f2a]/10 bg-[#f4ebe4]">
                    <Image src={getImageUrl(image)} alt={`Project ${index + 1}`} fill className="object-cover" />
                    {image === formData.mainImage && (
                      <span className="absolute left-2 top-2 rounded-md bg-[#8f3f2a] px-2 py-0.5 text-xs font-medium text-white">
                        Main
                      </span>
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      {image !== formData.mainImage && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 bg-white/90 px-2 text-xs"
                          onClick={() => setMainImage(image)}
                        >
                          Set Main
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeImage(image)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <label
                  htmlFor="project-images-upload"
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#8f3f2a]/28 bg-[#fffaf7] transition-colors hover:bg-[#fff2ea]"
                >
                  <Upload className="h-8 w-8 text-[#8f3f2a]" />
                  <span className="text-sm font-medium text-[#7c6f65]">{isUploading ? "Uploading..." : "Upload"}</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productSearch" className="text-sm font-semibold text-[#4b3d34]">Search Products</Label>
                <Input
                  id="productSearch"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by product name or SKU"
                  className="admin-input h-11"
                />
              </div>

              <div className="rounded-2xl border border-[#8f3f2a]/10 bg-[#fffaf7] p-4">
                <div className="mb-3 text-sm text-[#7c6f65]">
                  Selected products: <span className="font-semibold text-[#8f3f2a]">{formData.productIds.length}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredProducts.map((item) => {
                    const checked = formData.productIds.includes(item.id)
                    return (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#8f3f2a]/10 bg-white p-3 hover:bg-[#fcf6f1]"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => toggleProductSelection(item.id, value === true)}
                        />
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {item.imageUrl ? (
                            <Image src={getImageUrl(item.imageUrl)} alt={item.name} fill className="object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#2f2219]">{item.name}</p>
                          <p className="truncate text-xs text-[#8b7d73]">{item.sku || "No SKU"}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                {!loading && filteredProducts.length === 0 && (
                  <div className="py-8 text-center text-sm text-[#8b7d73]">No products found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alliance" className="text-sm font-semibold text-[#4b3d34]">Alliance</Label>
                <Select value={formData.allianceId} onValueChange={(value) => handleChange("allianceId", value)}>
                  <SelectTrigger className="admin-input h-11">
                    <SelectValue placeholder="Select alliance" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#8f3f2a]/15 bg-white shadow-xl">
                    {alliances.map((alliance) => (
                      <SelectItem key={alliance.id} value={alliance.id}>
                        {alliance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
