"use client"

import { useEffect, useState } from "react"
import { getImageUrl } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import type { CollectionDto } from "@/app/ApiHelper/types"
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

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionDto[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<CollectionDto | null>(null)

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.collection.getAll()
      setCollections(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch collections:", err)
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const handleDelete = (collection: CollectionDto) => {
    setCollectionToDelete(collection)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!collectionToDelete || !collectionToDelete.id) return
    try {
      setLoading(true)
      await ApiClient.collection.delete(collectionToDelete.id)
      setDeleteDialogOpen(false)
      setCollectionToDelete(null)
      await fetchCollections()
    } catch (err) {
      console.error("Failed to delete collection:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => `${(amount || 0).toLocaleString()} EGP`

  const columns = [
    {
      key: "collection",
      header: "Collection Name",
      render: (collection: CollectionDto) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 shrink-0">
            <Image
              src={getImageUrl(collection.mainImage || "")}
              alt={collection.name || "Collection"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-slate-900">{collection.name}</p>
            <p className="text-sm text-slate-500 line-clamp-1">{collection.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (collection: CollectionDto) => (
        <div>
          <p className="font-semibold text-slate-900">{formatCurrency(collection.price || 0)}</p>
          {collection.oldPrice && collection.oldPrice > 0 && (
            <p className="text-sm text-slate-400 line-through">{formatCurrency(collection.oldPrice)}</p>
          )}
        </div>
      ),
    },
    {
      key: "items",
      header: "Items Count",
      render: (collection: CollectionDto) => (
        <span className="text-slate-500">{(collection.items?.length || 0) + (collection.collectionItems?.length || 0)} items</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (collection: CollectionDto) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#A6ACA2]/10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl shadow-[#7B3F32]/10 border-[#7B3F32]/10">
            <DropdownMenuItem asChild className="hover:bg-[#f6eee8] cursor-pointer rounded-lg">
              <Link href={`/admin/collections/${collection.id}`}>
                <Eye className="h-4 w-4 mr-2 text-[#7B3F32]" />
                <span className="text-[#3a2c26] font-medium">View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-[#f6eee8] cursor-pointer rounded-lg mt-1">
              <Link href={`/admin/collections/${collection.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2 text-[#7B3F32]" />
                <span className="text-[#3a2c26] font-medium">Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(collection)}
              className="hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg mt-1"
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
              <span className="text-red-600 font-medium">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />

        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Collections</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage your product collections</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button asChild className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0">
            <Link href="/admin/collections/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4 shrink-0" />Add Collection
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading collections...</div>
          ) : (
            <div className="space-y-4">
              <DataTable
                data={collections}
                columns={columns}
                searchPlaceholder="Search collections..."
                searchKey="name"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Delete Collection</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">
              Are you sure you want to delete <span className="font-semibold text-[#7B3F32]">"{collectionToDelete?.name}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-500/20">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
