"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { cn, getImageUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/lib/admin-data"
import type { AdminCategoryDto } from "@/lib/admin-items"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MOCK_BRANDS } from "@/lib/mock-admin-data"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

interface FabricItem {
  name: string
  imageUrl: string
  file?: File
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()

  const buildInitialFabrics = (item?: Product): FabricItem[] => (
    Array.isArray(item?.fabrics)
      ? item!.fabrics.map((fabric) => ({
          name: fabric.name || "",
          imageUrl: fabric.imageUrl || "",
        }))
      : []
  )

  const buildInitialImages = (item?: Product) => {
    const list = [item?.mainImage ?? "", ...(item?.images ?? [])]
      .map((value) => value?.trim())
      .filter((value) => value && value.length > 0) as string[]

    return Array.from(new Set(list))
  }

  const [formData, setFormData] = useState({
    nameEn: product?.nameEn || "",
    descriptionEn: product?.descriptionEn || "",
    price: product?.originalPrice ?? product?.price ?? 0,
    discountAmount: product?.discountAmount ?? 0,
    stock: product?.stock || 0,
    sku: product?.sku || "",
    dimensions: product?.dimensions || "",
    categoryId: product?.categoryId || "",
    styleId: product?.styleId || "",
    images: buildInitialImages(product),
    mainImage: product?.mainImage || product?.images?.[0] || "",
    colorsEn: product?.colorsEn || "",
    materialEn: product?.materialEn || "",
    brandId: "",
    fabrics: buildInitialFabrics(product),
  })

  const [styles, setStyles] = useState<AdminCategoryDto[]>([])
  const [categories, setCategories] = useState<AdminCategoryDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingFabric, setIsUploadingFabric] = useState(false)

  useEffect(() => {
    if (!product) return

    setFormData({
      nameEn: product.nameEn || "",
      descriptionEn: product.descriptionEn || "",
      price: product.originalPrice ?? product.price ?? 0,
      discountAmount: product.discountAmount ?? 0,
      stock: product.stock || 0,
      sku: product.sku || "",
      dimensions: product.dimensions || "",
      categoryId: product.categoryId || "",
      styleId: product.styleId || "",
      images: buildInitialImages(product),
      mainImage: product.mainImage || product.images?.[0] || "",
      colorsEn: product.colorsEn || "",
      materialEn: product.materialEn || "",
      brandId: "",
      fabrics: buildInitialFabrics(product),
    })
  }, [product])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [stylesData, catsData] = await Promise.all([
          ApiClient.get("api/admin/Styles"),
          ApiClient.get("api/admin/Categories")
        ])
        setStyles(stylesData as AdminCategoryDto[])
        setCategories(catsData as AdminCategoryDto[])
      } catch (err) {
        console.error("Failed to fetch organizational data:", err)
      }
    }

    fetchInitialData()
  }, [])

  const mergeImages = (current: string[], incoming: string[]) => Array.from(new Set([...current, ...incoming]))

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
          const nextImages = mergeImages(prev.images, uploadedUrls)
          const nextMainImage = prev.mainImage || uploadedUrls[0] || ""
          return {
            ...prev,
            images: nextImages,
            mainImage: nextMainImage,
          }
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

      return {
        ...prev,
        images: nextImages,
        mainImage: nextMainImage,
      }
    })
  }

  const handleSetMainImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: imageUrl,
    }))
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

  const handleChange = (field: string, value: string | number | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateColorsInputEn = (value: string) => {
    const standardizedStr = value.replace(/،/g, ",")
    const trimmed = standardizedStr.trim()
    if (!trimmed) return { valid: true, normalized: "" }

    const noSpaces = trimmed.replace(/\s+/g, "")
    const parts = noSpaces.split(",").map((part) => part.trim()).filter(Boolean)
    if (parts.length === 0) return { valid: true, normalized: "" }

    const regex = /^[A-Za-z0-9\-]+$/
    const allValid = parts.every((part) => regex.test(part))
    if (!allValid) return { valid: false, normalized: noSpaces }

    return { valid: true, normalized: parts.join(",") }
  }

  const normalizedDiscount = Math.min(100, Math.max(0, Number(formData.discountAmount) || 0))
  const discountedPrice = Math.max(0, Math.round(formData.price * (1 - normalizedDiscount / 100)))

  const colorsValidationEn = validateColorsInputEn(formData.colorsEn || "")
  const showColorsErrorEn = formData.colorsEn.trim().length > 0 && !colorsValidationEn.valid

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.categoryId) {
        alert("Please select a category")
        setIsSubmitting(false)
        return
      }

      const mainImage = formData.mainImage || formData.images[0] || ""
      if (!mainImage) {
        alert("Please upload a main image")
        setIsSubmitting(false)
        return
      }

      const discountAmount = Math.min(100, Math.max(0, Number(formData.discountAmount) || 0))
      const currentState = mode === "edit" && product?.status === "inactive" ? 0 : 1
      const productId = product?.id || "00000000-0000-0000-0000-000000000000"
      const fabrics = formData.fabrics
        .map((fabric) => ({
          name: (fabric.name || "").trim(),
          imageUrl: (fabric.imageUrl || "").trim(),
        }))
        .filter((fabric) => fabric.name.length > 0 && fabric.imageUrl.length > 0)
        .map((fabric) => ({
          ...fabric,
          productId,
        }))

      if (!colorsValidationEn.valid) {
        alert("Please enter colors in this format: color,color,color")
        setIsSubmitting(false)
        return
      }

      const payload = {
        id: productId,
        nameEn: formData.nameEn,
        nameAr: "",
        descriptionEn: formData.descriptionEn,
        descriptionAr: "",
        price: formData.price,
        discountAmount,
        stockNumber: formData.stock,
        sku: formData.sku.trim(),
        dimensions: formData.dimensions.trim(),
        categoryId: formData.categoryId,
        styleId: formData.styleId || null,
        colorsEn: colorsValidationEn.normalized,
        colorsAr: "",
        materialEn: (formData.materialEn || "").trim(),
        materialAr: "",
        mainImage,
        images: formData.images.map((url) => ({ imageUrl: url })),
        fabrics,
        currentState,
      }

      let result: any
      if (mode === "create") {
        result = await ApiClient.post("api/admin/Item/add-item", payload)
      } else {
        result = await ApiClient.post("api/admin/Item/edit-item", payload)
      }

      // Backend returns false if the DB save failed (e.g. FK violation)
      if (result === false) {
        alert("Failed to save product. Please check that a valid Category is selected.")
        return
      }


      router.push("/admin/products")
    } catch (err) {
      console.error("Failed to save product:", err)
      alert("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#8f3f2a]/15 bg-white/85 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-[#d66a49]/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-[#c7aea2]/26 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-[#8f3f2a] hover:bg-[#f7ebe4]">
              <Link href="/admin/products">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7d73]">Catalog</p>
              <h1 className="admin-title text-2xl font-bold">
                {mode === "create" ? "Create Product" : "Edit Product"}
              </h1>
              <p className="admin-subtitle mt-1 text-sm">
                {mode === "create"
                  ? "Add full product details including images, style and pricing"
                  : "Update product details, media and inventory settings"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              type="button"
              asChild
              className="h-11 rounded-xl border-[#8f3f2a]/20 text-[#6f6157] hover:bg-[#f7ebe4]"
            >
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="h-11 rounded-xl border-0 bg-gradient-to-r from-[#8f3f2a] to-[#c16043] px-6 font-semibold text-white"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn" className="text-sm font-semibold text-[#4b3d34]">
                  Product Name
                </Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  placeholder="Enter product name"
                  className="admin-input h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionEn" className="text-sm font-semibold text-[#4b3d34]">
                  Description
                </Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => handleChange("descriptionEn", e.target.value)}
                  placeholder="Write a detailed product description"
                  className="admin-input min-h-28"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Pricing and Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-semibold text-[#4b3d34]">
                    Price (EGP)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                    min={0}
                    className="admin-input h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountAmount" className="text-sm font-semibold text-[#4b3d34]">
                    Discount (%)
                  </Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) => handleChange("discountAmount", Math.min(100, Math.max(0, Number(e.target.value))))}
                    min={0}
                    max={100}
                    className="admin-input h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-semibold text-[#4b3d34]">
                    Stock Quantity
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", Number(e.target.value))}
                    min={0}
                    className="admin-input h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-semibold text-[#4b3d34]">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="SOF-001"
                    className="admin-input h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions" className="text-sm font-semibold text-[#4b3d34]">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleChange("dimensions", e.target.value)}
                    placeholder="220x95x80 cm"
                    className="admin-input h-11"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#8f3f2a]/15 bg-[#faf4ef] px-4 py-3 text-sm text-[#6f6157]">
                Price after discount: <span className="ml-1 font-semibold text-[#8f3f2a]">{discountedPrice.toLocaleString()} EGP</span>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                id="product-images-upload"
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
                  <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-[#8f3f2a]/10 bg-[#f4ebe4]">
                    <Image src={getImageUrl(image)} alt={`Product ${index + 1}`} fill className="object-cover" />

                    {image === formData.mainImage && (
                      <span className="absolute left-2 top-2 rounded-md bg-[#8f3f2a] px-2 py-0.5 text-xs font-medium text-white">
                        Main
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      {image !== formData.mainImage && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 bg-white/90 px-2 text-xs"
                          onClick={() => handleSetMainImage(image)}
                        >
                          Set Main
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <label
                  htmlFor="product-images-upload"
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#8f3f2a]/28 bg-[#fffaf7] transition-colors hover:bg-[#fff2ea]"
                >
                  <Upload className="h-8 w-8 text-[#8f3f2a]" />
                  <span className="text-sm font-medium text-[#7c6f65]">{isUploading ? "Uploading..." : "Upload"}</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="admin-title text-xl">Product Fabrics</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFabric}
                className="h-8 rounded-lg border-[#8f3f2a]/20 text-[#8f3f2a] hover:bg-[#f7ebe4]"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Fabric
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.fabrics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-[#8b7d73]">No fabrics added yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {formData.fabrics.map((fabric, index) => (
                    <div key={index} className="relative rounded-xl border border-[#8f3f2a]/10 bg-[#faf4ef] p-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFabric(index)}
                        className="absolute right-2 top-2 h-7 w-7 text-[#8b7d73] hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-[#4b3d34]">Fabric Name</Label>
                          <Input
                            value={fabric.name}
                            onChange={(e) => handleFabricChange(index, "name", e.target.value)}
                            placeholder="e.g. Velvet, Cotton"
                            className="admin-input h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-[#4b3d34]">Fabric Image</Label>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-[#8f3f2a]/10 bg-white">
                              {fabric.imageUrl ? (
                                <Image src={getImageUrl(fabric.imageUrl)} alt="Fabric" fill className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#f4ebe4]">
                                  <Upload className="h-4 w-4 text-[#8f3f2a]/40" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFabricImageUpload(index, file)
                                }}
                                className="h-9 cursor-pointer text-xs file:mr-2 file:cursor-pointer file:border-0 file:bg-[#8f3f2a] file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="admin-card border-[#8f3f2a]/15">
            <CardHeader>
              <CardTitle className="admin-title text-xl">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-[#4b3d34]">
                  Category
                </Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleChange("categoryId", value)}>
                  <SelectTrigger className="admin-input h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#8f3f2a]/15 bg-white shadow-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style" className="text-sm font-semibold text-[#4b3d34]">
                  Style
                </Label>
                <Select value={formData.styleId} onValueChange={(value) => handleChange("styleId", value)}>
                  <SelectTrigger className="admin-input h-11">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#8f3f2a]/15 bg-white shadow-xl">
                    {styles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-semibold text-[#4b3d34]">
                  Brand
                </Label>
                <Select value={formData.brandId} onValueChange={(value) => handleChange("brandId", value)}>
                  <SelectTrigger className="admin-input h-11">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#8f3f2a]/15 bg-white shadow-xl">
                    {MOCK_BRANDS.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorsEn" className="text-sm font-semibold text-[#4b3d34]">
                  Colors
                </Label>
                <Input
                  id="colorsEn"
                  value={formData.colorsEn}
                  onChange={(e) => handleChange("colorsEn", e.target.value)}
                  placeholder="beige,black,oak"
                  aria-invalid={showColorsErrorEn}
                  className={cn("admin-input h-11", showColorsErrorEn && "border-red-500")}
                />
                {showColorsErrorEn ? (
                  <p className="text-xs text-red-600">Use only letters, numbers, and hyphens separated by commas.</p>
                ) : (
                  <p className="text-xs text-[#8b7d73]">Example: off-white,black,matte-oak</p>
                )}
              </div>



              <div className="space-y-2">
                <Label htmlFor="materialEn" className="text-sm font-semibold text-[#4b3d34]">
                  Material
                </Label>
                <Input
                  id="materialEn"
                  value={formData.materialEn}
                  onChange={(e) => handleChange("materialEn", e.target.value)}
                  placeholder="Wood, Fabric, Metal..."
                  className="admin-input h-11"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
