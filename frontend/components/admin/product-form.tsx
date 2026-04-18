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
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/lib/admin-data"
import type { AdminCategoryDto } from "@/lib/admin-items"
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()

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
     categoryId: product?.categoryId || "",
     images: buildInitialImages(product),
     mainImage: product?.mainImage || product?.images?.[0] || "",
     colorsEn: product?.colorsEn || "",
     materialEn: product?.materialEn || "",
   })

  const [categories, setCategories] = useState<AdminCategoryDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

   useEffect(() => {
     if (!product) return
     setFormData({
       nameEn: product.nameEn || "",
       descriptionEn: product.descriptionEn || "",
       price: product.originalPrice ?? product.price ?? 0,
       discountAmount: product.discountAmount ?? 0,
       stock: product.stock || 0,
       categoryId: product.categoryId || "",
       images: buildInitialImages(product),
       mainImage: product.mainImage || product.images?.[0] || "",
       colorsEn: product?.colorsEn || "",
       materialEn: product?.materialEn || "",
     })
   }, [product])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiClient.get("api/admin/Categories")
        setCategories(data as AdminCategoryDto[])
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }

    fetchCategories()
  }, [])

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

      const discountAmount = Math.min(
        100,
        Math.max(0, Number(formData.discountAmount) || 0)
      )
      const currentState =
        mode === "edit" && product?.status === "inactive" ? 0 : 1
      const colorsCheckEn = validateColorsInputEn(formData.colorsEn)
      if (!colorsCheckEn.valid) {
        alert("Please enter colors in the correct format: color,color,color (no spaces, use letters, numbers, hyphens only)")
        setIsSubmitting(false)
        return
      }

       const materialValEn = (formData.materialEn || "").trim()
       const payload = {
         id: product?.id || "00000000-0000-0000-0000-000000000000",
         nameEn: formData.nameEn,
         nameAr: "", // Removed from form
         descriptionEn: formData.descriptionEn,
         descriptionAr: "", // Removed from form
         price: formData.price,
         discountAmount,
         stockNumber: formData.stock,
         categoryId: formData.categoryId,
         colorsEn: colorsCheckEn.normalized,
         colorsAr: "", // Removed from form
         materialEn: materialValEn,
         materialAr: "", // Removed from form
         mainImage,
         images: formData.images.map((url) => ({ imageUrl: url })),
         currentState,
       }


      if (mode === "create") {
        await ApiClient.post("api/admin/Item/add-item", payload)
      } else {
        await ApiClient.post("api/admin/Item/edit-item", payload)
      }

      router.push("/admin/products")
    } catch (err) {
      console.error("Failed to save product:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mergeImages = (current: string[], incoming: string[]) => {
    return Array.from(new Set([...current, ...incoming]))
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
      const nextMainImage =
        prev.mainImage === imageUrl ? nextImages[0] || "" : prev.mainImage
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

  const handleChange = (field: string, value: string | number | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const normalizedDiscount = Math.min(
    100,
    Math.max(0, Number(formData.discountAmount) || 0)
  )
  const discountedPrice = Math.max(
    0,
    Math.round(formData.price * (1 - normalizedDiscount / 100))
  )
  const validateColorsInputEn = (value: string) => {
    const standardizedStr = value.replace(/،/g, ",")
    const trimmed = standardizedStr.trim()
    if (!trimmed) return { valid: true, normalized: "" }
    
    // Remove all spaces first
    const noSpaces = trimmed.replace(/\s+/g, "")
    const parts = noSpaces.split(",").map((part) => part.trim()).filter(Boolean)
    
    if (parts.length === 0) return { valid: true, normalized: "" }
    
    // Validate that each part is valid (letters, numbers, hyphens only)
    const regex = /^[A-Za-z0-9\-]+$/
    const allValid = parts.every(part => regex.test(part))
    
    if (!allValid) return { valid: false, normalized: noSpaces }
    
    // Return normalized colors without spaces
    return { valid: true, normalized: parts.join(",") }
  }

  const colorsValidationEn = validateColorsInputEn(formData.colorsEn || "")
  const showColorsErrorEn = formData.colorsEn.trim().length > 0 && !colorsValidationEn.valid

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "create" ? "Add Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "Add a new product to your store"
                : "Edit product details"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Add Product"
                : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">Product Name</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => handleChange("descriptionEn", e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>
                Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (EGP)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountAmount">
                    Discount (%)
                  </Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) =>
                      handleChange(
                        "discountAmount",
                        Math.min(100, Math.max(0, Number(e.target.value)))
                      )
                    }
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="priceAfterDiscount">
                    Price After Discount
                  </Label>
                  <Input
                    id="priceAfterDiscount"
                    type="number"
                    value={discountedPrice}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>
                Product Images
              </CardTitle>
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
                  <div key={`${image}-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={getImageUrl(image)} alt={`Product ${index + 1}`} fill className="object-cover" />
                    {image === formData.mainImage && (
                      <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Main
                      </span>
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      {image !== formData.mainImage && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 px-2 text-xs"
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
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading
                      ? "Uploading..."
                      : "Upload Images"}
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorsEn">
                  Colors
                </Label>
                <Input
                  id="colorsEn"
                  value={formData.colorsEn}
                  onChange={(e) => handleChange("colorsEn", e.target.value)}
                  placeholder="red,blue,green"
                  aria-invalid={showColorsErrorEn}
                />
                {showColorsErrorEn && (
                  <p className="text-xs text-destructive">
                    Format: color,color,color (no spaces allowed, use letters, numbers, and hyphens only)
                  </p>
                )}
                {!showColorsErrorEn && (
                  <p className="text-xs text-muted-foreground">
                    Separate each color with a comma. No spaces allowed. Example: red,blue,dark-green
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="materialEn">
                  Material
                </Label>
                <Input
                  id="materialEn"
                  value={formData.materialEn}
                  onChange={(e) => handleChange("materialEn", e.target.value)}
                  placeholder="Enter material (e.g. Wood)"
                 />
               </div>

              </CardContent>
            </Card>
        </div>
      </div>
    </form>
  )
}

