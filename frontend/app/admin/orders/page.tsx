"use client"

import { useEffect, useState } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Eye, Download, Filter } from "lucide-react"
import Link from "next/link"
import { exportOrdersExcel, exportOrdersPdf } from "@/app/ApiHelper/ExportApi"

type ApiOrderItem = { itemId?: string; productId?: string; nameEn?: string; nameAr?: string; qty?: number; quantity?: number; unitPrice?: number; price?: number }
type ApiOrder = { id?: string; userId?: string; orderNumber?: string; orderDate?: string; createdDate?: string; delivryDate?: string; address?: string; city?: string; country?: string; email?: string; phoneNumber?: string; firstName?: string; lastName?: string; status?: string; paymentStatus?: string; total?: number; tbOrderItems?: ApiOrderItem[]; paymentMethod?: string; paymentMethodName?: string }

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

const isGuid = (value: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)

const mapApiOrder = (apiOrder: ApiOrder, index: number): Order => {
  const safeEmail = apiOrder.email?.trim() || ""
  const safePhone = apiOrder.phoneNumber || ""
  const safeFirstName = apiOrder.firstName?.trim() || ""
  const safeLastName = apiOrder.lastName?.trim() || ""
  const safeName = safeFirstName && safeLastName ? `${safeFirstName} ${safeLastName}` : safeEmail ? safeEmail.split("@")[0] : safePhone || `Customer ${index + 1}`
  const items = Array.isArray(apiOrder.tbOrderItems) ? apiOrder.tbOrderItems : []
  const mappedItems = items.map((item, itemIndex) => {
    const price = Number(item.unitPrice ?? item.price ?? 0)
    const quantity = Number(item.qty ?? item.quantity ?? 0)
    return { productId: item.itemId || item.productId || `item-${index}-${itemIndex}`, productName: item.nameEn || item.nameAr || "Item", quantity: Number.isFinite(quantity) ? quantity : 0, price: Number.isFinite(price) ? price : 0 }
  })
  const subtotal = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Number(apiOrder.total ?? subtotal)
  const createdDate = apiOrder.orderDate || apiOrder.createdDate || new Date().toISOString()
  return {
    id: apiOrder.id || `order-${index}`,
    orderNumber: apiOrder.orderNumber || `ORD-${String(index + 1).padStart(4, "0")}`,
    paymentMethodName: apiOrder.paymentMethodName || "Unknown",
    customer: { id: apiOrder.userId || `customer-${index}`, name: safeName || "Customer", email: safeEmail, phone: safePhone },
    items: mappedItems, subtotal, shipping: 0, tax: 0, discount: 0, total: Number.isFinite(total) ? total : subtotal,
    status: normalizeStatus(apiOrder.status),
    paymentMethod: apiOrder.paymentStatus || "Unknown",
    shippingAddress: { street: apiOrder.address || "", city: apiOrder.city || "", state: "", country: apiOrder.country || "", postalCode: "" },
    createdDate, updatedAt: apiOrder.delivryDate || createdDate,
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
        const data = await ApiClient.get<any>("api/admin/Orders")
        const list = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : Array.isArray(data?.data) ? data.data : []
        const mapped = list.map((order: ApiOrder, index: number) => mapApiOrder(order, index))
        if (isMounted) setOrders(mapped)
      } catch (err) { console.error("Failed to fetch orders:", err); if (isMounted) setLoadError(true) }
      finally { if (isMounted) setLoading(false) }
    }
    fetchOrders()
    return () => { isMounted = false }
  }, [])

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200" },
      shipped: { label: "Shipped", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
      refunded: { label: "Refunded", className: "bg-purple-100 text-purple-800 border-purple-200" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge className={cn("border font-semibold", config.className)}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const status = paymentStatus || "Pending"
    const statusConfig: Record<string, { label: string; className: string }> = {
      Paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
      Pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      Refunded: { label: "Refunded", className: "bg-purple-100 text-purple-800 border-purple-200" },
      Failed: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" },
    }
    const config = statusConfig[status] || statusConfig["Pending"]
    return <Badge className={cn("border font-semibold", config.className)}>{config.label}</Badge>
  }

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    let previousStatus: Order["status"] | undefined
    setOrders((prev) => prev.map((order) => { if (order.id !== orderId) return order; previousStatus = order.status; return { ...order, status: newStatus } }))
    if (!isGuid(orderId)) return
    try { await ApiClient.post(`api/admin/Orders/edit-status?id=${orderId}`, newStatus) }
    catch (err) { console.error("Failed to update order status:", err); if (previousStatus) setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: previousStatus! } : order)) }
  }

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} EGP`

  const columns = [
    { key: "orderNumber", header: "Order Number", render: (order: Order) => <Link href={`/admin/orders/${order.id}`} className="font-bold text-[#7B3F32] hover:text-[#9e5948] transition-colors">{order.orderNumber}</Link> },
    { key: "customer", header: "Customer", render: (order: Order) => <div><p className="font-medium text-slate-900">{order.customer.name}</p><p className="text-sm text-slate-500">{order.customer.email}</p></div> },
    { key: "items", header: "Items", render: (order: Order) => <span className="text-slate-500">{order.items.length} items</span> },
    { key: "total", header: "Total", render: (order: Order) => <span className="font-semibold text-slate-900">{formatCurrency(order.total)}</span> },
    { key: "paymentMethodName", header: "Payment", render: (order: Order) => <div className="flex flex-col gap-1"><span className="text-sm font-medium text-slate-900">{order.paymentMethodName}</span>{getPaymentStatusBadge(order.paymentMethod)}</div> },
    { key: "status", header: "Status", render: (order: Order) => getStatusBadge(order.status) },
    { key: "date", header: "Date", render: (order: Order) => <span className="text-slate-500">{new Date(order.createdDate).toLocaleDateString("en-US")}</span> },
    {
      key: "actions", header: "Actions", render: (order: Order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#A6ACA2]/10"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl shadow-[#7B3F32]/10 border-[#7B3F32]/10">
            <DropdownMenuItem asChild className="hover:bg-[#f6eee8] cursor-pointer rounded-lg"><Link href={`/admin/orders/${order.id}`}><Eye className="h-4 w-4 mr-2 text-[#7B3F32]" /><span className="text-[#3a2c26] font-medium">View Details</span></Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-slate-500">Update Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")} className="hover:bg-[#f6eee8] cursor-pointer rounded-lg mt-1 font-medium text-[#3a2c26]">Processing</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")} className="hover:bg-[#f6eee8] cursor-pointer rounded-lg mt-1 font-medium text-[#3a2c26]">Shipped</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")} className="hover:bg-[#f6eee8] cursor-pointer rounded-lg mt-1 font-medium text-[#3a2c26]">Delivered</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")} className="hover:bg-red-50 cursor-pointer text-red-600 rounded-lg mt-1 font-medium">Cancelled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ), className: "w-[70px]"
    }
  ]

  const statusOptions = [{ value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "processing", label: "Processing" }, { value: "shipped", label: "Shipped" }, { value: "delivered", label: "Delivered" }, { value: "cancelled", label: "Cancelled" }]

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />
        
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Orders</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage {orders.length} orders</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#7B3F32]/20 hover:bg-[#A6ACA2]/10 text-[#7B3F32] bg-white/50 rounded-xl"><Download className="h-4 w-4 mr-2" />Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border-[#7B3F32]/10">
              <DropdownMenuItem onClick={() => exportOrdersExcel()} className="hover:bg-[#f6eee8] cursor-pointer rounded-lg font-medium text-[#3a2c26]">Export to Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportOrdersPdf()} className="hover:bg-[#f6eee8] cursor-pointer rounded-lg font-medium text-[#3a2c26] mt-1">Export to PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6 bg-white/50 border border-[#7B3F32]/10 p-3 rounded-2xl w-fit backdrop-blur-sm">
            <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-[#8b7d73]" /><span className="text-sm font-medium text-[#2f2219]">Filter Status:</span></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-[#7B3F32]/20 bg-white rounded-xl focus:ring-[#7B3F32]/20"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-[#7B3F32]/10 shadow-xl">{statusOptions.map((option) => <SelectItem key={option.value} value={option.value} className="rounded-lg focus:bg-[#f6eee8] focus:text-[#7B3F32]">{option.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {loading ? <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">Loading orders...</div> : loadError ? <div className="flex justify-center items-center h-48 text-red-500">Failed to load orders.</div> : <DataTable data={filteredOrders} columns={columns} searchPlaceholder="Search orders..." searchKey="orderNumber" />}
        </CardContent>
      </Card>
    </div>
  )
}
