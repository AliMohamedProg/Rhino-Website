"use client"

import { useState, useEffect } from "react"
import { getImageUrl } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, MoreHorizontal, Pencil, Trash2, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FabricDto {
    id: string
    nameEn: string
    nameAr: string
    type: string
    priceDelta: number
    swatchImage: string
    isActive: boolean
    usedInProductsCount: number
}

interface FabricFormData {
    nameEn: string
    nameAr: string
    type: string
    priceDelta: number
    isActive: boolean
}

const FABRIC_TYPES = [
    "Linen",
    "Velvet",
    "Cotton",
    "Suede",
    "Boucle",
    "Tweed",
    "Silk",
    "Wool",
    "Polyester",
    "Other",
]

const EMPTY_FORM: FabricFormData = {
    nameEn: "",
    nameAr: "",
    type: "",
    priceDelta: 0,
    isActive: true,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FabricsPage() {
    const [fabrics, setFabrics] = useState<FabricDto[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingFabric, setEditingFabric] = useState<FabricDto | null>(null)
    const [formData, setFormData] = useState<FabricFormData>(EMPTY_FORM)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [swatchPreview, setSwatchPreview] = useState<string | null>(null)
    const [removeExistingSwatch, setRemoveExistingSwatch] = useState(false)
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof FabricFormData | "swatchImage", string>>>({})

    // delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
    const [fabricToDelete, setFabricToDelete] = useState<FabricDto | null>(null)

    // ─── Fetch ────────────────────────────────────────────────────────────

    const fetchFabrics = async () => {
        try {
            setLoading(true)
            const data = await ApiClient.get("api/admin/Fabrics")
            setFabrics(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch fabrics:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFabrics()
    }, [])

    // ─── Dialog helpers ────────────────────────────────────────────────────

    const openAddDialog = () => {
        setEditingFabric(null)
        setFormData(EMPTY_FORM)
        setSelectedFile(null)
        setSwatchPreview(null)
        setRemoveExistingSwatch(false)
        setFormErrors({})
        setDialogOpen(true)
    }

    const openEditDialog = (fabric: FabricDto) => {
        setEditingFabric(fabric)
        setFormData({
            nameEn: fabric.nameEn,
            nameAr: fabric.nameAr,
            type: fabric.type,
            priceDelta: fabric.priceDelta,
            isActive: fabric.isActive,
        })
        setSelectedFile(null)
        setSwatchPreview(null)
        setRemoveExistingSwatch(false)
        setFormErrors({})
        setDialogOpen(true)
    }

    const handleFieldChange = (field: keyof FabricFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        setSwatchPreview(URL.createObjectURL(file))
        setRemoveExistingSwatch(false)
        setFormErrors((prev) => ({ ...prev, swatchImage: undefined }))
    }

    const removeNewFile = () => {
        setSelectedFile(null)
        setSwatchPreview(null)
    }

    const removeExisting = () => {
        setRemoveExistingSwatch(true)
    }

    // The image src shown in the dialog
    const activeSwatchSrc = swatchPreview
        ?? (editingFabric?.swatchImage && !removeExistingSwatch
            ? getImageUrl(editingFabric.swatchImage)
            : null)

    // ─── Validate & Save ──────────────────────────────────────────────────

    const validate = () => {
        const errors: typeof formErrors = {}
        if (!formData.nameEn.trim()) errors.nameEn = "English name is required"
        if (!formData.nameAr.trim()) errors.nameAr = "Arabic name is required"
        if (!formData.type) errors.type = "Fabric type is required"
        if (formData.priceDelta < 0) errors.priceDelta = "Cannot be negative"
        const hasImage = activeSwatchSrc !== null
        if (!hasImage && !editingFabric) errors.swatchImage = "Swatch image is required"
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSave = async () => {
        if (!validate()) return
        try {
            setSaving(true)
            const payload = new FormData()
            payload.append("nameEn", formData.nameEn)
            payload.append("nameAr", formData.nameAr)
            payload.append("type", formData.type)
            payload.append("priceDelta", String(formData.priceDelta))
            payload.append("isActive", String(formData.isActive))
            payload.append("removeSwatchImage", String(removeExistingSwatch))
            if (selectedFile) payload.append("swatchImage", selectedFile)

            // if (editingFabric) {
            //     await ApiClient.putForm(`api/admin/Fabrics/${editingFabric.id}`, payload)
            // } else {
            //     await ApiClient.postForm("api/admin/Fabrics", payload)
            // }

            setDialogOpen(false)
            await fetchFabrics()
        } catch (err) {
            console.error("Failed to save fabric:", err)
        } finally {
            setSaving(false)
        }
    }

    // ─── Delete handlers ──────────────────────────────────────────────────

    const confirmDelete = async () => {
        if (!fabricToDelete) return
        try {
            setLoading(true)
            await ApiClient.post(`api/admin/Fabrics/delete/${fabricToDelete.id}`, {})
            setDeleteDialogOpen(false)
            setFabricToDelete(null)
            await fetchFabrics()
        } catch (err) {
            console.error("Failed to delete fabric:", err)
        } finally {
            setLoading(false)
        }
    }

    const confirmDeleteAll = async () => {
        try {
            setLoading(true)
            await ApiClient.post("api/admin/Fabrics/delete-all", {})
            setDeleteAllDialogOpen(false)
            await fetchFabrics()
        } catch (err) {
            console.error("Failed to delete all fabrics:", err)
        } finally {
            setLoading(false)
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    const formatPriceDelta = (delta: number) =>
        delta === 0 ? "No extra" : `+${delta.toLocaleString()} EGP`

    // ─── Columns ──────────────────────────────────────────────────────────

    const columns = [
        {
            key: "fabric",
            header: "Fabric Name",
            render: (fabric: FabricDto) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                        {fabric.swatchImage ? (
                            <Image
                                src={getImageUrl(fabric.swatchImage)}
                                alt={fabric.nameEn}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#E8D5C0] rounded-lg" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{fabric.nameEn}</p>
                        {fabric.nameAr && (
                            <p className="text-sm text-slate-500 text-right">{fabric.nameAr}</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "type",
            header: "Type",
            render: (fabric: FabricDto) => (
                <span className="text-slate-500">{fabric.type}</span>
            ),
        },
        {
            key: "priceDelta",
            header: "Price Delta",
            render: (fabric: FabricDto) => (
                <span className={fabric.priceDelta === 0 ? "text-slate-400" : "font-semibold text-slate-900"}>
                    {formatPriceDelta(fabric.priceDelta)}
                </span>
            ),
        },
        {
            key: "usedIn",
            header: "Used In",
            render: (fabric: FabricDto) => (
                <span className="text-slate-500">
                    {fabric.usedInProductsCount} product{fabric.usedInProductsCount !== 1 ? "s" : ""}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (fabric: FabricDto) =>
                fabric.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                        Inactive
                    </span>
                ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "w-[70px]",
            render: (fabric: FabricDto) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#A6ACA2]/10">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl shadow-[#7B3F32]/10 border-[#7B3F32]/10">
                        <DropdownMenuItem
                            onClick={() => openEditDialog(fabric)}
                            className="hover:bg-[#f6eee8] cursor-pointer rounded-lg"
                        >
                            <Pencil className="h-4 w-4 mr-2 text-[#7B3F32]" />
                            <span className="text-[#3a2c26] font-medium">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => { setFabricToDelete(fabric); setDeleteDialogOpen(true) }}
                            className="hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg mt-1"
                        >
                            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                            <span className="text-red-600 font-medium">Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    // ─── Render ───────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
                <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />

                <div className="relative z-10">
                    <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
                    <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Fabrics</h1>
                    <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage {fabrics.length} fabrics</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    {fabrics.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteAllDialogOpen(true)}
                            className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl shadow-none font-bold transition-all"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />Delete All
                        </Button>
                    )}
                    <Button
                        onClick={openAddDialog}
                        className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-[0_10px_20px_rgba(123,63,50,0.22)] font-bold transition-all px-5 py-4 h-11 border-0"
                    >
                        <Plus className="h-4 w-4 mr-2 shrink-0" />Add Fabric
                    </Button>
                </div>
            </div>

            {/* ── Table ── */}
            <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                <CardContent className="pt-6">
                    {loading && fabrics.length === 0 ? (
                        <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading fabrics...</div>
                    ) : (
                        <DataTable
                            data={fabrics}
                            columns={columns}
                            searchPlaceholder="Search fabrics..."
                            searchKey="nameEn"
                        />
                    )}
                </CardContent>
            </Card>

            {/* ── Add / Edit Dialog ── */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[480px] bg-white rounded-3xl border-[#7B3F32]/10 shadow-2xl p-6 md:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#2f2219]">
                            {editingFabric ? "Edit Fabric" : "Add Fabric"}
                        </DialogTitle>
                        <DialogDescription className="text-[#8b7d73]">
                            {editingFabric
                                ? "Update the fabric details below."
                                : "Fill in the fabric details below."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">

                        {/* Name EN */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#4b3d34]">
                                Name (English) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.nameEn}
                                onChange={(e) => handleFieldChange("nameEn", e.target.value)}
                                placeholder="e.g. Natural Linen"
                                className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50"
                            />
                            {formErrors.nameEn && <p className="text-xs text-red-500">{formErrors.nameEn}</p>}
                        </div>

                        {/* Name AR */}
                        {/* <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#4b3d34]">
                                Name (Arabic) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.nameAr}
                                onChange={(e) => handleFieldChange("nameAr", e.target.value)}
                                placeholder="مثال: كتان طبيعي"
                                dir="rtl"
                                className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50 text-right"
                            />
                            {formErrors.nameAr && <p className="text-xs text-red-500">{formErrors.nameAr}</p>}
                        </div> */}

                        {/* Type */}
                        {/* <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#4b3d34]">
                                Fabric Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => handleFieldChange("type", val)}
                            >
                                <SelectTrigger className="border-[#7B3F32]/20 focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50">
                                    <SelectValue placeholder="Select fabric type..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-[#7B3F32]/10 bg-white shadow-xl">
                                    {FABRIC_TYPES.map((t) => (
                                        <SelectItem key={t} value={t} className="hover:bg-[#f6eee8] rounded-lg cursor-pointer">
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.type && <p className="text-xs text-red-500">{formErrors.type}</p>}
                        </div> */}

                        {/* Price Delta */}
                        {/* <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#4b3d34]">Price Delta (EGP)</Label>
                            <p className="text-xs text-[#8b7d73]">Extra cost on top of base price. Set to 0 for no extra charge.</p>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min={0}
                                    value={formData.priceDelta}
                                    onChange={(e) => handleFieldChange("priceDelta", Number(e.target.value))}
                                    className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50 pr-14"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8b7d73] font-medium pointer-events-none">
                                    EGP
                                </span>
                            </div>
                            {formErrors.priceDelta && <p className="text-xs text-red-500">{formErrors.priceDelta}</p>}
                        </div> */}

                        {/* Swatch Image */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#4b3d34]">
                                Swatch Image {!editingFabric && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border-[#7B3F32]/20 file:bg-[#f6eee8] file:text-[#7B3F32] file:border-0 file:rounded-xl file:px-4 file:font-semibold rounded-xl bg-white/50 cursor-pointer pt-2"
                            />
                            {formErrors.swatchImage && <p className="text-xs text-red-500">{formErrors.swatchImage}</p>}

                            {/* Preview */}
                            {activeSwatchSrc && (
                                <div className="relative mt-2 h-28 w-28 rounded-2xl overflow-hidden border border-[#7B3F32]/15 bg-[#f8f0e7] shadow-sm">
                                    <Image src={activeSwatchSrc} alt="Swatch preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={swatchPreview ? removeNewFile : removeExisting}
                                        className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 border border-[#7B3F32]/20 hover:bg-red-50 transition-colors"
                                    >
                                        <X className="h-3 w-3 text-red-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        {/* <div className="flex items-center justify-between rounded-xl border border-[#7B3F32]/15 bg-[#faf6f4] px-4 py-3">
                            <div>
                                <p className="text-sm font-semibold text-[#4b3d34]">Active</p>
                                <p className="text-xs text-[#8b7d73]">Visible to customers on product pages</p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(val) => handleFieldChange("isActive", val)}
                                className="data-[state=checked]:bg-[#7B3F32]"
                            />
                        </div> */}

                    </div>

                    <DialogFooter className="mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-12 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-xl h-12 font-bold shadow-[0_8px_20px_rgba(123,63,50,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {saving ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                            ) : editingFabric ? "Save Changes" : "Add Fabric"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete one ── */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Delete Fabric</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#8b7d73] mt-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-[#7B3F32]">&ldquo;{fabricToDelete?.nameEn}&rdquo;</span>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-11 font-medium">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 font-bold shadow-sm shadow-red-500/20">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Delete all ── */}
            <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-[#7B3F32]/10 rounded-3xl shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold tracking-tight text-red-600">Delete All Fabrics</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#8b7d73] mt-2">
                            Are you sure you want to delete all fabrics? This action cannot be undone and will remove all fabrics from the store.
                        </AlertDialogDescription>
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