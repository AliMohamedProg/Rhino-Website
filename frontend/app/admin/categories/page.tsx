"use client"

import { useState, useEffect } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/admin/data-table"
import { mockCategories, type Category } from "@/lib/admin-data"
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
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { ar } from "date-fns/locale"

export default function CategoriesPage() {
  const { t, language, dir } = useAdminLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    imageUrl: "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        nameEn: editingCategory.nameEn,
        nameAr: editingCategory.nameAr,
        imageUrl: editingCategory.imageUrl || "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop",
      })
    } else if (dialogOpen) {
      setFormData({
        nameEn: "",
        nameAr: "",
        imageUrl: "https://images.unsplash.com/photo-1538688543635-08193f037613?q=80&w=2670&auto=format&fit=crop",
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
        finalImageUrl = uploadRes.url
      }

      if (editingCategory) {
        await ApiClient.post("api/admin/Categories/edit-category", {
          id: editingCategory.id,
          nameEn: formData.nameEn,
          nameAr: formData.nameAr,
          imageUrl: finalImageUrl,
          currentState: 1,
        })
      } else {
        await ApiClient.post("api/admin/Categories/add-category", {
          nameEn: formData.nameEn,
          nameAr: formData.nameAr,
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

      // Debug: Fetch 'me' endpoint to see current user permissions
      const me = await ApiClient.get("api/auth/me")
      console.log("Current Auth State:", me)

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
      console.warn("[Page] confirmDelete called but categoryToDelete is null")
      return
    }

    // Loud debug for the user
    alert(`Starting delete for: ${categoryToDelete.nameEn}\nID: ${categoryToDelete.id}`)

    console.log("[Page] confirmDelete triggered for:", categoryToDelete)

    try {
      setLoading(true)
      const url = `api/admin/Categories/delete-category/${categoryToDelete.id}`
      console.log(`[Page] Calling POST ${url}`)

      const response = await ApiClient.post(url, {})
      console.log("[Page] Delete successful, response:", response)

      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      alert(language === "ar" ? "تم الحذف بنجاح" : "Deleted successfully")

      // Refresh the list from server
      await fetchCategories()
    } catch (err: any) {
      console.error("[Page] Critical: Delete API failed", err)
      const errorMsg = err.message || JSON.stringify(err)
      alert((language === "ar" ? "فشل الحذف: " : "Delete failed: ") + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "image",
      header: language === "ar" ? "الصورة" : "Image",
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
      header: language === "ar" ? "الاسم الفئة بالانجليزي" : "CategoryName in english",
      render: (category: Category) => (
        <div className={cn(dir === "rtl" && "text-right")}>
          <p className="font-medium">
            {category.nameEn}
          </p>
        </div>
      ),
    },
    {
      key: "name",
      header: language === "ar" ? "الاسم الفئة بالعربية" : "CategoryName in arabic",
      render: (category: Category) => (
        <div className={cn(dir === "rtl" && "text-right")}>
          <p className="font-medium">
            {category.nameAr}
          </p>
        </div>
      ),
    },
    {
      key: "products",
      header: t("categories.products"),
      render: (category: Category) => (
        <span className="font-medium">{category.productsCount}</span>
      ),
    },
    {
      key: "createdDate",
      header: language === "ar" ? "تاريخ الإنشاء" : "Created",
      render: (category: Category) => (
        <span className="text-muted-foreground">
          {new Date(category.createdDate).toLocaleDateString(
            language === "ar" ? "ar-EG" : "en-US"
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (category: Category) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
            <DropdownMenuItem
              onClick={() => {
                setEditingCategory(category)
                setDialogOpen(true)
              }}
            >
              <Pencil className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("categories.editCategory")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(category)}
            >
              <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("categories.deleteCategory")}
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
        className={cn(
          "flex items-center justify-between",
          dir === "rtl" && "flex-row-reverse"
        )}
      >
        <div className={cn(dir === "rtl" && "text-right")}>
          <h1 className="text-2xl font-bold tracking-tight">{t("categories.title")}</h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? `إدارة ${categories.length} فئة`
              : `Manage ${categories.length} categories`}
          </p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setDialogOpen(true) }}>
          <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("categories.addCategory")}
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              {language === "ar" ? "جاري التحميل..." : "Loading categories..."}
            </div>
          ) : (
            <DataTable
              data={categories}
              columns={columns}
              searchPlaceholder={language === "ar" ? "البحث عن فئة..." : "Search categories..."}
              searchKey="nameEn"
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className={cn(dir === "rtl" && "text-right")}>
              {editingCategory ? t("categories.editCategory") : t("categories.addCategory")}
            </DialogTitle>
            <DialogDescription className={cn(dir === "rtl" && "text-right")}>
              {editingCategory
                ? language === "ar"
                  ? "تعديل بيانات الفئة"
                  : "Edit category details"
                : language === "ar"
                  ? "إضافة فئة جديدة"
                  : "Add a new category to the store"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nameEn">{t("categories.categoryNameEn")}</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">{t("categories.categoryNameAr")}</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">{language === "ar" ? "صورة الفئة" : "Category Image"}</Label>
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
              <Label htmlFor="imageUrl">{language === "ar" ? "أو رابط الصورة" : "Or Image URL"}</Label>
              <Input
                id="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (language === "ar" ? "جاري الحفظ..." : "Saving...") : t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(dir === "rtl" && "text-right")}>
              {t("categories.deleteCategory")}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(dir === "rtl" && "text-right")}>
              {language === "ar"
                ? `هل أنت متأكد من حذف "${categoryToDelete?.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${categoryToDelete?.nameEn}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("categories.deleteCategory")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
