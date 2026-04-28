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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

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
    // keeping function just in case it's used elsewhere, though we remove it from table
  }

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} EGP`

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true
    return product.categoryId === selectedCategory
  })

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
      key: "category", header: "Style", render: (product: Product) => {
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
    {
      key: "actions", header: "Actions", render: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#A6ACA2]/10"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl shadow-[#7B3F32]/10 border-[#7B3F32]/10">
            <DropdownMenuItem asChild className="hover:bg-[#f6eee8] cursor-pointer rounded-lg">
              <Link href={`/admin/products/${product.id}`}><Eye className="h-4 w-4 mr-2 text-[#7B3F32]" /><span className="text-[#3a2c26] font-medium">View</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-[#f6eee8] cursor-pointer rounded-lg mt-1">
              <Link href={`/admin/products/${product.id}/edit`}><Pencil className="h-4 w-4 mr-2 text-[#7B3F32]" /><span className="text-[#3a2c26] font-medium">Edit</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(product)} className="hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg mt-1">
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /><span className="text-red-600 font-medium">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ), className: "w-[70px]"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />

        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Products</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage {products.length} products</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {products.length > 0 && (
            <Button variant="destructive" onClick={() => setDeleteAllDialogOpen(true)} className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl shadow-none font-bold transition-all">
              <Trash2 className="h-4 w-4 mr-2" />Delete All
            </Button>
          )}
          <Button asChild className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0">
            <Link href="/admin/products/new" className="flex items-center gap-2"><Plus className="h-4 w-4 shrink-0" />Add Product</Link>
          </Button>
        </div>
      </div>

      {/* <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading products...</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] h-10 border-[#7B3F32]/20 rounded-xl">
                    <SelectValue placeholder="All Styles" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-xl">
                    <SelectItem value="all">All Styles</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nameEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DataTable data={filteredProducts} columns={columns} searchPlaceholder="Search products..." searchKey="nameEn" />
            </div>
          )}
        </CardContent>
      </Card> */}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">Are you sure you want to delete <span className="font-semibold text-[#7B3F32]">"{productToDelete?.nameEn}"</span>? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-500/20">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-red-600">Delete All Products</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">Are you sure you want to delete all products? This action cannot be undone and will remove all products from the store.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-600/30">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}