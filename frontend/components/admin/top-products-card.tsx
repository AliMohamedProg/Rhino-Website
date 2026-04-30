"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Product } from "@/lib/admin-data"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface TopProductsCardProps {
  products: Product[]
  className?: string
}

export function TopProductsCard({ products, className }: TopProductsCardProps) {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} EGP`
  }

  return (
    <Card className={cn("overflow-hidden border-[#7B3F32]/12 bg-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#7B3F32]/10 bg-[#fbf5ef]">
        <CardTitle className="text-base font-medium text-[#2f2219]">
          Top Selling Products
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-[#7B3F32] hover:text-[#5f3026] hover:bg-[#f5e9dd]">
          <Link href="/admin/products" className="flex items-center gap-1 text-sm font-medium">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[#7B3F32]/8">
          {products
            .filter((p) => p.featured)
            .slice(0, 5)
            .map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center gap-4 p-4 hover:bg-[#fdf8f3] transition-colors"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[#f7efe7] border border-[#7B3F32]/10">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-[#2f2219]">
                    {product.nameEn}
                  </p>
                  <p className="text-sm text-[#85776d]">
                    Stock: {product.stock}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-medium text-[#2f2219]">{formatCurrency(product.price)}</span>
                  {product.onSale && (
                    <Badge variant="secondary" className="text-xs bg-[#f5e9dd] text-[#7B3F32] border-[#7B3F32]/15">
                      Sale
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
