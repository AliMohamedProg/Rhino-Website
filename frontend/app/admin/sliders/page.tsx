"use client"

import { useEffect, useState, useRef } from "react"
import { cn, getImageUrl } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Slider } from "@/lib/admin-data"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Pencil, Trash2, ImageIcon, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [sliderToDelete, setSliderToDelete] = useState<Slider | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.get("api/admin/Sliders")
      setSliders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch sliders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSliders()
  }, [])

  const handleAdd = () => {
    setFormData({ title: "", imageUrl: "" })
    setSelectedFile(null)
    setAddDialogOpen(true)
  }

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider)
    setFormData({
      title: slider.title,
      imageUrl: slider.imageUrl,
    })
    setSelectedFile(null)
    setEditDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, imageUrl: previewUrl })
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return null
    try {
      setUploading(true)
      const result = await ApiClient.upload("api/Upload", selectedFile)
      return result?.url || result?.imageUrl || result
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (slider: Slider) => {
    setSliderToDelete(slider)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!sliderToDelete) return
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Sliders/delete-slider/${sliderToDelete.id}`, {})
      setDeleteDialogOpen(false)
      setSliderToDelete(null)
      await fetchSliders()
    } catch (err) {
      console.error("Failed to delete slider:", err)
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteAll = async () => {
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Sliders/delete-all-sliders`, {})
      setDeleteAllDialogOpen(false)
      alert("All sliders deleted successfully")
      await fetchSliders()
    } catch (err: any) {
      console.error("Failed to delete all sliders:", err)
      alert("Delete failed: " + (err.message || JSON.stringify(err)))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAdd = async () => {
    try {
      setLoading(true)
      let imageUrl = ""
      if (selectedFile) {
        const uploadedUrl = await handleUpload()
        if (uploadedUrl) imageUrl = uploadedUrl
        else {
          alert("Image upload failed. Please try again.")
          return
        }
      } else {
        imageUrl = formData.imageUrl
      }
      if (imageUrl.startsWith("blob:")) {
        alert("Incomplete image processing. Please re-select the image.")
        return
      }
      if (!imageUrl) {
        alert("Image is required")
        return
      }
      await ApiClient.post("api/admin/Sliders/add-slider", {
        title: formData.title,
        imageUrl,
      })
      setAddDialogOpen(false)
      setSelectedFile(null)
      await fetchSliders()
    } catch (err) {
      console.error("Failed to add slider:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!editingSlider) return
    try {
      setLoading(true)
      let imageUrl = formData.imageUrl
      if (selectedFile) {
        const uploadedUrl = await handleUpload()
        if (uploadedUrl) imageUrl = uploadedUrl
        else {
          alert("Image upload failed. Please try again.")
          return
        }
      }
      if (imageUrl.startsWith("blob:")) {
        alert("Incomplete image processing. Please re-select the image.")
        return
      }
      if (!imageUrl) {
        alert("Image is required")
        return
      }
      await ApiClient.post("api/admin/Sliders/edit-slider", {
        id: editingSlider.id,
        title: formData.title,
        imageUrl,
      })
      setEditDialogOpen(false)
      setEditingSlider(null)
      setSelectedFile(null)
      await fetchSliders()
    } catch (err) {
      console.error("Failed to edit slider:", err)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => formData.title.trim()

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />

        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Sliders</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage {sliders.length} sliders</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {sliders.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteAllDialogOpen(true)} className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl shadow-none font-bold transition-all">
              <Trash2 className="h-4 w-4 mr-2" />Delete All
            </Button>
          )}
          <Button onClick={handleAdd} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0">
            <Plus className="h-4 w-4 mr-2" />Add Slider
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 text-slate-500">Loading...</div>
      ) : sliders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 mb-4">No sliders found</p>
            <Button onClick={handleAdd} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] hover:from-[#5f3026] hover:to-[#8e4f3f] text-white border-0 mt-2 font-bold rounded-xl shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Slider
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sliders.map((slider) => (
            <Card key={slider.id} className="overflow-hidden border-[#7B3F32]/10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm">
              <div className="relative aspect-video bg-slate-100">
                {slider.imageUrl ? (
                  <Image src={getImageUrl(slider.imageUrl)} alt={slider.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900">{slider.title}</h3>
                    <p className="text-sm text-slate-500">
                      {slider.createdDate ? new Date(slider.createdDate).toLocaleDateString("en-US") : "-"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(slider)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(slider)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Add New Slider</DialogTitle>
            <DialogDescription className="text-[#8b7d73] mt-1">Add a new slider to the homepage</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-[#4b3d34]">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#4b3d34]">Image</Label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="border-[#7B3F32]/20 text-[#7B3F32] hover:bg-[#f6eee8] rounded-xl h-11">
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Choose Image
                </Button>
                {selectedFile && <span className="text-sm font-medium text-[#8b7d73]">{selectedFile.name}</span>}
              </div>
              {formData.imageUrl && (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-[#7B3F32]/10 bg-[#f8f0e7] shadow-sm">
                  <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-12 font-medium">Cancel</Button>
            <Button onClick={handleSubmitAdd} disabled={!isFormValid() || uploading} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] border-0 rounded-xl h-12 font-bold shadow-[0_8px_20px_rgba(123,63,50,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]">
              {uploading ? "Saving..." : "Add Slider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Edit Slider</DialogTitle>
            <DialogDescription className="text-[#8b7d73] mt-1">Edit slider details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle" className="text-sm font-semibold text-[#4b3d34]">Title</Label>
              <Input id="editTitle" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#4b3d34]">Image</Label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="border-[#7B3F32]/20 text-[#7B3F32] hover:bg-[#f6eee8] rounded-xl h-11">
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Change Image
                </Button>
                {selectedFile && <span className="text-sm font-medium text-[#8b7d73]">{selectedFile.name}</span>}
              </div>
              {formData.imageUrl && (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-[#7B3F32]/10 bg-[#f8f0e7] shadow-sm">
                  <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-12 font-medium">Cancel</Button>
            <Button onClick={handleSubmitEdit} disabled={!isFormValid() || uploading} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] border-0 rounded-xl h-12 font-bold shadow-[0_8px_20px_rgba(123,63,50,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]">
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Delete Slider</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">Are you sure you want to delete <span className="font-semibold text-[#7B3F32]">"{sliderToDelete?.title}"</span>? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-500/20">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-red-600">Delete All Sliders</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">Are you sure you want to delete all sliders? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-600/30">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}