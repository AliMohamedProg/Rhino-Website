"use client"

import { useEffect, useState } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/admin/data-table"
import type { Product } from "@/lib/admin-data"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { mapAdminItemToProduct, type AdminCategoryDto, type AdminItemDto } from "@/lib/admin-items"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductsPage() {
  const { t, language, dir } = useAdminLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<AdminCategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const [items, categories] = await Promise.all([
        ApiClient.get("api/admin/Item"),
        ApiClient.get("api/admin/Categories"),
      ])

      const mapped = (items as AdminItemDto[]).map((item) =>
        mapAdminItemToProduct(item, categories as AdminCategoryDto[])
      )
      setCategories(categories as AdminCategoryDto[])
      setProducts(mapped)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Item/delete-item/${productToDelete.id}`, {})
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      await fetchProducts()
    } catch (err) {
      console.error("Failed to delete product:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Product["status"]) => {
    const statusConfig = {
      active: { variant: "default" as const, labelEn: "Active", labelAr: "نشط", className: "bg-emerald-500" },
      inactive: { variant: "secondary" as const, labelEn: "Inactive", labelAr: "غير نشط", className: "" },
      draft: { variant: "outline" as const, labelEn: "Draft", labelAr: "مسودة", className: "" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  const columns = [
    {
      key: "product",
      header: t("products.productName"),
      render: (product: Product) => (
        <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted shrink-0">
            <Image
              src={product.mainImage || product.images[0] || "/placeholder.jpg"}
              alt={language === "ar" ? product.nameAr : product.nameEn}
              fill
              className="object-cover"
            />
          </div>
          <div className={cn(dir === "rtl" && "text-right")}>
            <p className="font-medium">
              {language === "ar" ? product.nameAr : product.nameEn}
            </p>
            {product.colors && product.colors.trim().length > 0 && (
              <p className="text-sm text-muted-foreground">
                {language === "ar" ? "الألوان: " : "Colors: "}
                {product.colors}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("products.category"),
      render: (product: Product) => {
        const category = categories.find((cat) => cat.id === product.categoryId)
        const label = language === "ar" ? category?.nameAr : category?.nameEn
        return <span className="text-muted-foreground">{label || product.category}</span>
      },
    },
    {
      key: "price",
      header: t("products.price"),
      render: (product: Product) => (
        <div className={cn(dir === "rtl" && "text-right")}>
          <p className="font-medium">{formatCurrency(product.price)}</p>
          {product.originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: t("products.stock"),
      render: (product: Product) => (
        <span
          className={cn(
            "font-medium",
            product.stock <= 10 && "text-destructive"
          )}
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: t("products.status"),
      render: (product: Product) => getStatusBadge(product.status),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>
                <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {t("common.view")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Pencil className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {t("common.edit")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(product)}
            >
              <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("products.deleteProduct")}
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
          <h1 className="text-2xl font-bold tracking-tight">{t("products.title")}</h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? `إدارة ${products.length} منتج`
              : `Manage ${products.length} products`}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new" className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
            <Plus className="h-4 w-4" />
            {t("products.addProduct")}
          </Link>
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              {language === "ar" ? "جاري التحميل..." : "Loading products..."}
            </div>
          ) : (
            <DataTable
              data={products}
              columns={columns}
              searchPlaceholder={language === "ar" ? "البحث عن منتج..." : "Search products..."}
              searchKey="nameEn"
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(dir === "rtl" && "text-right")}>
              {t("products.deleteProduct")}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(dir === "rtl" && "text-right")}>
              {language === "ar"
                ? `هل أنت متأكد من حذف "${productToDelete?.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${productToDelete?.nameEn}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("products.deleteProduct")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
