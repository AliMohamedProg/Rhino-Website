"use client"

import { useState, useEffect } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, MoreHorizontal, Pencil, Trash2, Download } from "lucide-react"
import { ar } from "date-fns/locale"
import { exportCategoriesExcel, exportCategoriesPdf } from "@/app/ApiHelper/ExportApi"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nameEn: "",
    imageUrl: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        nameEn: editingCategory.nameEn,
        imageUrl: editingCategory.imageUrl || "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop",
      })
    } else if (dialogOpen) {
      setFormData({
        nameEn: "",
        imageUrl: "",
      })
      setSelectedFile(null)
    }
  }, [editingCategory, dialogOpen])

  const handleSave = async () => {
    try {
      setLoading(true)

      let finalImageUrl = formData.imageUrl
      if (selectedFile) {
        const uploadRes = await ApiClient.upload("api/upload", selectedFile)
        finalImageUrl = uploadRes?.url || uploadRes?.imageUrl || uploadRes
      }

      if (editingCategory) {
        await ApiClient.post("api/admin/Categories/edit-category", {
          id: editingCategory.id,
          nameEn: formData.nameEn,
          nameAr: "", // Removed from form
          imageUrl: finalImageUrl,
          currentState: 1,
        })
      } else {
        await ApiClient.post("api/admin/Categories/add-category", {
          nameEn: formData.nameEn,
          nameAr: "", // Removed from form
          imageUrl: finalImageUrl,
          currentState: 1,
        })
      }
      setDialogOpen(false)
      fetchCategories()
    } catch (err) {
      console.error("Failed to save category:", err)
    } finally {
      setLoading(false)
    }
  }


  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.get("api/admin/Categories")
      setCategories(data)
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])



  const handleDelete = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) {
      return
    }

    try {
      setLoading(true)
      const url = `api/admin/Categories/delete-category/${categoryToDelete.id}`
      await ApiClient.post(url, {})
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      alert("Deleted successfully")
      await fetchCategories()
    } catch (err: any) {
      console.error("[Page] Critical: Delete API failed", err)
      const errorMsg = err.message || JSON.stringify(err)
      alert("Delete failed: " + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteAll = async () => {
    try {
      setLoading(true)
      const url = `api/admin/Categories/delete-all-categories`
      await ApiClient.post(url, {})
      setDeleteAllDialogOpen(false)
      alert("All categories deleted successfully")
      await fetchCategories()
    } catch (err: any) {
      console.error("[Page] Critical: Delete All API failed", err)
      const errorMsg = err.message || JSON.stringify(err)
      alert("Delete failed: " + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (category: Category) => (
        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.nameEn}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop"
              }}
            />
          ) : (
            <div className="text-[10px] text-muted-foreground">No Img</div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Category Name",
      render: (category: Category) => (
        <div>
          <p className="font-medium">
            {category.nameEn}
          </p>
        </div>
      ),
    },
    {
      key: "productsCount",
      header: "Products",
      render: (category: Category) => (
        <span className="font-medium">{category.productsCount}</span>
      ),
    },
    {
      key: "createdDate",
      header: "Created",
      render: (category: Category) => (
        <span className="text-muted-foreground">
          {new Date(category.createdDate).toLocaleDateString("en-US")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (category: Category) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingCategory(category)
                setDialogOpen(true)
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(category)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-muted-foreground">
            Manage {categories.length} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportCategoriesExcel()}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCategoriesPdf()}>
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {categories.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteAllDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          )}
          <Button onClick={() => { setEditingCategory(null); setDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              Loading categories...
            </div>
          ) : (
            <DataTable
              data={categories}
              columns={columns}
              searchPlaceholder="Search categories..."
              searchKey="nameEn"
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Edit category details"
                : "Add a new category to the store"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setSelectedFile(file)
                }}
              />
              {selectedFile ? (
                <div className="mt-2 h-24 w-24 rounded-md overflow-hidden border bg-muted">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : formData.imageUrl && (
                <div className="mt-2 h-24 w-24 rounded-md overflow-hidden border bg-muted">
                  <img
                    src={formData.imageUrl}
                    alt="Current"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop"
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Or Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{categoryToDelete?.nameEn}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete All Categories
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all categories? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

