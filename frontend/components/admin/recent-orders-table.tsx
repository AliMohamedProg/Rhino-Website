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
    const statusConfig: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-amber-100 text-amber-700 border-amber-200", label: "Pending" },
      processing: { className: "bg-cyan-100 text-cyan-700 border-cyan-200", label: "Processing" },
      shipped: { className: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "Shipped" },
      delivered: { className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Delivered" },
      cancelled: { className: "bg-rose-100 text-rose-700 border-rose-200", label: "Cancelled" },
      refunded: { className: "bg-violet-100 text-violet-700 border-violet-200", label: "Refunded" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge className={cn("border font-medium text-xs inline-flex items-center gap-1.5", config.className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} EGP`

  return (
    <Card className={cn("border-[#7B3F32]/12 bg-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#7B3F32]/10 bg-[#fbf5ef]">
        <CardTitle className="text-base font-semibold text-[#2f2219]">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-[#7B3F32] hover:text-[#5f3026] hover:bg-[#f5e9dd]">
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-medium">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7efe7]">
                <th className="px-4 py-3 text-xs font-semibold text-[#7c6f65] uppercase tracking-wider text-left">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#7c6f65] uppercase tracking-wider text-left">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#7c6f65] uppercase tracking-wider text-left">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#7c6f65] uppercase tracking-wider text-left">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#7c6f65] uppercase tracking-wider text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-[#7B3F32]/8 hover:bg-[#fdf8f3] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#2f2219] hover:text-[#7B3F32] transition-colors">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#2f2219]">{order.customer.name}</p>
                    <p className="text-sm text-[#85776d]">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#2f2219]">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-sm text-[#85776d]">{new Date(order.createdDate).toLocaleDateString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
