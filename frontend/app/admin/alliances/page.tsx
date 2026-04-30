"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MoreHorizontal, Pencil, Trash2, Building2 } from "lucide-react"
import { MOCK_BRANDS, type Brand } from "@/lib/mock-admin-data"

export default function AlliancesPage() {
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({ name: "", logo: "", description: "" })

  const handleSave = () => {
    if (editingBrand) {
      setBrands(brands.map(b => b.id === editingBrand.id ? { ...b, ...formData } : b))
    } else {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        ...formData,
        categories: []
      }
      setBrands([...brands, newBrand])
    }
    setDialogOpen(false)
  }

  const columns = [
    { key: "logo", header: "Logo", render: (brand: Brand) => (
      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
        {brand.logo ? <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" /> : <Building2 className="h-4 w-4 text-slate-300" />}
      </div>
    )},
    { key: "name", header: "Brand Name", render: (brand: Brand) => <span className="font-bold text-[#3a2c26]">{brand.name}</span> },
    { key: "description", header: "Description", render: (brand: Brand) => <span className="text-sm text-slate-500 line-clamp-1">{brand.description}</span> },
    { key: "actions", header: "Actions", render: (brand: Brand) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl">
          <DropdownMenuItem onClick={() => { setEditingBrand(brand); setFormData({ name: brand.name, logo: brand.logo, description: brand.description }); setDialogOpen(true) }} className="hover:bg-[#f6eee8] cursor-pointer">
            <Pencil className="h-4 w-4 mr-2" />Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBrands(brands.filter(b => b.id !== brand.id))} className="hover:bg-red-50 text-red-600 cursor-pointer">
            <Trash2 className="h-4 w-4 mr-2" />Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ), className: "w-[70px]" }
  ]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Global Partners</p>
          <h1 className="text-3xl font-bold text-[#2f2219] mt-1">Alliances</h1>
          <p className="text-[#7c6f65] mt-1 text-sm">Manage brand partners and projects</p>
        </div>
        
        <Button onClick={() => { setEditingBrand(null); setFormData({ name: "", logo: "", description: "" }); setDialogOpen(true) }} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white rounded-2xl shadow-lg font-bold px-5">
          <Plus className="h-4 w-4 mr-2" />Add Brand
        </Button>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 rounded-[2rem] overflow-hidden">
        <CardContent className="pt-6">
          <DataTable data={brands} columns={columns} searchPlaceholder="Search brands..." searchKey="name" />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-3xl p-8 max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-xl min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="bg-[#7B3F32] text-white rounded-xl">Save Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
