"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { DataTable } from "@/components/admin/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Pencil, Trash2, LayoutGrid } from "lucide-react"
import { MOCK_CATEGORIES, type Category } from "@/lib/mock-admin-data"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ nameEn: "" })
  const [imageUrl, setImageUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (editingCategory) {
      setFormData({ nameEn: editingCategory.nameEn })
      setImageUrl(editingCategory.imageUrl || "")
    } else if (dialogOpen) {
      setFormData({ nameEn: "" })
      setImageUrl("")
      setSelectedFile(null)
    }
  }, [editingCategory, dialogOpen])

  const handleSave = async () => {
    try {
      setLoading(true)
      let finalImageUrl = imageUrl

      if (selectedFile) {
        const uploadRes = await ApiClient.upload("api/upload", selectedFile)
        finalImageUrl = uploadRes.url || uploadRes.imageUrl || uploadRes
      }

      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, nameEn: formData.nameEn, imageUrl: finalImageUrl } : c))
      } else {
        const newCat: Category = {
          id: `cat-${Date.now()}`,
          nameEn: formData.nameEn,
          imageUrl: finalImageUrl
        }
        setCategories([...categories, newCat])
      }
      setDialogOpen(false)
    } catch (err) {
      console.error("Failed to save category:", err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: "image", header: "Image", render: (cat: Category) => (
      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
        {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.nameEn} className="h-full w-full object-cover" /> : <LayoutGrid className="h-4 w-4 text-slate-300" />}
      </div>
    )},
    { key: "nameEn", header: "Category Name", render: (cat: Category) => <span className="font-bold text-[#3a2c26]">{cat.nameEn}</span> },
    { key: "actions", header: "Actions", render: (cat: Category) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl">
          <DropdownMenuItem onClick={() => { setEditingCategory(cat); setFormData({ nameEn: cat.nameEn }); setImageUrl(cat.imageUrl || ""); setDialogOpen(true) }} className="hover:bg-[#f6eee8] cursor-pointer">
            <Pencil className="h-4 w-4 mr-2 text-[#7B3F32]" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setCategoryToDelete(cat); setDeleteDialogOpen(true) }} className="hover:bg-red-50 text-red-600 cursor-pointer">
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ), className: "w-[70px]" }
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Categories</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage high-level product categories</p>
        </div>
        
        <Button onClick={() => { setEditingCategory(null); setFormData({ nameEn: "" }); setImageUrl(""); setSelectedFile(null); setDialogOpen(true) }} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-lg font-bold transition-all px-5 border-0">
          <Plus className="h-4 w-4 mr-2" />Add Category
        </Button>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
        <CardContent className="pt-6">
          <DataTable data={categories} columns={columns} searchPlaceholder="Search categories..." searchKey="nameEn" />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl border-[#7B3F32]/10 shadow-2xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2f2219]">{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription className="text-[#8b7d73]">Enter the category details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="nameEn" className="text-sm font-semibold text-[#4b3d34]">Category Name</Label>
              <Input id="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#4b3d34]">Category Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) setSelectedFile(file) }} className="border-[#7B3F32]/20 file:bg-[#f6eee8] file:text-[#7B3F32] file:border-0 file:rounded-xl file:px-4 file:font-semibold rounded-xl bg-white/50 cursor-pointer pt-2" />
              {selectedFile ? (
                <div className="mt-4 h-32 w-full rounded-2xl overflow-hidden border border-[#7B3F32]/10 bg-[#f8f0e7] shadow-sm"><img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" /></div>
              ) : imageUrl && (
                <div className="mt-4 h-32 w-full rounded-2xl overflow-hidden border border-[#7B3F32]/10 bg-[#f8f0e7] shadow-sm"><img src={imageUrl} alt="Current" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop" }} /></div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-sm font-semibold text-[#4b3d34]">Or Image URL</Label>
              <Input id="imageUrl" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-12 font-medium">Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-xl h-12 font-bold shadow-[0_8px_20px_rgba(123,63,50,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]">{loading ? "Saving..." : "Save Category"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This will remove the category from the list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setCategories(categories.filter(c => c.id !== categoryToDelete?.id)); setDeleteDialogOpen(false) }} className="bg-red-600 text-white rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
