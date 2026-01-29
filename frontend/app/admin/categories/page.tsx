"use client"

import { useState } from "react"
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

export default function CategoriesPage() {
  const { t, language, dir } = useAdminLanguage()
  const [categories, setCategories] = useState(mockCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const getStatusBadge = (status: Category["status"]) => {
    const statusConfig = {
      active: { variant: "default" as const, labelEn: "Active", labelAr: "نشط", className: "bg-emerald-500" },
      inactive: { variant: "secondary" as const, labelEn: "Inactive", labelAr: "غير نشط", className: "" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id))
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const columns = [
    {
      key: "name",
      header: t("categories.categoryName"),
      render: (category: Category) => (
        <div className={cn(dir === "rtl" && "text-right")}>
          <p className="font-medium">
            {language === "ar" ? category.nameAr : category.nameEn}
          </p>
          <p className="text-sm text-muted-foreground">/{category.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: t("categories.description"),
      render: (category: Category) => (
        <p className="text-muted-foreground max-w-[200px] truncate">
          {language === "ar" ? category.descriptionAr : category.descriptionEn}
        </p>
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
      key: "status",
      header: t("categories.status"),
      render: (category: Category) => getStatusBadge(category.status),
    },
    {
      key: "createdAt",
      header: language === "ar" ? "تاريخ الإنشاء" : "Created",
      render: (category: Category) => (
        <span className="text-muted-foreground">
          {new Date(category.createdAt).toLocaleDateString(
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
          <DataTable
            data={categories}
            columns={columns}
            searchPlaceholder={language === "ar" ? "البحث عن فئة..." : "Search categories..."}
            searchKey="nameEn"
          />
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
                <Input id="nameEn" defaultValue={editingCategory?.nameEn || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">{t("categories.categoryNameAr")}</Label>
                <Input id="nameAr" defaultValue={editingCategory?.nameAr || ""} dir="rtl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">{t("categories.slug")}</Label>
              <Input id="slug" defaultValue={editingCategory?.slug || ""} placeholder="category-slug" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">{language === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
              <Textarea id="descriptionEn" defaultValue={editingCategory?.descriptionEn || ""} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">{language === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
              <Textarea id="descriptionAr" defaultValue={editingCategory?.descriptionAr || ""} dir="rtl" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">{t("categories.parent")}</Label>
              <Select defaultValue={editingCategory?.parentId || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "بدون فئة رئيسية" : "No parent"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{language === "ar" ? "بدون" : "None"}</SelectItem>
                  {categories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === "ar" ? category.nameAr : category.nameEn}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
              <Label htmlFor="active">{t("categories.status")}</Label>
              <Switch id="active" defaultChecked={editingCategory?.status === "active"} />
            </div>
          </div>
          <DialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={() => setDialogOpen(false)}>{t("common.save")}</Button>
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
