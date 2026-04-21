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

const mapApiOrder = (apiOrder: ApiOrder): Order => {
  const safeEmail = apiOrder.email?.trim() || ""
  const safePhone = apiOrder.phoneNumber || ""
  const safeFirstName = apiOrder.firstName?.trim() || ""
  const safeLastName = apiOrder.lastName?.trim() || ""
  const safeName = safeFirstName && safeLastName 
    ? `${safeFirstName} ${safeLastName}` 
    : safeEmail ? safeEmail.split("@")[0] : safePhone || "Customer"
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
   const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!id) return
    let isMounted = true

    const fetchOrder = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const data = await ApiClient.get(`api/admin/Orders/details/${id}`)
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
        {t("common.loading")}
      </div>
    )
  }

   if (loadError) {
     return (
       <div className="flex flex-col items-center justify-center py-12 text-destructive">
         Failed to load order.
       </div>
     )
   }

   if (!order) {
     return (
       <div className="flex flex-col items-center justify-center py-12">
         <h2 className="text-xl font-semibold">Order not found</h2>
         <Button asChild className="mt-4">
           <Link href="/admin/orders">Back</Link>
         </Button>
       </div>
     )
   }

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
         {config.labelEn}
       </Badge>
     )
   }

   const formatCurrency = (amount: number) => {
     return `${amount.toLocaleString()} ${t("common.egp")}`
   }

   const statusOptions = [
     { value: "pending", label: "Pending" },
     { value: "processing", label: "Processing" },
     { value: "shipped", label: "Shipped" },
     { value: "delivered", label: "Delivered" },
     { value: "cancelled", label: "Cancelled" },
     { value: "refunded", label: "Refunded" },
   ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[#7B3F32]/10 shadow-sm relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#7B3F32]/5 blur-2xl z-0" />
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" asChild className="hover:bg-[#f6eee8] text-[#7B3F32] h-10 w-10 rounded-xl">
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#2f2219]">{order.orderNumber}</h1>
              {getStatusBadge(status)}
            </div>
            <p className="text-[#7c6f65] font-medium mt-1">
               {new Date(order.createdDate).toLocaleDateString(
                 "en-US",
                 { dateStyle: "full" }
               )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" size="icon" onClick={() => window.print()} className="rounded-xl border-[#7B3F32]/20 hover:bg-[#A6ACA2]/10 text-[#7B3F32] h-11 w-11 shadow-sm">
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl border-[#7B3F32]/20 hover:bg-[#A6ACA2]/10 text-[#7B3F32] h-11 w-11 shadow-sm" onClick={() => {
            const invoiceText = `Order Number: ${order.orderNumber}
Date: ${new Date(order.createdDate).toLocaleDateString()}
Status: ${order.status}
Customer: ${order.customer.name} (${order.customer.email})
Phone: ${order.customer.phone}

Items:
${order.items.map(i => `- ${i.productName} (Qty: ${i.quantity}) - ${formatCurrency(i.price)}`).join('\n')}

Subtotal: ${formatCurrency(order.subtotal)}
Shipping: ${formatCurrency(order.shipping)}
Tax: ${formatCurrency(order.tax)}
Discount: -${formatCurrency(order.discount)}
Total: ${formatCurrency(order.total)}

Shipping Address:
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state}
${order.shippingAddress.country} ${order.shippingAddress.postalCode}
Payment Method: ${order.paymentMethod}
`;
            const element = document.createElement("a");
            const file = new Blob([invoiceText], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `invoice-${order.orderNumber}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
           <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
             <CardHeader>
               <CardTitle>
                 {t("orders.items")} ({order.items.length})
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {order.items.map((item, index) => (
                   <div
                     key={index}
                     className={cn(
                       "flex items-center justify-between py-3",
                       index < order.items.length - 1 && "border-b"
                     )}
                   >
                     <div>
                       <p className="font-medium">{item.productName}</p>
                       <p className="text-sm text-muted-foreground">
                         {t("cart.quantity")}: {item.quantity} x {formatCurrency(item.price)}
                       </p>
                     </div>
                     <span className="font-semibold">
                       {formatCurrency(item.quantity * item.price)}
                     </span>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           {/* Order Summary */}
           <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
             <CardHeader>
               <CardTitle>
                 {t("checkout.summary")}
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-muted-foreground">{t("orders.subtotal")}</span>
                 <span>{formatCurrency(order.subtotal)}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-muted-foreground">{t("orders.shipping")}</span>
                 <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-muted-foreground">{t("orders.tax")}</span>
                 <span>{formatCurrency(order.tax)}</span>
               </div>
               {order.discount > 0 && (
                 <div className="flex items-center justify-between text-emerald-600">
                   <span>{t("orders.discount")}</span>
                   <span>-{formatCurrency(order.discount)}</span>
                </div>
               )}
               <Separator />
               <div className="flex items-center justify-between font-semibold text-lg">
                 <span>{t("orders.total")}</span>
                 <span>{formatCurrency(order.total)}</span>
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
           {/* Update Status */}
           <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
             <CardHeader>
               <CardTitle>
                 {t("orders.updateStatus")}
               </CardTitle>
             </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={(value) => setStatus(value as Order["status"])}>
                <SelectTrigger>
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
              <Button className="w-full mt-4 bg-gradient-to-r from-[#7B3F32] to-[#9e5948] hover:from-[#5f3026] hover:to-[#8e4f3f] text-white border-0 font-bold rounded-xl shadow-md h-11">{t("common.save")}</Button>
            </CardContent>
          </Card>

           {/* Customer Info */}
           <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
             <CardHeader>
               <CardTitle>
                 {t("orders.customer")}
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <p className="font-medium">{order.customer.name}</p>
               </div>
               <div className="flex items-center gap-2 text-sm">
                 <Mail className="h-4 w-4 text-muted-foreground" />
                 <span>{order.customer.email}</span>
               </div>
               <div className="flex items-center gap-2 text-sm">
                 <Phone className="h-4 w-4 text-muted-foreground" />
                 <span>{order.customer.phone}</span>
               </div>
             </CardContent>
          </Card>

           {/* Shipping Address */}
           <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
             <CardHeader>
               <CardTitle>
                 {t("orders.shippingAddress")}
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex gap-2">
                 <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                 <div>
                   <p>{order.shippingAddress.street}</p>
                   <p>
                     {order.shippingAddress.city}, {order.shippingAddress.state}
                   </p>
                   <p>
                     {order.shippingAddress.country} {order.shippingAddress.postalCode}
                   </p>
                 </div>
               </div>
             </CardContent>
           </Card>

           {/* Payment Method */}
           <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-visible">
             <CardHeader>
               <CardTitle>
                 {t("orders.paymentMethod")}
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p>{order.paymentMethod}</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
