"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Product } from "@/lib/admin-data"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface TopProductsCardProps {
  products: Product[]
  className?: string
}

export function TopProductsCard({ products, className }: TopProductsCardProps) {
  const { t, language, dir } = useAdminLanguage()

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn("text-base font-medium", dir === "rtl" && "text-right")}>
          {t("dashboard.topProducts")}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products" className="flex items-center gap-1">
            {t("common.viewAll")}
            {dir === "rtl" ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {products
            .filter((p) => p.featured)
            .slice(0, 5)
            .map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className={cn(
                  "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                  dir === "rtl" && "flex-row-reverse"
                )}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={language === "ar" ? product.nameAr : product.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={cn("flex-1 min-w-0", dir === "rtl" && "text-right")}>
                  <p className="font-medium truncate">
                    {language === "ar" ? product.nameAr : product.nameEn}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("products.stock")}: {product.stock}
                  </p>
                </div>
                <div className={cn("flex flex-col items-end gap-1", dir === "rtl" && "items-start")}>
                  <span className="font-medium">{formatCurrency(product.price)}</span>
                  {product.onSale && (
                    <Badge variant="secondary" className="text-xs">
                      {language === "ar" ? "عرض" : "Sale"}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
