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
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          Top Selling Products
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products" className="flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
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
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {product.nameEn}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-medium">{formatCurrency(product.price)}</span>
                  {product.onSale && (
                    <Badge variant="secondary" className="text-xs">
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
