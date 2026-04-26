"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { Printer, Download, Check, Package, Truck, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderItem {
  itemId: string
  nameEn: string
  nameAr: string
  image: string
  qty: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  status: string
  paymentStatus: string
  country: string
  city: string
  address: string
  phoneNumber: string
  email: string
  firstName: string
  lastName: string
  total: number
  delivryDate: string
  tbOrderItems: OrderItem[]
}

function statusBadge(status: string, language: string) {
  const normalized = (status || "Pending").toLowerCase()
  switch (normalized) {
    case "pending":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-yellow-500 text-white border-2 border-yellow-600">{language === "ar" ? "قيد الانتظار" : "Pending"}</span>
    case "processing":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-blue-500 text-white border-2 border-blue-600">{language === "ar" ? "جاري المعالجة" : "Processing"}</span>
    case "shipped":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-indigo-500 text-white border-2 border-indigo-600">{language === "ar" ? "تم الشحن" : "Shipped"}</span>
    case "delivered":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-green-500 text-white border-2 border-green-600">{language === "ar" ? "تم التوصيل" : "Delivered"}</span>
    case "cancelled":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-red-500 text-white border-2 border-red-600">{language === "ar" ? "ملغي" : "Cancelled"}</span>
    case "refunded":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-purple-500 text-white border-2 border-purple-600">{language === "ar" ? "مرتجع" : "Refunded"}</span>
    default:
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-yellow-500 text-white border-2 border-yellow-600">{status || (language === "ar" ? "قيد الانتظار" : "Pending")}</span>
  }
}

function paymentStatusBadge(status: string, language: string) {
  const normalized = (status || "Pending").toLowerCase()
  switch (normalized) {
    case "paid":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-green-500 text-white border-2 border-green-600">{language === "ar" ? "مدفوع" : "Paid"}</span>
    case "refunded":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-purple-500 text-white border-2 border-purple-600">{language === "ar" ? "مرتجع" : "Refunded"}</span>
    case "failed":
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-red-500 text-white border-2 border-red-600">{language === "ar" ? "فشل" : "Failed"}</span>
    case "pending":
    default:
      return <span className="inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold bg-yellow-500 text-white border-2 border-yellow-600">{language === "ar" ? "معلق" : "Pending"}</span>
  }
}

function OrderProgress({ status, language }: { status: string; language: string }) {
  const steps = [
    { id: "pending", labelEn: "Confirmed", labelAr: "تم التأكيد", icon: ClipboardList },
    { id: "processing", labelEn: "Processing", labelAr: "جاري التجهيز", icon: Package },
    { id: "shipped", labelEn: "On the Way", labelAr: "في الطريق", icon: Truck },
    { id: "delivered", labelEn: "Delivered", labelAr: "تم التوصيل", icon: CheckCircle2 },
  ]

  const normalized = (status || "Pending").toLowerCase()
  
  let currentStep = 0
  if (normalized === "processing") currentStep = 1
  if (normalized === "shipped") currentStep = 2
  if (normalized === "delivered") currentStep = 3
  
  const isCancelled = normalized === "cancelled"
  const isRefunded = normalized === "refunded"

  if (isCancelled || isRefunded) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className={cn(
          "h-20 w-20 rounded-3xl flex items-center justify-center mb-4 border-2 shadow-xl transition-all duration-500 hover:scale-105",
          isCancelled ? "bg-red-50 border-red-200 text-red-600" : "bg-purple-50 border-purple-200 text-purple-600"
        )}>
          <AlertCircle className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#2f2219]">
          {isCancelled 
            ? (language === "ar" ? "تم إلغاء هذا الطلب" : "Order Cancelled") 
            : (language === "ar" ? "تم إرجاع هذا الطلب" : "Order Refunded")
          }
        </h3>
        <p className="text-muted-foreground mt-2 text-center max-w-xs mx-auto">
          {isCancelled 
            ? (language === "ar" ? "نأسف لإلغاء طلبك. إذا كنت بحاجة إلى مساعدة، يرجى الاتصال بنا." : "We're sorry this order was cancelled. If you need assistance, please contact us.")
            : (language === "ar" ? "تمت معالجة عملية الاسترداد لهذا الطلب." : "The refund for this order has been processed successfully.")
          }
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full py-2">
      {/* Mobile view: Vertical */}
      <div className="flex md:hidden flex-col gap-10">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-500",
                  isCompleted ? "bg-[#7B3F32] border-[#7B3F32] text-white" :
                  isActive ? "bg-white border-[#7B3F32] text-[#7B3F32] shadow-[0_0_20px_rgba(123,63,50,0.25)] animate-pulse" :
                  "bg-white border-[#7B3F32]/10 text-slate-300"
                )}>
                  {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                {!isLast && (
                  <div className={cn(
                    "w-[2px] h-full mt-2 -mb-2 transition-colors duration-500",
                    isCompleted ? "bg-[#7B3F32]" : "bg-slate-100"
                  )} />
                )}
              </div>
              <div className="pt-2">
                <p className={cn(
                  "font-bold text-base tracking-tight uppercase",
                  isActive ? "text-[#7B3F32]" : isCompleted ? "text-[#2f2219]" : "text-slate-400"
                )}>
                  {language === "ar" ? step.labelAr : step.labelEn}
                </p>
                {isActive && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-[#7B3F32] animate-ping"></span>
                    <p className="text-xs font-semibold text-[#8b7d73]">
                      {language === "ar" ? "الحالة الحالية" : "Current Status"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop view: Horizontal */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Connection Line Background */}
          <div className="absolute left-[5%] right-[5%] top-1/2 h-[3px] -translate-y-1/2 bg-slate-100/80 rounded-full" />
          
          {/* Active Connection Line */}
          <div 
            className="absolute left-[5%] top-1/2 h-[3px] -translate-y-1/2 bg-gradient-to-r from-[#7B3F32] via-[#c16043] to-[#7B3F32] bg-[length:200%_auto] animate-gradient-x transition-all duration-1000 ease-in-out rounded-full" 
            style={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 90)}%` }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index < currentStep
            const isActive = index === currentStep

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "h-16 w-16 rounded-[22px] flex items-center justify-center border-2 transition-all duration-700",
                  isCompleted ? "bg-[#7B3F32] border-[#7B3F32] text-white shadow-lg rotate-[360deg]" :
                  isActive ? "bg-white border-[#7B3F32] text-[#7B3F32] shadow-[0_15px_35px_rgba(123,63,50,0.25)] scale-110" :
                  "bg-white border-slate-100 text-slate-300"
                )}>
                  {isCompleted ? <Check className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
                </div>
                
                <div className="absolute -bottom-12 whitespace-nowrap flex flex-col items-center">
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                    isActive ? "text-[#7B3F32]" : isCompleted ? "text-[#2f2219]" : "text-slate-400"
                  )}>
                    {language === "ar" ? step.labelAr : step.labelEn}
                  </span>
                  {isActive && (
                    <div className="mt-2 flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#7B3F32] animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-[#7B3F32] animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-[#7B3F32] animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function OrderViewPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return
      try {
        setLoading(true)
        console.log(`Fetching order details for ID: ${id}`)

        // Using common fetch with credentials to ensure absolute URL and cookie handling
        const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")}/api/order/${id}`, {
          credentials: "include"
        })

        if (res.ok) {
          const data = await res.json()
          console.log("Order data received:", data)

          // Normalize the data format in case the backend returns PascalCase
          const rawItems = data.tbOrderItems || data.TbOrderItems || []

          // Fetch missing product details (names/images) in parallel if they are null
          const normalizedItems = await Promise.all(rawItems.map(async (item: any) => {
            const normalized = {
              ...item,
              itemId: item.itemId || item.ItemId,
              nameEn: item.nameEn || item.NameEn,
              nameAr: item.nameAr || item.NameAr,
              image: item.image || item.Image,
              qty: item.qty || item.Qty,
              unitPrice: item.unitPrice || item.UnitPrice
            };

            // If name or image is missing, fetch from Items API
            if (!normalized.nameEn || !normalized.nameAr || !normalized.image) {
              try {
                const itemRes = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")}/api/items/${normalized.itemId}`, {
                  credentials: "include"
                });
                if (itemRes.ok) {
                  const itemData = await itemRes.json();
                  normalized.nameEn = normalized.nameEn || itemData.nameEn || itemData.NameEn;
                  normalized.nameAr = normalized.nameAr || itemData.nameAr || itemData.NameAr;
                  normalized.image = normalized.image || itemData.mainImage || itemData.MainImage;
                }
              } catch (e) {
                console.warn(`Could not fetch details for item ${normalized.itemId}`, e);
              }
            }
            return normalized;
          }));

          const normalizedData = {
            ...data,
            delivryDate: data.delivryDate || data.DelivryDate,
            tbOrderItems: normalizedItems
          }

          setOrder(normalizedData)
        } else {
          console.error(`Order fetch failed with status: ${res.status}`)
          setError(true)
        }
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])
  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      const result = await ApiClient.post<boolean>(
        `api/order/cancel-order/${order.id}`,
        {}
      );

      if (result === true) {
        setOrder(prev =>
          prev ? { ...prev, status: "Cancelled" } : prev
        );
      } else {
        alert("Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            {language === "ar" ? "لم يتم العثور على الطلب" : "Order not found"}
          </h2>
          <Button onClick={() => router.push("/profile")}>
            {language === "ar" ? "العودة للملف الشخصي" : "Back to Profile"}
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const orderItemsTotal = order.tbOrderItems.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.qty || 0), 0)
  const shippingFee = 0
  const subtotal = orderItemsTotal || order.total
  const customerName = `${order.firstName || ""} ${order.lastName || ""}`.trim() || (language === "ar" ? "العميل" : "Customer")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-[#f8efe6] via-[#f7efe7] to-[#f5ebe0]">
        <div className="container mx-auto px-4 py-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] mb-6">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#7B3F32]/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#C1AFA0]/30 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] tracking-[0.2em] font-semibold uppercase text-[#8b7d73]">
                  {language === "ar" ? "معلومات الطلب" : "Order Information"}
                </p>
                <h1 className="text-3xl font-bold text-[#2f2219] mt-1">
                  {language === "ar" ? "تفاصيل الطلب" : "Order Details"}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-[#7B3F32]/20 bg-[#f8efe6] px-3 py-1 text-xs font-bold tracking-wider text-[#7B3F32]">
                    #{order.orderNumber}
                  </span>
                  {statusBadge(order.status, language)}
                  {paymentStatusBadge(order.paymentStatus, language)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  {language === "ar" ? "طباعة" : "Print"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const invoiceText = `Order Number: ${order.orderNumber}
Date: ${new Date(order.orderDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
Status: ${order.status}
Customer Name: ${customerName}
Email: ${order.email}
Phone: ${order.phoneNumber}

Items:
${order.tbOrderItems.map(i => `- ${language === "ar" ? i.nameAr : i.nameEn} (Qty: ${i.qty}) - ${formatPrice(i.unitPrice)} ${t("products.price")}`).join('\n')}

Subtotal: ${formatPrice(subtotal)} ${t("products.price")}
Shipping: ${formatPrice(shippingFee)} ${t("products.price")}
Total: ${formatPrice(order.total)} ${t("products.price")}

Shipping Address:
${order.address}
${order.city}, ${order.country}
Payment Method: ${order.paymentStatus}
`;
                const element = document.createElement("a");
                const file = new Blob([invoiceText], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = `invoice-${order.orderNumber}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}>
                <Download className="h-4 w-4 mr-2" />
                {language === "ar" ? "تحميل" : "Download"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.back()}>{language === "ar" ? "عودة" : "Back"}</Button>
              <Link href="/profile" className="text-sm text-primary hover:underline ml-2">{language === "ar" ? "الملف الشخصي" : "Profile"}</Link>
            </div>
          </div>

          {/* Order Tracking Plan */}
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-8 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)] mb-6 min-h-[220px] flex items-center justify-center">
            <div className="absolute top-0 right-0 p-4">
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b7d73]/40">
                  {language === "ar" ? "تتبع الحالة" : "Live Tracking"}
               </span>
            </div>
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#7B3F32]/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#C1AFA0]/10 blur-3xl" />
            
            <div className="relative z-10 w-full">
              <OrderProgress status={order.status} language={language} />
            </div>
          </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6 border-[#7B3F32]/10 bg-white/85">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#7B3F32]/10">
                    <div>
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "رقم الطلب" : "Order ID"}</div>
                      <div className="font-bold text-lg">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground mt-1">{language === "ar" ? "العميل" : "Customer"}: {customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "التاريخ" : "Date"}</div>
                      <div className="font-medium">{new Date(order.orderDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</div>
                      <div className="mt-1 text-xs text-primary font-medium">
                        {language === "ar" ? "تاريخ التوصيل المتوقع: " : "Estimated Delivery: "}
                        {order.delivryDate ? new Date(order.delivryDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US") : "---"}
                      </div>
                      {((order.status || "").toLowerCase() === "pending" || (order.status || "").toLowerCase() === "processing") && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200 py-6 rounded-xl flex items-center justify-center gap-3 group shadow-sm bg-transparent"
                            onClick={handleCancelOrder}
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform duration-300 animate-pulse"></span>
                            <span className="font-semibold">{language === "ar" ? "إلغاء هذا الطلب" : "Cancel This Order"}</span>
                          </Button>
                          <p className="mt-2 text-[10px] text-muted-foreground text-center">
                            {language === "ar" ? "* لا يمكن الإلغاء بعد الشحن" : "* Orders cannot be cancelled after shipping"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-4">{language === "ar" ? "العناصر" : "Items"}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">{language === "ar" ? "الصورة" : "Image"}</TableHead>
                          <TableHead>{language === "ar" ? "المنتج" : "Product"}</TableHead>
                          <TableHead className="text-center">{language === "ar" ? "الكمية" : "Qty"}</TableHead>
                          <TableHead className="text-right">{language === "ar" ? "السعر" : "Price"}</TableHead>
                          <TableHead className="text-right">{language === "ar" ? "الإجمالي" : "Total"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.tbOrderItems.map((it, idx) => (
                          <TableRow key={it.itemId || idx}>
                            <TableCell>
                              <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                                <img src={it.image || "/placeholder.svg"} alt={language === "ar" ? it.nameAr : it.nameEn} className="object-cover w-full h-full" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {language === "ar" ? it.nameAr : it.nameEn}
                            </TableCell>
                            <TableCell className="text-center">{it.qty}</TableCell>
                            <TableCell className="text-right">{formatPrice(it.unitPrice)} {t("products.price")}</TableCell>
                            <TableCell className="text-right font-semibold">{formatPrice(it.unitPrice * it.qty)} {t("products.price")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#7B3F32]/10 bg-white/85">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">{language === "ar" ? "تفاصيل الشحن" : "Shipping Details"}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "العنوان" : "Address"}</div>
                      <div className="font-medium">{order.address}</div>
                      <div className="text-sm text-muted-foreground">{order.city}, {order.country}</div>
                    </div>
                    <div className="space-y-1 sm:text-right">
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "معلومات التواصل" : "Contact Information"}</div>
                      <div className="font-medium">{customerName}</div>
                      <div className="font-medium">{order.phoneNumber}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside>
              <Card className="border-[#7B3F32]/10 bg-white/85">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">{language === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                      <span>{formatPrice(subtotal)} {t("products.price")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "الشحن" : "Shipping"}</span>
                      <span>{formatPrice(shippingFee)} {t("products.price")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-foreground border-t pt-3 mt-3">
                      <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                      <span className="text-primary">{formatPrice(order.total)} {t("products.price")}</span>
                    </div>
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm flex flex-col items-center gap-2">
                      <span className="text-muted-foreground">{language === "ar" ? "حالة الطلب" : "Order Status"}</span>
                      {statusBadge(order.status, language)}
                      <span className="text-muted-foreground">{language === "ar" ? "حالة الدفع" : "Payment Status"}</span>
                      {paymentStatusBadge(order.paymentStatus, language)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
