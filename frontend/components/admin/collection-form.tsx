"use client"

import { useEffect, useState, useMemo, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { cn, getImageUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X, Search, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CollectionDto, ProductDto, FabricDto, ChangeDto } from "@/app/ApiHelper/types"
import type { AdminCategoryDto } from "@/lib/admin-items"

interface CollectionFormProps {
  collection?: CollectionDto
  mode: "create" | "edit"
}

interface FabricItem {
  name: string
  imageUrl: string
  file?: File
}

export function CollectionForm({ collection, mode }: CollectionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingFabric, setIsUploadingFabric] = useState(false)
  const [products, setProducts] = useState<ProductDto[]>([])
  const [categories, setCategories] = useState<AdminCategoryDto[]>([])
  const [styles, setStyles] = useState<AdminCategoryDto[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [existingCollections, setExistingCollections] = useState<CollectionDto[]>([])

  const buildInitialImages = (item?: CollectionDto) => {
    const list = [item?.mainImage ?? "", ...(item?.collectionImages?.map(img => img.imageUrl) ?? [])]
      .map((value) => (value ?? "").trim())
      .filter((value) => value.length > 0) as string[]
    return Array.from(new Set(list))
  }

  const buildInitialFabrics = (item?: CollectionDto): FabricItem[] => (
    Array.isArray(item?.collectionFabrics)
      ? item!.collectionFabrics.map((fabric) => ({
        name: fabric.name || "",
        imageUrl: fabric.imageUrl || "",
      }))
      : []
  )

  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
    price: collection?.oldPrice ?? collection?.price ?? 0,
    sku: collection?.sku || "",
    dimensions: collection?.dimensions || "",
    mainImage: collection?.mainImage || "",
    images: buildInitialImages(collection),
    colors: collection?.colors || "",
    material: collection?.material || "",
    stockNumber: collection?.stockNumber || 0,
    discountAmount: collection?.discountAmount || 0,
    categoryId: collection?.categoryId || "",
    styleId: collection?.styleId || "",
    fabrics: buildInitialFabrics(collection),
    changes: collection?.changes || [] as ChangeDto[],
  })

  const isInitialFetchDone = useRef(false)
  useEffect(() => {
    if (isInitialFetchDone.current) return

    let isMounted = true
    const fetchData = async () => {
      try {
        const [productsData, catsData, stylesData, collectionsData] = await Promise.all([
          ApiClient.get("api/admin/Item"),
          ApiClient.get("api/admin/Categories"),
          ApiClient.get("api/admin/Styles"),
          ApiClient.collection.getAll()
        ])

        if (!isMounted) return

        if (Array.isArray(productsData)) setProducts(productsData)
        if (Array.isArray(catsData)) setCategories(catsData)
        if (Array.isArray(stylesData)) setStyles(stylesData)
        if (Array.isArray(collectionsData)) setExistingCollections(collectionsData)

        isInitialFetchDone.current = true
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (!collection) return

    const initialIds = collection.collectionItems
      ? collection.collectionItems.map(item => item.itemId || "").filter(Boolean)
      : collection.items
        ? collection.items.map(item => item.id || "").filter(Boolean)
        : []

    setSelectedProductIds(prev => {
      if (prev.length === 0 && initialIds.length > 0) return initialIds
      return prev
    })
  }, [collection])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of Array.from(files)) {
        const uploadRes = await ApiClient.upload("api/Upload", file)
        const url = uploadRes?.url || uploadRes?.imageUrl || uploadRes
        if (url) uploadedUrls.push(url)
      }

      if (uploadedUrls.length) {
        setFormData((prev) => {
          const nextImages = Array.from(new Set([...prev.images, ...uploadedUrls]))
          const nextMainImage = prev.mainImage || uploadedUrls[0] || ""
          return { ...prev, images: nextImages, mainImage: nextMainImage }
        })
      }
    } catch (err) {
      console.error("Failed to upload images:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => {
      const nextImages = prev.images.filter((url) => url !== imageUrl)
      const nextMainImage = prev.mainImage === imageUrl ? nextImages[0] || "" : prev.mainImage
      return { ...prev, images: nextImages, mainImage: nextMainImage }
    })
  }

  const handleAddFabric = () => {
    setFormData((prev) => ({
      ...prev,
      fabrics: [...prev.fabrics, { name: "", imageUrl: "" }],
    }))
  }

  const handleRemoveFabric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fabrics: prev.fabrics.filter((_, i) => i !== index),
    }))
  }

  const handleFabricChange = (index: number, field: keyof FabricItem, value: string) => {
    setFormData((prev) => {
      const nextFabrics = [...prev.fabrics]
      nextFabrics[index] = { ...nextFabrics[index], [field]: value }
      return { ...prev, fabrics: nextFabrics }
    })
  }

  const handleFabricImageUpload = async (index: number, file: File) => {
    setIsUploadingFabric(true)
    try {
      const uploadRes = await ApiClient.upload("api/Upload", file)
      const url = uploadRes?.url || uploadRes?.imageUrl || uploadRes
      if (url) {
        handleFabricChange(index, "imageUrl", url)
      }
    } catch (err) {
      console.error("Failed to upload fabric image:", err)
    } finally {
      setIsUploadingFabric(false)
    }
  }

  const handleAddChange = () => {
    setFormData(prev => ({
      ...prev,
      changes: [...prev.changes, {
        id: crypto.randomUUID(),
        changeName: "",
        newDimensions: "",
        newSKU: "",
        overPrice: 0,
        newName: "",
        newDescription: "",
        changeImages: []
      }]
    }))
  }

  const handleRemoveChange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== index)
    }))
  }

  const handleChangeUpdate = (index: number, field: keyof ChangeDto, value: any) => {
    setFormData(prev => {
      const nextChanges = [...prev.changes]
      nextChanges[index] = { ...nextChanges[index], [field]: value }
      return { ...prev, changes: nextChanges }
    })
  }

  const handleUploadChangeImages = async (changeIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of Array.from(files)) {
        const uploadRes = await ApiClient.upload("api/Upload", file)
        const url = uploadRes?.url || uploadRes?.imageUrl || uploadRes
        if (url) uploadedUrls.push(url)
      }

      if (uploadedUrls.length) {
        setFormData((prev) => {
          const nextChanges = [...prev.changes]
          const change = nextChanges[changeIndex]
          const existingImages = change.changeImages || []
          const newImages = uploadedUrls.map(url => ({
            imageUrl: url,
            changeId: change.id || "00000000-0000-0000-0000-000000000000",
            currentState: 1
          }))
          nextChanges[changeIndex] = {
            ...change,
            changeImages: [...existingImages, ...newImages]
          }
          return { ...prev, changes: nextChanges }
        })
      }
    } catch (err) {
      console.error("Failed to upload change images:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveChangeImage = (changeIndex: number, imgIndex: number) => {
    setFormData((prev) => {
      const nextChanges = [...prev.changes]
      const change = nextChanges[changeIndex]
      const existingImages = change.changeImages || []
      const nextImages = existingImages.filter((_, i) => i !== imgIndex)
      nextChanges[changeIndex] = {
        ...change,
        changeImages: nextImages
      }
      return { ...prev, changes: nextChanges }
    })
  }

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = (p.nameEn || p.nameAr || (p as any).name || "").toLowerCase()
      const sku = (p.sku || "").toLowerCase()
      const search = searchQuery.toLowerCase()
      return name.includes(search) || sku.includes(search)
    })
  }, [products, searchQuery])

  const normalizedDiscount = Math.min(100, Math.max(0, Number(formData.discountAmount) || 0))
  const discountedPrice = Math.max(0, Math.round(formData.price * (1 - normalizedDiscount / 100)))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const collectionId = collection?.id || "00000000-0000-0000-0000-000000000000"

      const collectionImages = formData.images.map(url => ({
        imageUrl: url,
        productId: collectionId,
      }))

      const collectionFabrics = formData.fabrics.map(f => ({
        name: f.name,
        imageUrl: f.imageUrl,
        collectionId,
      }))

      const collectionItems = selectedProductIds.map(id => ({
        itemId: id,
        collectionId,
      }))

      const payload: CollectionDto = {
        id: collectionId,
        currentState: 1,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        oldPrice: 0,
        sku: formData.sku,
        dimensions: formData.dimensions,
        mainImage: formData.mainImage || (collectionImages[0]?.imageUrl ?? ""),
        colors: formData.colors,
        material: formData.material,
        stockNumber: formData.stockNumber,
        discountAmount: formData.discountAmount,
        categoryId: formData.categoryId || null,
        styleId: formData.styleId || null,
        fabricId: collection?.fabricId || collection?.collectionFabrics?.[0]?.id || null,
        collectionImages,
        collectionFabrics,
        collectionItems,
        items: products.filter(p => selectedProductIds.includes(p.id || "")),
        changes: formData.changes.map(c => {
          const changeId = c.id && c.id !== "00000000-0000-0000-0000-000000000000" ? c.id : crypto.randomUUID();
          return {
            ...c,
            id: changeId,
            collectionId,
            changeImages: (c.changeImages || []).map(img => ({
              id: img.id && img.id !== "00000000-0000-0000-0000-000000000000" ? img.id : "00000000-0000-0000-0000-000000000000",
              imageUrl: img.imageUrl,
              changeId: changeId,
              currentState: img.currentState ?? 1
            }))
          }
        }),
      }

      let success: boolean | any
      if (mode === "create") {
        success = await ApiClient.collection.create(payload)
      } else {
        success = await ApiClient.collection.update(collectionId, payload)
      }

      // Backend returns bool for create; truthy check covers both bool and object responses
      if (success === false) {
        alert("Failed to save collection. The server returned an error.")
        return
      }

      // If the server returns the created object with an id, use it for change linking
      const finalCollectionId = (typeof success === "object" && success?.id) ? success.id : collectionId

      // In edit mode, save newly-added changes (those without an id) via the changes API.
      // In create mode, changes are already included in the main payload above — skip this.
      if (mode === "edit") {
        const newChanges = formData.changes.filter(c => !c.id)
        if (newChanges.length > 0) {
          await Promise.all(
            newChanges.map(change =>
              ApiClient.changes.addChange(finalCollectionId, {
                ...change,
                collectionId: finalCollectionId,
              })
            )
          )
        }
      }

      router.push("/admin/collections")
    } catch (err) {
      console.error("Failed to save collection:", err)
      alert("Failed to save collection. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/15 bg-white/85 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-[#7B3F32] hover:bg-[#f7ebe4]">
              <Link href="/admin/collections">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7d73]">Management</p>
              <h1 className="text-2xl font-bold text-[#2f2219]">
                {mode === "create" ? "Create Collection" : "Edit Collection"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" type="button" asChild className="h-11 rounded-xl border-[#7B3F32]/20 text-[#6f6157] hover:bg-[#f7ebe4]">
              <Link href="/admin/collections">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="h-11 rounded-xl border-0 bg-gradient-to-r from-[#7B3F32] to-[#9e5948] px-6 font-semibold text-white">
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Collection" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#2f2219]">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name</Label>
                <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} required className="h-11 rounded-xl border-[#7B3F32]/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} className="min-h-32 rounded-xl border-[#7B3F32]/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#2f2219]">Pricing and Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (EGP)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={e => handleChange("price", Number(e.target.value))} className="h-11 rounded-xl border-[#7B3F32]/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input id="discount" type="number" value={formData.discountAmount} onChange={e => handleChange("discountAmount", Number(e.target.value))} className="h-11 rounded-xl border-[#7B3F32]/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" value={formData.stockNumber} onChange={e => handleChange("stockNumber", Number(e.target.value))} className="h-11 rounded-xl border-[#7B3F32]/10" />
                </div>
              </div>
              <div className="rounded-xl border border-[#7B3F32]/15 bg-[#faf4ef] px-4 py-3 text-sm text-[#6f6157]">
                Price after discount: <span className="ml-1 font-semibold text-[#7B3F32]">{discountedPrice.toLocaleString()} EGP</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#2f2219]">Collection Images</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleUploadImages(e.target.files)
                  e.target.value = ""
                }}
              />
              <div className="grid gap-4 sm:grid-cols-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-[#7B3F32]/10 bg-[#faf4ef]">
                    <Image src={getImageUrl(image)} alt={`Collection ${index + 1}`} fill className="object-cover" />
                    {image === formData.mainImage && (
                      <span className="absolute left-2 top-2 rounded-md bg-[#7B3F32] px-2 py-0.5 text-xs font-medium text-white">Main</span>
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      {image !== formData.mainImage && (
                        <Button type="button" variant="secondary" size="sm" className="h-6 bg-white/90 px-2 text-xs" onClick={() => handleChange("mainImage", image)}>Set Main</Button>
                      )}
                      <Button type="button" variant="destructive" size="icon" className="h-6 w-6" onClick={() => handleRemoveImage(image)}><X className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
                <label htmlFor="images-upload" className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#7B3F32]/20 bg-[#fffaf7] hover:bg-[#fff2ea] transition-colors">
                  <Upload className="h-8 w-8 text-[#7B3F32]" />
                  <span className="text-sm font-medium text-[#8b7d73]">{isUploading ? "Uploading..." : "Upload"}</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#2f2219]">Collection Items</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-xl border-[#7B3F32]/10 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id || `product-${index}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                      product.id && selectedProductIds.includes(product.id)
                        ? "border-[#7B3F32] bg-[#7B3F32]/5 shadow-sm"
                        : "border-slate-100 bg-white hover:border-[#7B3F32]/30"
                    )}
                    onClick={() => product.id && toggleProduct(product.id)}
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={!!product.id && selectedProductIds.includes(product.id)}
                        onChange={() => product.id && toggleProduct(product.id)}
                        className="h-5 w-5 rounded border-[#7B3F32] accent-[#7B3F32] cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-slate-50 flex-shrink-0">
                      <Image src={getImageUrl((product as any).mainImage || product.imageUrl || "")} alt={(product as any).name || product.nameEn || ""} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{(product as any).name || product.nameEn || product.nameAr}</p>
                      <p className="text-[10px] text-slate-500 truncate">{product.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[#7B3F32]/5 border border-[#7B3F32]/10">
                <p className="text-sm font-medium text-[#7B3F32]">
                  {selectedProductIds.length} items selected
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#2f2219]">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.categoryId} onValueChange={val => handleChange("categoryId", val)}>
                  <SelectTrigger className="rounded-xl border-[#7B3F32]/10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={formData.styleId} onValueChange={val => handleChange("styleId", val)}>
                  <SelectTrigger className="rounded-xl border-[#7B3F32]/10">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map(style => <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colors">Colors</Label>
                <Input id="colors" value={formData.colors} onChange={e => handleChange("colors", e.target.value)} placeholder="beige,black..." className="h-11 rounded-xl border-[#7B3F32]/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input id="material" value={formData.material} onChange={e => handleChange("material", e.target.value)} placeholder="Wood, Leather..." className="h-11 rounded-xl border-[#7B3F32]/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={formData.sku} onChange={e => handleChange("sku", e.target.value)} className="h-11 rounded-xl border-[#7B3F32]/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" value={formData.dimensions} onChange={e => handleChange("dimensions", e.target.value)} className="h-11 rounded-xl border-[#7B3F32]/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#2f2219]">Collection Fabrics</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddFabric} className="h-8 rounded-lg border-[#7B3F32]/20 text-[#7B3F32] hover:bg-[#f7ebe4]">
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.fabrics.map((fabric, index) => (
                <div key={index} className="relative rounded-xl border border-[#7B3F32]/10 bg-[#faf4ef] p-4">
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFabric(index)} className="absolute right-2 top-2 h-7 w-7 text-[#8b7d73] hover:text-red-600"><X className="h-4 w-4" /></Button>
                  <div className="space-y-3">
                    <Input value={fabric.name} onChange={e => handleFabricChange(index, "name", e.target.value)} placeholder="Fabric Name" className="h-9 text-sm rounded-lg" />
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-[#7B3F32]/10 bg-white">
                        {fabric.imageUrl ? <Image src={getImageUrl(fabric.imageUrl)} alt="Fabric" fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[#f4ebe4]"><Upload className="h-4 w-4 text-[#7B3F32]/40" /></div>}
                      </div>
                      <Input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) handleFabricImageUpload(index, file) }} className="h-9 cursor-pointer text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#2f2219]">Collection Changes</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddChange} className="h-8 rounded-lg border-[#7B3F32]/20 text-[#7B3F32] hover:bg-[#f7ebe4]">
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.changes.map((change, index) => (
                <div key={index} className="relative rounded-xl border border-[#7B3F32]/10 bg-[#faf4ef] p-4">
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveChange(index)} className="absolute right-2 top-2 h-7 w-7 text-[#8b7d73] hover:text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-[#8b7d73]">Change Name</Label>
                      <Input value={change.changeName} onChange={e => handleChangeUpdate(index, "changeName", e.target.value)} placeholder="e.g. Larger Size" className="h-9 text-sm rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-[#8b7d73]">New Name</Label>
                        <Input value={change.newName} onChange={e => handleChangeUpdate(index, "newName", e.target.value)} placeholder="Display Name" className="h-9 text-sm rounded-lg" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-[#8b7d73]">Over Price</Label>
                        <Input type="number" value={change.overPrice} onChange={e => handleChangeUpdate(index, "overPrice", Number(e.target.value))} className="h-9 text-sm rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-[#8b7d73]">New SKU</Label>
                        <Input value={change.newSKU} onChange={e => handleChangeUpdate(index, "newSKU", e.target.value)} placeholder="SKU" className="h-9 text-sm rounded-lg" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-[#8b7d73]">New Dimensions</Label>
                        <Input value={change.newDimensions} onChange={e => handleChangeUpdate(index, "newDimensions", e.target.value)} placeholder="Dimensions" className="h-9 text-sm rounded-lg" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-[#8b7d73]">New Description</Label>
                      <Textarea value={change.newDescription} onChange={e => handleChangeUpdate(index, "newDescription", e.target.value)} placeholder="Description for this variant" className="min-h-[60px] text-sm rounded-lg" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label className="text-[10px] uppercase text-[#8b7d73]">Variant Images</Label>
                      <div className="flex flex-wrap gap-2 items-center">
                        {(change.changeImages || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-[#7B3F32]/10 bg-white">
                            <Image src={getImageUrl(img.imageUrl || "")} alt="Variant" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveChangeImage(index, imgIdx)}
                              className="absolute top-0.5 right-0.5 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#7B3F32]/20 bg-[#fffaf7] hover:bg-[#fff2ea] transition-colors">
                          <Upload className="h-4 w-4 text-[#7B3F32]" />
                          <span className="text-[9px] font-medium text-[#8b7d73]">Add</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              handleUploadChangeImages(index, e.target.files)
                              e.target.value = ""
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {mode === "create" && existingCollections.length > 0 && (
            <Card className="border-[#7B3F32]/10 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#2f2219]">Existing Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {existingCollections.map(coll => (
                    <div key={coll.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-slate-50 flex-shrink-0">
                        <Image src={getImageUrl(coll.mainImage || "")} alt={coll.name || ""} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{coll.name}</p>
                        <p className="text-[10px] text-slate-500">{coll.price} EGP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
