"use client"

import { useEffect, useState } from "react"
import { getImageUrl } from "@/lib/utils"
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
      const [items, categoriesData] = await Promise.all([
        ApiClient.get("api/admin/Item"),
        ApiClient.get("api/admin/Categories"),
      ])
      const mapped = (items as AdminItemDto[]).map((item) => mapAdminItemToProduct(item, categoriesData as AdminCategoryDto[]))
      setCategories(categoriesData as AdminCategoryDto[])
      setProducts(mapped)
    } catch (err) { console.error("Failed to fetch products:", err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = (product: Product) => { setProductToDelete(product); setDeleteDialogOpen(true) }

  const confirmDelete = async () => {
    if (!productToDelete) return
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Item/delete-item/${productToDelete.id}`, {})
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      await fetchProducts()
    } catch (err) { console.error("Failed to delete product:", err) }
    finally { setLoading(false) }
  }

  const confirmDeleteAll = async () => {
    try {
      setLoading(true)
      await ApiClient.post(`api/admin/Item/delete-all-items`, {})
      setDeleteAllDialogOpen(false)
      await fetchProducts()
    } catch (err: any) { console.error("Failed to delete all products:", err) }
    finally { setLoading(false) }
  }

  const getStatusBadge = (status: Product["status"]) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      inactive: { label: "Inactive", className: "bg-slate-100 text-slate-600 border-slate-200" },
      draft: { label: "Draft", className: "bg-amber-100 text-amber-700 border-amber-200" },
    }
    const config = statusConfig[status]
    return <Badge className={`border ${config.className}`}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} EGP`

  const columns = [
    {
      key: "product", header: "Product Name", render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 shrink-0">
            <Image src={getImageUrl(product.mainImage || product.images[0])} alt={product.nameEn} fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{product.nameEn}</p>
            {product.colorsEn && product.colorsEn.trim().length > 0 && <p className="text-sm text-slate-500">Colors: {product.colorsEn}</p>}
            {product.materialEn && product.materialEn.trim().length > 0 && <p className="text-sm text-slate-500">Material: {product.materialEn}</p>}
          </div>
        </div>
      )
    },
    {
      key: "category", header: "Category", render: (product: Product) => {
        const category = categories.find((cat) => cat.id === product.categoryId)
        return <span className="text-slate-500">{category?.nameEn || product.category}</span>
      }
    },
    {
      key: "price", header: "Price", render: (product: Product) => (
        <div>
          <p className="font-semibold text-slate-900">{formatCurrency(product.price)}</p>
          {product.originalPrice && <p className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p>}
        </div>
      )
    },
    {
      key: "stock", header: "Stock", render: (product: Product) => (
        <span className={`font-semibold ${product.stock <= 10 ? "text-red-600" : "text-indigo-600"}`}>{product.stock}</span>
      )
    },
    { key: "status", header: "Status", render: (product: Product) => getStatusBadge(product.status) },
    {
      key: "actions", header: "Actions", render: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-indigo-50"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem asChild className="hover:bg-indigo-50 cursor-pointer">
              <Link href={`/admin/products/${product.id}`}><Eye className="h-4 w-4 mr-2 text-indigo-600" /><span className="text-indigo-600">View</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-indigo-50 cursor-pointer">
              <Link href={`/admin/products/${product.id}/edit`}><Pencil className="h-4 w-4 mr-2 text-indigo-600" /><span className="text-indigo-600">Edit</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(product)} className="hover:bg-red-50 cursor-pointer">
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /><span className="text-red-600">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ), className: "w-[70px]"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500">Manage {products.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50 hover:border-indigo-300">
                <Download className="h-4 w-4 mr-2" />Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => exportItemsExcel()} className="hover:bg-indigo-50 cursor-pointer">Export to Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportItemsPdf()} className="hover:bg-indigo-50 cursor-pointer">Export to PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          {products.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteAllDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />Delete All
            </Button>
          )}
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/admin/products/new" className="flex items-center gap-2"><Plus className="h-4 w-4" />Add Product</Link>
          </Button>
        </div>
      </div>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading products...</div>
          ) : (
            <DataTable data={products} columns={columns} searchPlaceholder="Search products..." searchKey="nameEn" />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">Are you sure you want to delete "{productToDelete?.nameEn}"? This action cannot be undone.</AlertDialogDescription>
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
            <AlertDialogTitle className="text-slate-900">Delete All Products</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">Are you sure you want to delete all products? This action cannot be undone.</AlertDialogDescription>
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