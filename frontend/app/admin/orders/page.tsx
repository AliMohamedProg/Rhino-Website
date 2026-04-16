"use client"

import { useEffect, useState } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/admin/data-table"
import { type Order } from "@/lib/admin-data"
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
import { exportOrdersExcel, exportOrdersPdf } from "@/app/ApiHelper/ExportApi"

type ApiOrderItem = {
  itemId?: string
  productId?: string
  nameEn?: string
  nameAr?: string
  qty?: number
  quantity?: number
  unitPrice?: number
  price?: number
}

type ApiOrder = {
  id?: string
  userId?: string
  orderNumber?: string
  orderDate?: string
  createdDate?: string
  delivryDate?: string
  address?: string
  city?: string
  country?: string
  email?: string
  phoneNumber?: string
  firstName?: string
  lastName?: string
  status?: string
  paymentStatus?: string
  total?: number
  tbOrderItems?: ApiOrderItem[]
  paymentMethod?: string
  paymentMethodName?: string
}

const normalizeStatus = (status?: string | null): Order["status"] => {
  if (!status) return "pending"
  const normalized = status.toLowerCase()
  if (normalized.includes("pending")) return "pending"
  if (normalized.includes("process")) return "processing"
  if (normalized.includes("ship")) return "shipped"
  if (normalized.includes("deliver")) return "delivered"
  if (normalized.includes("cancel")) return "cancelled"
  if (normalized.includes("refund")) return "refunded"
  return "pending"
}

const isGuid = (value: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)

const mapApiOrder = (apiOrder: ApiOrder, index: number): Order => {
  const safeEmail = apiOrder.email?.trim() || ""
  const safePhone = apiOrder.phoneNumber || ""
  const safeFirstName = apiOrder.firstName?.trim() || ""
  const safeLastName = apiOrder.lastName?.trim() || ""
  const safeName = safeFirstName && safeLastName
    ? `${safeFirstName} ${safeLastName}`
    : safeEmail ? safeEmail.split("@")[0] : safePhone || `Customer ${index + 1}`
  const items = Array.isArray(apiOrder.tbOrderItems) ? apiOrder.tbOrderItems : []
  const mappedItems = items.map((item, itemIndex) => {
    const price = Number(item.unitPrice ?? item.price ?? 0)
    const quantity = Number(item.qty ?? item.quantity ?? 0)
    return {
      productId: item.itemId || item.productId || `item-${index}-${itemIndex}`,
      productName: item.nameEn || item.nameAr || "Item",
      quantity: Number.isFinite(quantity) ? quantity : 0,
      price: Number.isFinite(price) ? price : 0,
    }
  })
  const subtotal = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Number(apiOrder.total ?? subtotal)
  const createdDate = apiOrder.orderDate || apiOrder.createdDate || new Date().toISOString()
  const updatedAt = apiOrder.delivryDate || createdDate

  return {
    id: apiOrder.id || `order-${index}`,
    orderNumber: apiOrder.orderNumber || `ORD-${String(index + 1).padStart(4, "0")}`,
    customer: {
      id: apiOrder.userId || `customer-${index}`,
      name: safeName || "Customer",
      email: safeEmail,
      phone: safePhone,
    },
    items: mappedItems,
    subtotal,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: Number.isFinite(total) ? total : subtotal,
    status: normalizeStatus(apiOrder.status),
    paymentMethod: apiOrder.paymentStatus || "Unknown",
    paymentMethodName: apiOrder.paymentMethodName || "Unknown",
    shippingAddress: {
      street: apiOrder.address || "",
      city: apiOrder.city || "",
      state: "",
      country: apiOrder.country || "",
      postalCode: "",
    },
    createdDate,
    updatedAt,
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    let isMounted = true

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const data = await ApiClient.get("api/admin/Orders")
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.orders)
            ? data.orders
            : Array.isArray(data?.data)
              ? data.data
              : []
        const mapped = list.map((order: ApiOrder, index: number) => mapApiOrder(order, index))
        if (isMounted) setOrders(mapped)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        if (isMounted) setLoadError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchOrders()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter)

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending", className: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
      processing: { variant: "default" as const, label: "Processing", className: "bg-blue-500" },
      shipped: { variant: "outline" as const, label: "Shipped", className: "border-blue-500 text-blue-500" },
      delivered: { variant: "default" as const, label: "Delivered", className: "bg-emerald-500" },
      cancelled: { variant: "destructive" as const, label: "Cancelled", className: "" },
      refunded: { variant: "secondary" as const, label: "Refunded", className: "" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const status = paymentStatus || "Pending"
    const statusConfig: Record<string, { label: string, className: string }> = {
      Paid: { label: "Paid", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" },
      Pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800" },
      Refunded: { label: "Refunded", className: "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" },
      Failed: { label: "Failed", className: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" },
    }
    const config = statusConfig[status] || statusConfig["Pending"]
    return (
      <Badge variant="outline" className={cn("font-medium", config.className)}>
        {config.label}
      </Badge>
    )
  }

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    let previousStatus: Order["status"] | undefined

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order
        previousStatus = order.status
        return { ...order, status: newStatus }
      })
    )

    if (!isGuid(orderId)) {
      return
    }

    try {
      await ApiClient.post(`api/admin/Orders/edit-status?id=${orderId}`, newStatus)
    } catch (err) {
      console.error("Failed to update order status:", err)
      if (previousStatus) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: previousStatus! } : order
          )
        )
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} EGP`
  }

  const columns = [
    {
      key: "orderNumber",
      header: "Order Number",
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
      header: "Customer",
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-sm text-muted-foreground">{order.customer.email}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (order: Order) => (
        <span className="text-muted-foreground">
          {order.items.length} items
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (order: Order) => (
        <span className="font-medium">{formatCurrency(order.total)}</span>
      ),
    },
    {
      key: "paymentMethodName",
      header: "Payment Method",
      render: (order: Order) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{order.paymentMethodName}</span>
          {getPaymentStatusBadge(order.paymentMethod)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order: Order) => getStatusBadge(order.status),
    },
    {
      key: "date",
      header: "Date",
      render: (order: Order) => (
        <span className="text-muted-foreground">
          {new Date(order.createdDate).toLocaleDateString("en-US")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (order: Order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
              Shipped
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
              Delivered
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleStatusChange(order.id, "cancelled")}
            >
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]",
    },
  ]

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-muted-foreground">
            Manage {orders.length} orders
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportOrdersExcel()}>
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportOrdersPdf()}>
              Export to PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="flex items-center gap-4 mb-4"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              Loading...
            </div>
          ) : loadError ? (
            <div className="flex justify-center items-center h-48 text-destructive">
              Failed to load orders.
            </div>
          ) : null}

          {!loading && !loadError && (
            <DataTable
              data={filteredOrders}
              columns={columns}
              searchPlaceholder="Search orders..."
              searchKey="orderNumber"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

