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
     titleEn: "",
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
     setFormData({ titleEn: "", imageUrl: "" })
     setSelectedFile(null)
     setAddDialogOpen(true)
   }

   const handleEdit = (slider: Slider) => {
     setEditingSlider(slider)
     setFormData({
       titleEn: slider.titleEn,
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
         titleAr: "",
         titleEn: formData.titleEn,
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
         titleAr: "",
         titleEn: formData.titleEn,
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

   const isFormValid = () => formData.titleEn.trim()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sliders</h1>
          <p className="text-slate-500">Manage {sliders.length} sliders</p>
        </div>
        <div className="flex items-center gap-2">
          {sliders.length > 0 && (
            <Button variant="destructive" className={"bg-red-700 "} onClick={() => setDeleteAllDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2 text-white" />
              Delete All
            </Button>
          )}
          <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Slider
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
            <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Slider
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sliders.map((slider) => (
            <Card key={slider.id} className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <div className="relative aspect-video bg-slate-100">
                {slider.imageUrl ? (
                  <Image src={getImageUrl(slider.imageUrl)} alt={slider.titleEn} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900">{slider.titleEn}</h3>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Slider</DialogTitle>
            <DialogDescription>Add a new slider to the homepage</DialogDescription>
          </DialogHeader>
           <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label htmlFor="titleEn">Title</Label>
               <Input id="titleEn" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} placeholder="Enter title" />
             </div>
             <div className="space-y-2">
               <Label>Image</Label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Choose Image
                </Button>
                {selectedFile && <span className="text-sm text-slate-500">{selectedFile.name}</span>}
              </div>
              {formData.imageUrl && (
                <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border">
                  <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitAdd} disabled={!isFormValid() || uploading} className="bg-indigo-600 hover:bg-indigo-700">
              {uploading ? "Saving..." : "Add Slider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Slider</DialogTitle>
            <DialogDescription>Edit slider details below</DialogDescription>
          </DialogHeader>
           <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label htmlFor="editTitleEn">Title</Label>
               <Input id="editTitleEn" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} placeholder="Enter title" />
             </div>
             <div className="space-y-2">
               <Label>Image</Label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Change Image
                </Button>
              </div>
              {formData.imageUrl && (
                <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border">
                  <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEdit} disabled={!isFormValid() || uploading} className="bg-indigo-600 hover:bg-indigo-700">
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slider</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{sliderToDelete?.titleEn}"? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Sliders</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete all sliders? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} className="bg-red-600 hover:bg-red-700">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}