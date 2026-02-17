"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Order } from "@/lib/admin-data"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface RecentOrdersTableProps {
  orders: Order[]
  className?: string
}

export function RecentOrdersTable({ orders, className }: RecentOrdersTableProps) {
  const { t, language, dir } = useAdminLanguage()

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, labelEn: "Pending", labelAr: "قيد الانتظار" },
      processing: { variant: "default" as const, labelEn: "Processing", labelAr: "قيد المعالجة" },
      shipped: { variant: "outline" as const, labelEn: "Shipped", labelAr: "تم الشحن" },
      delivered: { variant: "default" as const, labelEn: "Delivered", labelAr: "تم التوصيل" },
      cancelled: { variant: "destructive" as const, labelEn: "Cancelled", labelAr: "ملغي" },
      refunded: { variant: "secondary" as const, labelEn: "Refunded", labelAr: "مسترد" },
    }

    const config = statusConfig[status]
    return (
      <Badge
        variant={config.variant}
        className={cn(
          status === "delivered" && "bg-emerald-500 hover:bg-emerald-600",
          status === "processing" && "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn("text-base font-medium", dir === "rtl" && "text-right")}>
          {t("dashboard.recentOrders")}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-1">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-muted-foreground",
                    dir === "rtl" ? "text-right" : "text-left"
                  )}
                >
                  {t("orders.orderNumber")}
                </th>
                <th
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-muted-foreground",
                    dir === "rtl" ? "text-right" : "text-left"
                  )}
                >
                  {t("orders.customer")}
                </th>
                <th
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-muted-foreground",
                    dir === "rtl" ? "text-right" : "text-left"
                  )}
                >
                  {t("orders.total")}
                </th>
                <th
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-muted-foreground",
                    dir === "rtl" ? "text-right" : "text-left"
                  )}
                >
                  {t("orders.status")}
                </th>
                <th
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-muted-foreground",
                    dir === "rtl" ? "text-right" : "text-left"
                  )}
                >
                  {t("orders.date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className={cn("px-4 py-3", dir === "rtl" ? "text-right" : "text-left")}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className={cn("px-4 py-3", dir === "rtl" ? "text-right" : "text-left")}>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className={cn("px-4 py-3 font-medium", dir === "rtl" ? "text-right" : "text-left")}>
                    {formatCurrency(order.total)}
                  </td>
                  <td className={cn("px-4 py-3", dir === "rtl" ? "text-right" : "text-left")}>
                    {getStatusBadge(order.status)}
                  </td>
                  <td className={cn("px-4 py-3 text-muted-foreground", dir === "rtl" ? "text-right" : "text-left")}>
                    {new Date(order.createdDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
