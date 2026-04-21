"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { type Order } from "@/lib/admin-data"
import { ArrowLeft, Printer, Download, Mail, Phone, MapPin } from "lucide-react"

type ApiOrderItem = {
  itemId?: string
  ItemId?: string
  productId?: string
  ProductId?: string
  nameEn?: string
  NameEn?: string
  nameAr?: string
  NameAr?: string
  name?: string
  productName?: string
  ProductName?: string
  itemName?: string
  ItemName?: string
  qty?: number
  Qty?: number
  quantity?: number
  Quantity?: number
  unitPrice?: number
  UnitPrice?: number
  price?: number
  Price?: number
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

const isGuid = (value: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)

const mapApiOrder = (apiOrder: ApiOrder): Order => {
  const safeEmail = apiOrder.email?.trim() || ""
  const safePhone = apiOrder.phoneNumber || ""
  const safeFirstName = apiOrder.firstName?.trim() || ""
  const safeLastName = apiOrder.lastName?.trim() || ""
  const safeName = safeFirstName && safeLastName ? `${safeFirstName} ${safeLastName}` : safeEmail ? safeEmail.split("@")[0] : safePhone || "Customer"

  const items = Array.isArray(apiOrder.tbOrderItems) ? apiOrder.tbOrderItems : []
  const mappedItems = items.map((item, index) => {
    const price = Number(item.unitPrice ?? item.UnitPrice ?? item.price ?? item.Price ?? 0)
    const quantity = Number(item.qty ?? item.Qty ?? item.quantity ?? item.Quantity ?? 0)

    const nestedItem =
      (item as { item?: { [key: string]: unknown }; Item?: { [key: string]: unknown } }).item ||
      (item as { Item?: { [key: string]: unknown } }).Item ||
      (item as { tbItem?: { [key: string]: unknown }; TbItem?: { [key: string]: unknown } }).tbItem ||
      (item as { TbItem?: { [key: string]: unknown } }).TbItem ||
      (item as { product?: { [key: string]: unknown }; Product?: { [key: string]: unknown } }).product ||
      (item as { Product?: { [key: string]: unknown } }).Product

    const nestedNameAr = nestedItem && typeof nestedItem === "object"
      ? (nestedItem as { nameAr?: string; NameAr?: string }).nameAr ?? (nestedItem as { NameAr?: string }).NameAr
      : undefined

    const nestedNameEn = nestedItem && typeof nestedItem === "object"
      ? (nestedItem as { nameEn?: string; NameEn?: string }).nameEn ?? (nestedItem as { NameEn?: string }).NameEn
      : undefined

    const nameAr = item.nameAr ?? item.NameAr ?? nestedNameAr
    const nameEn = item.nameEn ?? item.NameEn ?? nestedNameEn
    const fallbackName = item.name ?? item.productName ?? item.ProductName ?? item.itemName ?? item.ItemName

    return {
      productId: item.itemId || item.ItemId || item.productId || item.ProductId || `item-${index}`,
      productName: nameAr || nameEn || fallbackName || "Item",
      quantity: Number.isFinite(quantity) ? quantity : 0,
      price: Number.isFinite(price) ? price : 0,
    }
  })

  const subtotal = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Number(apiOrder.total ?? subtotal)
  const createdDate = apiOrder.orderDate || apiOrder.createdDate || new Date().toISOString()
  const updatedAt = apiOrder.delivryDate || createdDate

  return {
    id: apiOrder.id || "order",
    orderNumber: apiOrder.orderNumber || "ORD-0000",
    customer: {
      id: apiOrder.userId || "customer",
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
    paymentMethodName: apiOrder.paymentStatus || "Unknown",
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

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { t } = useAdminLanguage()

  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<Order["status"]>("pending")
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!id) return

    let isMounted = true
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const data = (await ApiClient.get(`api/admin/Orders/details/${id}`)) as any
        const rawOrder = data?.order ?? data?.data ?? data

        if (rawOrder && isMounted) {
          const mapped = mapApiOrder(rawOrder as ApiOrder)
          setOrder(mapped)
          setStatus(mapped.status)
        } else if (isMounted) {
          setOrder(null)
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err)
        if (isMounted) setLoadError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchOrder()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleSaveStatus = async () => {
    if (!order) return
    if (!isGuid(order.id)) return

    const previousStatus = order.status
    setSavingStatus(true)
    setOrder((prev) => (prev ? { ...prev, status } : prev))

    try {
      await ApiClient.post(`api/admin/Orders/edit-status?id=${order.id}`, status)
    } catch (err) {
      console.error("Failed to update order status:", err)
      setStatus(previousStatus)
      setOrder((prev) => (prev ? { ...prev, status: previousStatus } : prev))
    } finally {
      setSavingStatus(false)
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-[#7c6f65]">{t("common.loading")}</div>
  }

  if (loadError) {
    return <div className="py-12 text-center text-red-600">Failed to load order.</div>
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold">Order not found</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/orders">Back</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (value: Order["status"]) => {
    const statusConfig: Record<Order["status"], { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" },
      processing: { label: "Processing", className: "bg-blue-100 text-blue-700 border-blue-200" },
      shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700 border-purple-200" },
      delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
      refunded: { label: "Refunded", className: "bg-slate-100 text-slate-700 border-slate-200" },
    }

    const config = statusConfig[value]
    return (
      <Badge className={cn("border inline-flex items-center gap-1.5 font-semibold", config.className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} ${t("common.egp")}`

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ] as const

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#8f3f2a]/12 bg-white/85 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-[#d66a49]/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-[#c7aea2]/26 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-[#8f3f2a] hover:bg-[#f7ebe4]">
              <Link href="/admin/orders">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7d73]">Order Details</p>
              <div className="mt-1 flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-[#2f2219]">{order.orderNumber}</h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="mt-1 text-sm font-medium text-[#7c6f65]">
                {new Date(order.createdDate).toLocaleDateString("en-US", { dateStyle: "full" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.print()}
              className="h-11 w-11 rounded-xl border-[#8f3f2a]/20 text-[#8f3f2a] hover:bg-[#f7ebe4]"
            >
              <Printer className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-xl border-[#8f3f2a]/20 text-[#8f3f2a] hover:bg-[#f7ebe4]"
              onClick={() => {
                const invoiceText = `Order Number: ${order.orderNumber}\nDate: ${new Date(order.createdDate).toLocaleDateString()}\nStatus: ${order.status}\nCustomer: ${order.customer.name} (${order.customer.email})\nPhone: ${order.customer.phone}\n\nItems:\n${order.items.map((i) => `- ${i.productName} (Qty: ${i.quantity}) - ${formatCurrency(i.price)}`).join("\n")}\n\nSubtotal: ${formatCurrency(order.subtotal)}\nShipping: ${formatCurrency(order.shipping)}\nTax: ${formatCurrency(order.tax)}\nDiscount: -${formatCurrency(order.discount)}\nTotal: ${formatCurrency(order.total)}\n\nShipping Address:\n${order.shippingAddress.street}\n${order.shippingAddress.city}, ${order.shippingAddress.state}\n${order.shippingAddress.country} ${order.shippingAddress.postalCode}\nPayment Method: ${order.paymentMethod}\n`

                const element = document.createElement("a")
                const file = new Blob([invoiceText], { type: "text/plain" })
                element.href = URL.createObjectURL(file)
                element.download = `invoice-${order.orderNumber}.txt`
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="text-[#2f2219]">{t("orders.items")} ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className={cn("flex items-center justify-between py-3", index < order.items.length - 1 && "border-b border-[#8f3f2a]/10")}>
                  <div>
                    <p className="font-medium text-[#2f2219]">{item.productName}</p>
                    <p className="text-sm text-[#7c6f65]">{t("cart.quantity")}: {item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-semibold text-[#2f2219]">{formatCurrency(item.quantity * item.price)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="text-[#2f2219]">{t("checkout.summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#7c6f65]">{t("orders.subtotal")}</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7c6f65]">{t("orders.shipping")}</span>
                <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7c6f65]">{t("orders.tax")}</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>{t("orders.discount")}</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t("orders.total")}</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="text-[#2f2219]">{t("orders.updateStatus")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={(value) => setStatus(value as Order["status"])}>
                <SelectTrigger className="admin-input h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#8f3f2a]/15 bg-white shadow-xl">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="mt-4 h-11 w-full rounded-xl border-0 bg-gradient-to-r from-[#8f3f2a] to-[#c16043] text-white"
                onClick={handleSaveStatus}
                disabled={savingStatus || !isGuid(order.id)}
              >
                {savingStatus ? "Saving..." : t("common.save")}
              </Button>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="text-[#2f2219]">{t("orders.customer")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-[#2f2219]">{order.customer.name}</p>
              <div className="flex items-center gap-2 text-sm text-[#7c6f65]">
                <Mail className="h-4 w-4" />
                <span>{order.customer.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#7c6f65]">
                <Phone className="h-4 w-4" />
                <span>{order.customer.phone || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="text-[#2f2219]">{t("orders.shippingAddress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 text-[#7c6f65]">
                <MapPin className="mt-1 h-4 w-4 shrink-0" />
                <div>
                  <p>{order.shippingAddress.street || "N/A"}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.country} {order.shippingAddress.postalCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="text-[#2f2219]">{t("orders.paymentMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#7c6f65]">{order.paymentMethod || "N/A"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
