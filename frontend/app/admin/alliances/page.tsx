"use client"

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Pencil, Trash2, Building2 } from "lucide-react"

type Alliance = {
    id: string
    name: string
    imageUrl?: string
    currentState?: number
    createdDate?: string
}

export default function AlliancesPage() {
    const [alliances, setAlliances] = useState<Alliance[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editingAlliance, setEditingAlliance] = useState<Alliance | null>(null)
    const [allianceToDelete, setAllianceToDelete] = useState<Alliance | null>(null)
    const [formData, setFormData] = useState({ name: "" })
    const [imageUrl, setImageUrl] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const fetchAlliances = async () => {
        try {
            setLoading(true)
            const data = await ApiClient.get<any[]>("api/admin/Alliance")
            const normalized = Array.isArray(data)
                ? data.map((item) => ({
                    id: String(item.id ?? item.Id ?? ""),
                    name: String(item.name ?? item.Name ?? ""),
                    imageUrl: String(item.imageUrl ?? item.ImageUrl ?? ""),
                    currentState: Number(item.currentState ?? item.CurrentState ?? 1),
                    createdDate: String(item.createdDate ?? item.CreatedDate ?? ""),
                }))
                : []
            setAlliances(normalized)
        } catch (err) {
            console.error("Failed to fetch alliances:", err)
            setAlliances([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlliances()
    }, [])

    useEffect(() => {
        if (editingAlliance) {
            setFormData({ name: editingAlliance.name })
            setImageUrl(editingAlliance.imageUrl || "")
            setSelectedFile(null)
        } else if (dialogOpen) {
            setFormData({ name: "" })
            setImageUrl("")
            setSelectedFile(null)
        }
    }, [editingAlliance, dialogOpen])

    const handleSave = async () => {
        try {
            setLoading(true)
            let finalImageUrl = imageUrl

            if (selectedFile) {
                const uploadRes = await ApiClient.upload("api/upload", selectedFile)
                finalImageUrl = uploadRes.url || uploadRes.imageUrl || uploadRes
            }

            const payload = {
                id: editingAlliance?.id || crypto.randomUUID(),
                currentState: editingAlliance?.currentState ?? 1,
                createdDate: editingAlliance?.createdDate || new Date().toISOString(),
                name: formData.name,
                imageUrl: finalImageUrl,
            }

            if (editingAlliance) {
                await ApiClient.post("api/admin/Alliance/edit-alliance", payload)
            } else {
                await ApiClient.post("api/admin/Alliance/add-alliance", payload)
            }

            setDialogOpen(false)
            setEditingAlliance(null)
            await fetchAlliances()
        } catch (err) {
            console.error("Failed to save alliance:", err)
        } finally {
            setLoading(false)
        }
    }

    const confirmDelete = async () => {
        if (!allianceToDelete) return
        try {
            setLoading(true)
            await ApiClient.post(`api/admin/Alliance/delete-alliance/${allianceToDelete.id}`, {})
            setDeleteDialogOpen(false)
            setAllianceToDelete(null)
            await fetchAlliances()
        } catch (err) {
            console.error("Failed to delete alliance:", err)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            key: "image",
            header: "Image",
            render: (alliance: Alliance) => (
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    {alliance.imageUrl ? (
                        <img src={alliance.imageUrl} alt={alliance.name} className="h-full w-full object-cover" />
                    ) : (
                        <Building2 className="h-4 w-4 text-slate-300" />
                    )}
                </div>
            ),
        },
        {
            key: "name",
            header: "Alliance Name",
            render: (alliance: Alliance) => <span className="font-bold text-[#3a2c26]">{alliance.name}</span>,
        },
        {
            key: "actions",
            header: "Actions",
            render: (alliance: Alliance) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl">
                        <DropdownMenuItem
                            onClick={() => {
                                setEditingAlliance(alliance)
                                setDialogOpen(true)
                            }}
                            className="hover:bg-[#f6eee8] cursor-pointer"
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setAllianceToDelete(alliance)
                                setDeleteDialogOpen(true)
                            }}
                            className="hover:bg-red-50 text-red-600 cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Delete</span>
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
                <div className="relative z-10">
                    <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
                    <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Alliances</h1>
                    <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage alliance partners</p>
                </div>

                <Button
                    onClick={() => {
                        setEditingAlliance(null)
                        setDialogOpen(true)
                    }}
                    className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-2xl shadow-lg font-bold transition-all px-5 border-0"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Alliance
                </Button>
            </div>

            <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
                <CardContent className="pt-6">
                    {loading && alliances.length === 0 ? (
                        <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading alliances...</div>
                    ) : (
                        <DataTable data={alliances} columns={columns} searchPlaceholder="Search alliances..." searchKey="name" />
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl border-[#7B3F32]/10 shadow-2xl p-6 md:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#2f2219]">{editingAlliance ? "Edit Alliance" : "Add Alliance"}</DialogTitle>
                        <DialogDescription className="text-[#8b7d73]">Enter the alliance details below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-[#4b3d34]">Alliance Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
                                className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#4b3d34]">Alliance Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) setSelectedFile(file)
                                }}
                                className="border-[#7B3F32]/20 file:bg-[#f6eee8] file:text-[#7B3F32] file:border-0 file:rounded-xl file:px-4 file:font-semibold rounded-xl bg-white/50 cursor-pointer pt-2"
                            />
                            {selectedFile ? (
                                <div className="mt-4 h-32 w-full rounded-2xl overflow-hidden border border-[#7B3F32]/10 bg-[#f8f0e7] shadow-sm">
                                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            ) : imageUrl && (
                                <div className="mt-4 h-32 w-full rounded-2xl overflow-hidden border border-[#7B3F32]/10 bg-[#f8f0e7] shadow-sm">
                                    <img src={imageUrl} alt="Current" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl" className="text-sm font-semibold text-[#4b3d34]">Or Image URL</Label>
                            <Input
                                id="imageUrl"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="border-[#7B3F32]/20 focus:border-[#7B3F32] focus:ring-[#7B3F32]/20 h-12 rounded-xl bg-white/50"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#7B3F32]/20 text-[#4b3d34] hover:bg-[#f6eee8] rounded-xl h-12 font-medium">Cancel</Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white hover:from-[#5f3026] hover:to-[#8e4f3f] rounded-xl h-12 font-bold shadow-[0_8px_20px_rgba(123,63,50,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                            {loading ? "Saving..." : "Save Alliance"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white rounded-3xl border-[#7B3F32]/10 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#2f2219]">Delete Alliance</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#8b7d73]">Are you sure you want to delete <span className="font-semibold text-[#7B3F32]">"{allianceToDelete?.name}"</span>? This action cannot be undone.</AlertDialogDescription>
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