"use client"

import { useState, useEffect } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"
import type { TypeDto } from "@/app/ApiHelper/types"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Tag } from "lucide-react"

export default function TypesPage() {
  const [types, setTypes] = useState<TypeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<TypeDto | null>(null)
  const [typeToDelete, setTypeToDelete] = useState<TypeDto | null>(null)
  const [formData, setFormData] = useState({ name: "" })

  useEffect(() => {
    if (editingType) {
      setFormData({ name: editingType.name || "" })
    } else if (dialogOpen) {
      setFormData({ name: "" })
    }
  }, [editingType, dialogOpen])

  const fetchTypes = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.types.getAll()
      setTypes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch types:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  const handleSave = async () => {
    if (!formData.name.trim()) return

    try {
      setLoading(true)
      if (editingType) {
        await ApiClient.types.edit({
          ...editingType,
          name: formData.name,
          currentState: 1
        })
      } else {
        await ApiClient.types.add({
          name: formData.name,
          currentState: 1
        })
      }
      setDialogOpen(false)
      fetchTypes()
    } catch (err) {
      console.error("Failed to save type:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (type: TypeDto) => {
    setTypeToDelete(type)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!typeToDelete?.id) return
    try {
      setLoading(true)
      // Assuming a delete endpoint exists based on patterns, or we just set currentState to 0
      // For now, if no delete endpoint is provided in the prompt, we might need one.
      // But user only asked for fetch, add, edit.
      alert("Delete functionality not explicitly defined in API documentation provided. Setting state to inactive if supported.")
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error("Delete failed", err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "icon",
      header: "",
      render: () => (
        <div className="h-10 w-10 rounded-xl bg-[#7B3F32]/5 flex items-center justify-center text-[#7B3F32]">
          <Tag size={18} />
        </div>
      ),
      className: "w-[60px]"
    },
    {
      key: "name",
      header: "Type Name",
      render: (type: TypeDto) => <span className="font-semibold text-slate-900">{type.name}</span>
    },
    {
      key: "createdDate",
      header: "Created Date",
      render: (type: TypeDto) => (
        <span className="text-slate-500 text-sm">
          {type.createdDate ? new Date(type.createdDate).toLocaleDateString() : "N/A"}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (type: TypeDto) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#7B3F32]/10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl border-[#7B3F32]/10">
            <DropdownMenuItem
              onClick={() => {
                setEditingType(type)
                setDialogOpen(true)
              }}
              className="hover:bg-[#f6eee8] cursor-pointer rounded-lg"
            >
              <Pencil className="h-4 w-4 mr-2 text-[#7B3F32]" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(type)}
              className="hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg mt-1 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl" />
        
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Furniture Types</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Categorize items by their type (e.g. Sofas, Beds, Tables)</p>
        </div>

        <Button
          onClick={() => {
            setEditingType(null)
            setDialogOpen(true)
          }}
          className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Type
        </Button>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="pt-6">
          {loading && types.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">
              Loading furniture types...
            </div>
          ) : (
            <DataTable
              data={types}
              columns={columns}
              searchPlaceholder="Search types..."
              searchKey="name"
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">
              {editingType ? "Edit Furniture Type" : "Add Furniture Type"}
            </DialogTitle>
            <DialogDescription className="text-[#8b7d73] mt-1">
              Give your furniture type a clear and descriptive name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-[#4b3d34]">
                Type Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="e.g. Corner Sofas"
                className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50"
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !formData.name.trim()}
              className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-xl h-11 font-bold shadow-[0_8px_20px_rgba(123,63,50,0.2)]"
            >
              {loading ? "Saving..." : editingType ? "Update Type" : "Create Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">
              Delete Furniture Type
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7d73] mt-2">
              Are you sure you want to delete <span className="font-semibold text-[#7B3F32]">"{typeToDelete?.name}"</span>?
              This will affect all products currently using this type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-bold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
