"use client"

import { useState } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/admin/data-table"
import { mockOrders, type Order } from "@/lib/admin-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Eye, Download, Filter } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const { t, language, dir } = useAdminLanguage()
  const [orders, setOrders] = useState(mockOrders)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter)

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, labelEn: "Pending", labelAr: "قيد الانتظار", className: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
      processing: { variant: "default" as const, labelEn: "Processing", labelAr: "قيد المعالجة", className: "bg-blue-500" },
      shipped: { variant: "outline" as const, labelEn: "Shipped", labelAr: "تم الشحن", className: "border-blue-500 text-blue-500" },
      delivered: { variant: "default" as const, labelEn: "Delivered", labelAr: "تم التوصيل", className: "bg-emerald-500" },
      cancelled: { variant: "destructive" as const, labelEn: "Cancelled", labelAr: "ملغي", className: "" },
      refunded: { variant: "secondary" as const, labelEn: "Refunded", labelAr: "مسترد", className: "" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  const columns = [
    {
      key: "orderNumber",
      header: t("orders.orderNumber"),
      render: (order: Order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-medium text-primary hover:underline"
        >
          {order.orderNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: t("orders.customer"),
      render: (order: Order) => (
        <div className={cn(dir === "rtl" && "text-right")}>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-sm text-muted-foreground">{order.customer.email}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: t("orders.items"),
      render: (order: Order) => (
        <span className="text-muted-foreground">
          {order.items.length} {language === "ar" ? "عنصر" : "items"}
        </span>
      ),
    },
    {
      key: "total",
      header: t("orders.total"),
      render: (order: Order) => (
        <span className="font-medium">{formatCurrency(order.total)}</span>
      ),
    },
    {
      key: "status",
      header: t("orders.status"),
      render: (order: Order) => getStatusBadge(order.status),
    },
    {
      key: "date",
      header: t("orders.date"),
      render: (order: Order) => (
        <span className="text-muted-foreground">
          {new Date(order.createdDate).toLocaleDateString(
            language === "ar" ? "ar-EG" : "en-US"
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (order: Order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {t("orders.viewDetails")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t("orders.updateStatus")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
              {language === "ar" ? "قيد المعالجة" : "Processing"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
              {language === "ar" ? "تم الشحن" : "Shipped"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
              {language === "ar" ? "تم التوصيل" : "Delivered"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleStatusChange(order.id, "cancelled")}
            >
              {language === "ar" ? "ملغي" : "Cancelled"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]",
    },
  ]

  const statusOptions = [
    { value: "all", labelEn: "All", labelAr: "الكل" },
    { value: "pending", labelEn: "Pending", labelAr: "قيد الانتظار" },
    { value: "processing", labelEn: "Processing", labelAr: "قيد المعالجة" },
    { value: "shipped", labelEn: "Shipped", labelAr: "تم الشحن" },
    { value: "delivered", labelEn: "Delivered", labelAr: "تم التوصيل" },
    { value: "cancelled", labelEn: "Cancelled", labelAr: "ملغي" },
    { value: "refunded", labelEn: "Refunded", labelAr: "مسترد" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          dir === "rtl" && "flex-row-reverse"
        )}
      >
        <div className={cn(dir === "rtl" && "text-right")}>
          <h1 className="text-2xl font-bold tracking-tight">{t("orders.title")}</h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? `إدارة ${orders.length} طلب`
              : `Manage ${orders.length} orders`}
          </p>
        </div>
        <Button variant="outline">
          <Download className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("common.export")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={cn(
              "flex items-center gap-4 mb-4",
              dir === "rtl" && "flex-row-reverse"
            )}
          >
            <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("common.filter")}:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {language === "ar" ? option.labelAr : option.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataTable
            data={filteredOrders}
            columns={columns}
            searchPlaceholder={language === "ar" ? "البحث عن طلب..." : "Search orders..."}
            searchKey="orderNumber"
          />
        </CardContent>
      </Card>
    </div>
  )
}
