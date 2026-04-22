"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/admin-data"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { mapAdminItemToProduct, type AdminCategoryDto, type AdminItemDto } from "@/lib/admin-items"
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { t, language, dir } = useAdminLanguage()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const [items, categories] = await Promise.all([
          ApiClient.get("api/admin/Item"),
          ApiClient.get("api/admin/Categories"),
        ])

        const found = (items as AdminItemDto[]).find((item) => item.id === id)
        if (found) {
          setProduct(mapAdminItemToProduct(found, categories as AdminCategoryDto[]))
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error("Failed to fetch product:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
        {t("common.loading")}
      </div>
    )
  }

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

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[#7B3F32]/10 shadow-[0_14px_40px_rgba(0,0,0,0.03)] relative overflow-hidden",
          dir === "rtl" && "flex-row-reverse"
        )}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#7B3F32]/5 blur-2xl z-0" />
        <div className={cn("flex items-center gap-4 relative z-10", dir === "rtl" && "flex-row-reverse")}>
          <Button variant="ghost" size="icon" asChild className="hover:bg-[#f6eee8] text-[#7B3F32] h-11 w-11 rounded-xl">
            <Link href="/admin/products">
              {dir === "rtl" ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Link>
          </Button>
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold tracking-tight text-[#2f2219]">
              {language === "ar" ? product.nameAr : product.nameEn}
            </h1>
            <p className="text-[#8b7d73] font-medium mt-1">{product.sku}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-3 relative z-10", dir === "rtl" && "flex-row-reverse")}>
          <Button variant="outline" asChild className="rounded-xl border-[#7B3F32]/20 hover:bg-[#A6ACA2]/10 text-[#7B3F32] h-11 font-bold shadow-sm">
            <Link href={`/admin/products/${id}/edit`} className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
              <Pencil className="h-4 w-4" />
              {t("common.edit")}
            </Link>
          </Button>
          <Button variant="destructive" className="rounded-xl h-11 font-bold bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white shadow-none transition-all">
            <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
            {t("products.deleteProduct")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
            <CardHeader>
              <CardTitle className={cn("text-[#2f2219]", dir === "rtl" && "text-right")}>
                {t("products.images")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {(product.images.length ? product.images : [product.mainImage || "/placeholder.svg"]).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
            <CardHeader>
              <CardTitle className={cn("text-[#2f2219]", dir === "rtl" && "text-right")}>
                {t("products.description")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">English</h4>
                <p>{product.descriptionEn}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Pricing */}
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
            <CardHeader>
              <CardTitle className={cn("text-[#2f2219]", dir === "rtl" && "text-right")}>
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
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
            <CardHeader>
              <CardTitle className={cn("text-[#2f2219]", dir === "rtl" && "text-right")}>
                {language === "ar" ? "التنظيم" : "Organization"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <span className="text-muted-foreground">{t("products.category")}</span>
                <span>{product.category}</span>
              </div>
              {product.colorsEn && product.colorsEn.trim().length > 0 && (
                <div className="space-y-2">
                  <span className="text-muted-foreground">
                    {language === "ar" ? "الألوان" : "Colors"}
                  </span>
                  <div className={cn("flex flex-wrap gap-2", dir === "rtl" && "justify-end")}>
                    {product.colorsEn.split(",").map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {color.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.materialEn && product.materialEn.trim().length > 0 && (
                <div className="space-y-1">
                  <span className="text-muted-foreground block">
                    {language === "ar" ? "المادة" : "Material"}
                  </span>
                  <span className={cn("block", dir === "rtl" && "text-right")}>
                    {language === "ar" ? product.materialAr : product.materialEn}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
