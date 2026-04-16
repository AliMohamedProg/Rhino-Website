"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Order } from "@/lib/admin-data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RecentOrdersTableProps {
  orders: Order[]
  className?: string
}

export function RecentOrdersTable({ orders, className }: RecentOrdersTableProps) {
  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      processing: { variant: "default" as const, label: "Processing" },
      shipped: { variant: "outline" as const, label: "Shipped" },
      delivered: { variant: "default" as const, label: "Delivered" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
      refunded: { variant: "secondary" as const, label: "Refunded" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge
        variant={config.variant}
        className={cn(
          status === "delivered" && "bg-emerald-500 hover:bg-emerald-600",
          status === "processing" && "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} EGP`
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          Recent Orders
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground text-left">
                  Order Number
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground text-left">
                  Customer
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground text-left">
                  Total
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground text-left">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-left">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-left">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-left">
                    {new Date(order.createdDate).toLocaleDateString("en-US")}
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


