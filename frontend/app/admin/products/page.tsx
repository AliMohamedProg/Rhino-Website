"use client"

import { useEffect, useState } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn, getImageUrl } from "@/lib/utils"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { exportItemsExcel, exportItemsPdf } from "@/app/ApiHelper/ExportApi"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<AdminCategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
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

  const confirmDeleteAll = async () => {
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Item/delete-all-items`, {})
      setDeleteAllDialogOpen(false)
      alert("All products deleted successfully")
      await fetchProducts()
    } catch (err: any) {
      console.error("Failed to delete all products:", err)
      const errorMsg = err.message || JSON.stringify(err)
      alert("Delete failed: " + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Product["status"]) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active", className: "bg-emerald-500" },
      inactive: { variant: "secondary" as const, label: "Inactive", className: "" },
      draft: { variant: "outline" as const, label: "Draft", className: "" },
    }
    const config = statusConfig[status] || statusConfig.active
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} EGP`
  }

  const columns = [
    {
      key: "product",
      header: "Product Name",
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted shrink-0">
            <Image
              src={getImageUrl(product.mainImage || product.images[0])}
              alt={product.nameEn}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">
              {product.nameEn}
            </p>
            {product.colorsEn && product.colorsEn.trim().length > 0 && (
              <p className="text-sm text-muted-foreground">
                Colors: {product.colorsEn}
              </p>
            )}
            {product.materialEn && product.materialEn.trim().length > 0 && (
              <p className="text-sm text-muted-foreground">
                Material: {product.materialEn}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product: Product) => {
        const category = categories.find((cat) => cat.id === product.categoryId)
        const label = category?.nameEn
        return <span className="text-muted-foreground">{label || product.category}</span>
      },
    },
    {
      key: "price",
      header: "Price",
      render: (product: Product) => (
        <div>
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
      header: "Stock",
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
      header: "Status",
      render: (product: Product) => getStatusBadge(product.status),
    },
    {
      key: "actions",
      header: "Actions",
      render: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(product)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
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
          <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
          <p className="text-muted-foreground">
            Manage {products.length} products
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
              <DropdownMenuItem onClick={() => exportItemsExcel()}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportItemsPdf()}>
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {products.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteAllDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          )}
          <Button asChild>
            <Link href="/admin/products/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              Loading products...
            </div>
          ) : (
            <DataTable
              data={products}
              columns={columns}
              searchPlaceholder="Search products..."
              searchKey="nameEn"
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{productToDelete?.nameEn}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete All Products
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all products? This action cannot be undone.
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

