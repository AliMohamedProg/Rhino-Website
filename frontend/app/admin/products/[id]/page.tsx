"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockProducts } from "@/lib/admin-data"
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { t, language, dir } = useAdminLanguage()

  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">{language === "ar" ? "المنتج غير موجود" : "Product not found"}</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/products">{t("common.back")}</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: typeof product.status) => {
    const statusConfig = {
      active: { variant: "default" as const, labelEn: "Active", labelAr: "نشط", className: "bg-emerald-500" },
      inactive: { variant: "secondary" as const, labelEn: "Inactive", labelAr: "غير نشط", className: "" },
      draft: { variant: "outline" as const, labelEn: "Draft", labelAr: "مسودة", className: "" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  return (
    <div className="space-y-6">
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
              {language === "ar" ? product.nameAr : product.nameEn}
            </h1>
            <p className="text-muted-foreground">{product.sku}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${id}/edit`} className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
              <Pencil className="h-4 w-4" />
              {t("common.edit")}
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
            {t("products.deleteProduct")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {t("products.images")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {t("products.description")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">English</h4>
                <p>{product.descriptionEn}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">العربية</h4>
                <p dir="rtl">{product.descriptionAr}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {t("products.status")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.status")}</span>
                {getStatusBadge(product.status)}
              </div>
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.featured")}</span>
                <Badge variant={product.featured ? "default" : "secondary"}>
                  {product.featured ? (language === "ar" ? "نعم" : "Yes") : (language === "ar" ? "لا" : "No")}
                </Badge>
              </div>
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.onSale")}</span>
                <Badge variant={product.onSale ? "default" : "secondary"}>
                  {product.onSale ? (language === "ar" ? "نعم" : "Yes") : (language === "ar" ? "لا" : "No")}
                </Badge>
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
            <CardContent className="space-y-3">
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.price")}</span>
                <span className="font-semibold">{formatCurrency(product.price)}</span>
              </div>
              {product.originalPrice && (
                <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                  <span className="text-muted-foreground">{t("products.originalPrice")}</span>
                  <span className="line-through text-muted-foreground">{formatCurrency(product.originalPrice)}</span>
                </div>
              )}
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.stock")}</span>
                <span className={cn("font-medium", product.stock <= 10 && "text-destructive")}>
                  {product.stock}
                </span>
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
            <CardContent className="space-y-3">
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.category")}</span>
                <span>{product.category}</span>
              </div>
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.sku")}</span>
                <span className="font-mono">{product.sku}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
