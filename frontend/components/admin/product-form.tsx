"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product, mockCategories } from "@/lib/admin-data"
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

  const [formData, setFormData] = useState({
    nameEn: product?.nameEn || "",
    nameAr: product?.nameAr || "",
    descriptionEn: product?.descriptionEn || "",
    descriptionAr: product?.descriptionAr || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || "",
    status: product?.status || "draft",
    featured: product?.featured || false,
    onSale: product?.onSale || false,
    sku: product?.sku || "",
    images: product?.images || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, this would call an API
    console.log("Form submitted:", formData)

    setIsSubmitting(false)
    router.push("/admin/products")
  }

  const handleChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
          <Button type="submit" disabled={isSubmitting}>
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
                  <Label htmlFor="originalPrice">{t("products.originalPrice")} (EGP)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleChange("originalPrice", Number(e.target.value))}
                    min={0}
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
              <div className="grid gap-4 sm:grid-cols-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} fill className="object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() =>
                        handleChange(
                          "images",
                          formData.images.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <button
                  type="button"
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {language === "ar" ? "رفع صورة" : "Upload"}
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {language === "ar" ? "الحالة والظهور" : "Status & Visibility"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">{t("products.status")}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("products.active")}</SelectItem>
                    <SelectItem value="inactive">{t("products.inactive")}</SelectItem>
                    <SelectItem value="draft">{t("products.draft")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <Label htmlFor="featured">{t("products.featured")}</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange("featured", checked)}
                />
              </div>
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <Label htmlFor="onSale">{t("products.onSale")}</Label>
                <Switch
                  id="onSale"
                  checked={formData.onSale}
                  onCheckedChange={(checked) => handleChange("onSale", checked)}
                />
              </div>
            </CardContent>
          </Card>

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
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === "ar" ? category.nameAr : category.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">{t("products.sku")}</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="SKU-001"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
