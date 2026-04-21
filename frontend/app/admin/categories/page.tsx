"use client"

import { useState, useEffect } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"
import { type Category } from "@/lib/admin-data"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Download } from "lucide-react"
import { exportCategoriesExcel, exportCategoriesPdf } from "@/app/ApiHelper/ExportApi"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
   const [formData, setFormData] = useState({ nameEn: "", description: "" })
  const [imageUrl, setImageUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

   useEffect(() => {
     if (editingCategory) {
       setFormData({ nameEn: editingCategory.nameEn, description: "" })
       setImageUrl(editingCategory.imageUrl || "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop")
     } else if (dialogOpen) {
       setFormData({ nameEn: "", description: "" })
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
        finalImageUrl = uploadRes.url
      }
       if (editingCategory) {
         await ApiClient.post("api/admin/Categories/edit-category", { id: editingCategory.id, nameEn: formData.nameEn, nameAr: "", imageUrl: finalImageUrl, currentState: 1 })
       } else {
         await ApiClient.post("api/admin/Categories/add-category", { nameEn: formData.nameEn, nameAr: "", imageUrl: finalImageUrl, currentState: 1 })
       }
      setDialogOpen(false)
      fetchCategories()
    } catch (err) { console.error("Failed to save category:", err) }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.get("api/admin/Categories")
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) { console.error("Failed to fetch categories:", err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleDelete = (category: Category) => { setCategoryToDelete(category); setDeleteDialogOpen(true) }

  const confirmDelete = async () => {
    if (!categoryToDelete) return
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Categories/delete-category/${categoryToDelete.id}`, {})
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      await fetchCategories()
    } catch (err: any) { console.error("Delete failed", err); alert("Delete failed: " + (err.message || "Unknown error")) }
    finally { setLoading(false) }
  }

  const confirmDeleteAll = async () => {
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Categories/delete-all-categories`, {})
      setDeleteAllDialogOpen(false)
      await fetchCategories()
    } catch (err: any) { console.error("Delete failed", err); alert("Delete failed: " + (err.message || "Unknown error")) }
    finally { setLoading(false) }
  }

  const columns = [
    { key: "image", header: "Image", render: (category: Category) => (
      <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
        {category.imageUrl ? <img src={category.imageUrl} alt={category.nameEn} className="h-full w-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop"}} /> : <span className="text-xs text-slate-400">No Img</span>}
      </div>
    )},
    { key: "nameEn", header: "Name (English)", render: (category: Category) => <span className="font-medium text-slate-900">{category.nameEn}</span> },
    { key: "createdDate", header: "Created", render: (category: Category) => <span className="text-slate-500">{new Date(category.createdDate).toLocaleDateString("en-US")}</span> },
    { key: "actions", header: "Actions", render: (category: Category) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#A6ACA2]/10">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl shadow-[#7B3F32]/10 border-[#7B3F32]/10">
          <DropdownMenuItem onClick={() => { setEditingCategory(category); setDialogOpen(true) }} className="hover:bg-[#f6eee8] cursor-pointer rounded-lg">
            <Pencil className="h-4 w-4 mr-2 text-[#7B3F32]" />
            <span className="text-[#3a2c26] font-medium">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(category)} className="hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg mt-1">
            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
            <span className="text-red-600 font-medium">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ), className: "w-[70px]" }
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />
        
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Categories</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage {categories.length} categories</p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          {categories.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteAllDialogOpen(true)} className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl shadow-none font-bold transition-all">
              <Trash2 className="h-4 w-4 mr-2" />Delete All
            </Button>
          )}
          <Button onClick={() => { setEditingCategory(null); setDialogOpen(true) }} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0">
            <Plus className="h-4 w-4 mr-2" />Add Category
          </Button>
        </div>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading categories...</div>
          ) : (
            <DataTable data={categories} columns={columns} searchPlaceholder="Search categories..." searchKey="nameEn" />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription className="text-slate-500">{editingCategory ? "Edit category details below." : "Add a new category to your store."}</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="space-y-2">
               <Label htmlFor="nameEn" className="text-slate-700">Name</Label>
               <Input id="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
             </div>
             <div className="space-y-2">
               <Label className="text-slate-700">Category Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) setSelectedFile(file) }} className="border-slate-200" />
              {selectedFile ? (
                <div className="mt-2 h-24 w-24 rounded-lg overflow-hidden border bg-slate-50"><img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" /></div>
              ) : imageUrl && (
                <div className="mt-2 h-24 w-24 rounded-lg overflow-hidden border bg-slate-50"><img src={imageUrl} alt="Current" className="h-full w-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop"}} /></div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-slate-700">Or Image URL</Label>
              <Input id="imageUrl" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-200 hover:bg-slate-50">Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">Are you sure you want to delete "{categoryToDelete?.nameEn}"? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Delete All Categories</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">Are you sure you want to delete all categories? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} className="bg-red-600 hover:bg-red-700">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}