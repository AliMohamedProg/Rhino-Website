"use client"

import { useEffect, useState, useRef } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const { t, language, dir } = useAdminLanguage()
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sliderToDelete, setSliderToDelete] = useState<Slider | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    imageUrl: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const { getSliders } = await import("@/lib/admin-data")
      const data = await getSliders()
      setSliders(data)
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
    setFormData({ titleAr: "", titleEn: "", imageUrl: "" })
    setSelectedFile(null)
    setAddDialogOpen(true)
  }

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider)
    setFormData({
      titleAr: slider.titleAr,
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
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, imageUrl: previewUrl })
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return null

    try {
      setUploading(true)
      const result = await ApiClient.upload("api/Image/upload", selectedFile)
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
      const { deleteSlider } = await import("@/lib/admin-data")
      await deleteSlider(sliderToDelete.id)
      setDeleteDialogOpen(false)
      setSliderToDelete(null)
      await fetchSliders()
    } catch (err) {
      console.error("Failed to delete slider:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAdd = async () => {
    try {
      setLoading(true)

      let imageUrl = formData.imageUrl

      // If a file was selected, upload it first
      if (selectedFile) {
        const uploadedUrl = await handleUpload()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      if (!imageUrl) {
        console.error("Image URL is required")
        return
      }

      const { addSlider } = await import("@/lib/admin-data")
      await addSlider({
        titleAr: formData.titleAr,
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

      // If a new file was selected, upload it first
      if (selectedFile) {
        const uploadedUrl = await handleUpload()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      if (!imageUrl) {
        console.error("Image URL is required")
        return
      }

      const { editSlider } = await import("@/lib/admin-data")
      await editSlider({
        id: editingSlider.id,
        titleAr: formData.titleAr,
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

  const isFormValid = () => {
    return formData.titleAr.trim() && formData.titleEn.trim() && (formData.imageUrl.trim() || selectedFile)
  }

  return (
    <div className={cn("space-y-6", dir === "rtl" && "font-arabic")}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "ar" ? "الشرائح" : "Sliders"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar"
              ? "إدارة شرائح الصفحة الرئيسية"
              : "Manage homepage sliders"}
          </p>
        </div>
        <Button onClick={handleAdd} className={dir === "rtl" ? "flex-row-reverse" : ""}>
          <Plus className="h-4 w-4 mr-2" />
          {language === "ar" ? "إضافة شريحة" : "Add Slider"}
        </Button>
      </div>

      {loading && !sliders.length ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        </div>
      ) : sliders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === "ar" ? "لا توجد شرائح" : "No sliders found"}
            </p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة شريحة الأولى" : "Add First Slider"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sliders.map((slider) => (
            <Card key={slider.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {slider.imageUrl ? (
                  <Image
                    src={slider.imageUrl}
                    alt={language === "ar" ? slider.titleAr : slider.titleEn}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {language === "ar" ? slider.titleAr : slider.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {slider.createdDate
                        ? new Date(slider.createdDate).toLocaleDateString(
                            language === "ar" ? "ar-EG" : "en-US"
                          )
                        : "-"}
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
                        {language === "ar" ? "تعديل" : "Edit"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(slider)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {language === "ar" ? "حذف" : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "ar" ? "إضافة شريحة جديدة" : "Add New Slider"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? "أضف شريحة جديدة للصفحة الرئيسية"
                : "Add a new slider to the homepage"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titleEn">
                {language === "ar" ? "العنوان بالإنجليزية" : "Title (English)"}
              </Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                placeholder="Enter title in English"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">
                {language === "ar" ? "العنوان بالعربية" : "Title (Arabic)"}
              </Label>
              <Input
                id="titleAr"
                value={formData.titleAr}
                onChange={(e) =>
                  setFormData({ ...formData, titleAr: e.target.value })
                }
                placeholder="أدخل العنوان بالعربية"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label>
                {language === "ar" ? "الصورة" : "Image"}
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {language === "ar" ? "اختر صورة" : "Choose Image"}
                </Button>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {formData.imageUrl && (
                <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleSubmitAdd} disabled={!isFormValid() || uploading}>
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {language === "ar" ? "إضافة" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "ar" ? "تعديل الشريحة" : "Edit Slider"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? "تعديل بيانات الشريحة"
                : "Update slider information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitleEn">
                {language === "ar" ? "العنوان بالإنجليزية" : "Title (English)"}
              </Label>
              <Input
                id="editTitleEn"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                placeholder="Enter title in English"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTitleAr">
                {language === "ar" ? "العنوان بالعربية" : "Title (Arabic)"}
              </Label>
              <Input
                id="editTitleAr"
                value={formData.titleAr}
                onChange={(e) =>
                  setFormData({ ...formData, titleAr: e.target.value })
                }
                placeholder="أدخل العنوان بالعربية"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label>
                {language === "ar" ? "الصورة" : "Image"}
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {language === "ar" ? "اختر صورة" : "Choose Image"}
                </Button>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {formData.imageUrl && (
                <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleSubmitEdit} disabled={!isFormValid() || uploading}>
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {language === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "ar" ? "حذف الشريحة" : "Delete Slider"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "ar"
                ? "هل أنت متأكد من حذف هذه الشريحة؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this slider? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "ar" ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
