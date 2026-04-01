"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAdminLanguage } from "@/context/admin-language-context"
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
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const { t, language, dir } = useAdminLanguage()
  const router = useRouter()

  const buildInitialImages = (item?: Product) => {
    const list = [item?.mainImage ?? "", ...(item?.images ?? [])]
      .map((value) => value?.trim())
      .filter((value) => value && value.length > 0) as string[]
    return Array.from(new Set(list))
  }

  const [formData, setFormData] = useState({
    nameEn: product?.nameEn || "",
    nameAr: product?.nameAr || "",
    descriptionEn: product?.descriptionEn || "",
    descriptionAr: product?.descriptionAr || "",
    price: product?.originalPrice ?? product?.price ?? 0,
    discountAmount: product?.discountAmount ?? 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || "",
    images: buildInitialImages(product),
    mainImage: product?.mainImage || product?.images?.[0] || "",
    colorsEn: product?.colorsEn || "",
    colorsAr: product?.colorsAr || "",
    materialEn: product?.materialEn || "",
    materialAr: product?.materialAr || "",
  })

  const [categories, setCategories] = useState<AdminCategoryDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!product) return
    setFormData({
      nameEn: product.nameEn || "",
      nameAr: product.nameAr || "",
      descriptionEn: product.descriptionEn || "",
      descriptionAr: product.descriptionAr || "",
      price: product.originalPrice ?? product.price ?? 0,
      discountAmount: product.discountAmount ?? 0,
      stock: product.stock || 0,
      categoryId: product.categoryId || "",
      images: buildInitialImages(product),
      mainImage: product.mainImage || product.images?.[0] || "",
      colorsEn: product?.colorsEn || "",
      colorsAr: product?.colorsAr || "",
      materialEn: product?.materialEn || "",
      materialAr: product?.materialAr || "",
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
      const mainImage = formData.mainImage || formData.images[0] || ""
      if (!mainImage) {
        alert(language === "ar" ? "يرجى رفع صورة رئيسية" : "Please upload a main image")
        return
      }

      const discountAmount = Math.min(
        100,
        Math.max(0, Number(formData.discountAmount) || 0)
      )
      const currentState =
        mode === "edit" && product?.status === "inactive" ? 0 : 1
      const colorsCheckEn = validateColorsInputEn(formData.colorsEn)
      const colorsCheckAr = validateColorsInputAr(formData.colorsAr)
      if (!colorsCheckEn.valid || !colorsCheckAr.valid) {
        alert(
          language === "ar"
            ? "يرجى إدخال الألوان بهذا الشكل الصحيح: لون,لون,لون"
            : "Please enter colors in the correct format: color,color,color"
        )
        return
      }

      const materialValEn = (formData.materialEn || "").trim()
      const materialValAr = (formData.materialAr || "").trim()
      const payload = {
        id: product?.id,
        nameEn: formData.nameEn,
        nameAr: formData.nameAr,
        descriptionEn: formData.descriptionEn,
        descriptionAr: formData.descriptionAr,
        price: formData.price,
        discountAmount,
        stockNumber: formData.stock,
        categoryId: formData.categoryId,
        colorsEn: colorsCheckEn.normalized,
        colorsAr: colorsCheckAr.normalized,
        materialEn: materialValEn,
        materialAr: materialValAr,
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
        if (uploadRes?.url) uploadedUrls.push(uploadRes.url)
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

  const handleChange = (field: string, value: string | number | string[]) => {
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
    const parts = trimmed.split(",").map((part) => part.trim())
    const hasEmpty = parts.some((part) => part.length === 0)
    const regex = /^[A-Za-z\s0-9\-]+(,[A-Za-z\s0-9\-]+)*$/
    if (hasEmpty || !regex.test(trimmed)) return { valid: false, normalized: trimmed }
    return { valid: true, normalized: parts.join(",") }
  }

  const validateColorsInputAr = (value: string) => {
    const standardizedStr = value.replace(/،/g, ",")
    const trimmed = standardizedStr.trim()
    if (!trimmed) return { valid: true, normalized: "" }
    const parts = trimmed.split(",").map((part) => part.trim())
    const hasEmpty = parts.some((part) => part.length === 0)
    // Allows Arabic letters, numbers, hyphens, and spaces separated by commas
    const regex = /^[\u0600-\u06FF\s0-9\-]+(,[\u0600-\u06FF\s0-9\-]+)*$/
    if (hasEmpty || !regex.test(trimmed)) return { valid: false, normalized: trimmed }
    return { valid: true, normalized: parts.join(",") }
  }

  const colorsValidationEn = validateColorsInputEn(formData.colorsEn || "")
  const showColorsErrorEn = formData.colorsEn.trim().length > 0 && !colorsValidationEn.valid

  const colorsValidationAr = validateColorsInputAr(formData.colorsAr || "")
  const showColorsErrorAr = formData.colorsAr.trim().length > 0 && !colorsValidationAr.valid

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          dir === "rtl" && "flex-row-reverse"
        )}
      >
        <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              {dir === "rtl" ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Link>
          </Button>
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "create" ? t("products.addProduct") : t("products.editProduct")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? language === "ar"
                  ? "إضافة منتج جديد إلى المتجر"
                  : "Add a new product to your store"
                : language === "ar"
                  ? "تعديل بيانات المنتج"
                  : "Edit product details"}
            </p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/products">{t("common.cancel")}</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting
              ? t("common.loading")
              : mode === "create"
                ? t("products.addProduct")
                : t("common.save")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">{t("products.productNameEn")}</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => handleChange("nameEn", e.target.value)}
                    placeholder="Enter product name in English"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">{t("products.productNameAr")}</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                    placeholder="أدخل اسم المنتج بالعربية"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">{t("products.descriptionEn")}</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => handleChange("descriptionEn", e.target.value)}
                  placeholder="Enter product description in English"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionAr">{t("products.descriptionAr")}</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => handleChange("descriptionAr", e.target.value)}
                  placeholder="أدخل وصف المنتج بالعربية"
                  dir="rtl"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {language === "ar" ? "التسعير" : "Pricing"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("products.price")} (EGP)</Label>
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
                    {language === "ar" ? "الخصم (%)" : "Discount (%)"}
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
                  <Label htmlFor="stock">{t("products.stock")}</Label>
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
                    {language === "ar" ? "السعر بعد الخصم" : "Price After Discount"}
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
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {t("products.images")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
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
                        {language === "ar" ? "رئيسية" : "Main"}
                      </span>
                    )}
                    <div className={cn("absolute bottom-2 left-2 flex items-center gap-2", dir === "rtl" && "right-2 left-auto")}>
                      {image !== formData.mainImage && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleSetMainImage(image)}
                        >
                          {language === "ar" ? "تعيين رئيسية" : "Set Main"}
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
                      ? language === "ar" ? "جاري الرفع..." : "Uploading..."
                      : language === "ar" ? "رفع صور" : "Upload Images"}
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
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {language === "ar" ? "التنظيم" : "Organization"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t("products.category")}</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "ar" ? "اختر الفئة" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === "ar" ? category.nameAr : category.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorsEn">
                  {language === "ar" ? "الألوان باللغة الإنجليزية" : "Colors English Name"}
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
                    {language === "ar"
                      ? "الصيغة الإنجليزية غير صحيحة. الصيغة الصحيحة: لون,لون,لون"
                      : "English format is invalid. Format: color,color,color"}
                  </p>
                )}
                <Label htmlFor="colorsAr">
                  {language === "ar" ? "الألوان باللغة العربية" : "Colors Arabic Name"}
                </Label>
                <Input
                  id="colorsAr"
                  value={formData.colorsAr}
                  onChange={(e) => handleChange("colorsAr", e.target.value)}
                  placeholder="أحمر,أزرق,أخضر"
                  aria-invalid={showColorsErrorAr}
                />
                {showColorsErrorAr && (
                  <p className="text-xs text-destructive">
                    {language === "ar"
                      ? "الصيغة العربية غير صحيحة. الصيغة الصحيحة: لون,لون,لون"
                      : "Arabic format is invalid. Format: color,color,color"}
                  </p>
                )}
                {!showColorsErrorEn && !showColorsErrorAr && (
                  <p className="text-xs text-muted-foreground">
                    {language === "ar"
                      ? "افصل كل لون بفاصلة."
                      : "Separate each color with a comma."}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">
                  {language === "ar" ? "الخامة باللغة الإنجليزية" : "Material English Name"}
                </Label>
                <Input
                  id="material"
                  value={formData.materialEn}
                  onChange={(e) => handleChange("materialEn", e.target.value)}
                  placeholder="Enter material (e.g. Wood)"
                />
                <Label htmlFor="material">
                  {language === "ar" ? "الخامة باللغة العربية" : "Material Arabic Name"}
                </Label>
                <Input
                  id="material"
                  value={formData.materialAr}
                  onChange={(e) => handleChange("materialAr", e.target.value)}
                  placeholder="أدخل الخامة (مثال: خشب)"
                />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
