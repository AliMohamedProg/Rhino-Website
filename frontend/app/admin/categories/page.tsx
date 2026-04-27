"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  const [formData, setFormData] = useState({ nameEn: "", nameAr: "", imageUrl: "" })

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c))
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        ...formData
      }
      setCategories([...categories, newCat])
    }
    setDialogOpen(false)
  }

  const columns = [
    { key: "image", header: "Image", render: (cat: Category) => (
      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
        {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.nameEn} className="h-full w-full object-cover" /> : <LayoutGrid className="h-4 w-4 text-slate-300" />}
      </div>
    )},
    { key: "nameEn", header: "Name (EN)", render: (cat: Category) => <span className="font-medium text-slate-900">{cat.nameEn}</span> },
    { key: "nameAr", header: "Name (AR)", render: (cat: Category) => <span className="text-slate-500">{cat.nameAr}</span> },
    { key: "actions", header: "Actions", render: (cat: Category) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl">
          <DropdownMenuItem onClick={() => { setEditingCategory(cat); setFormData({ nameEn: cat.nameEn, nameAr: cat.nameAr, imageUrl: cat.imageUrl || "" }); setDialogOpen(true) }} className="hover:bg-[#f6eee8] cursor-pointer">
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
        
        <Button onClick={() => { setEditingCategory(null); setFormData({ nameEn: "", nameAr: "", imageUrl: "" }); setDialogOpen(true) }} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-lg font-bold transition-all px-5 border-0">
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
              <Label htmlFor="nameEn">English Name</Label>
              <Input id="nameEn" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Arabic Name</Label>
              <Input id="nameAr" value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="bg-[#7B3F32] text-white rounded-xl">Save Category</Button>
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
