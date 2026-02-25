"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"

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
  const displayStatus = status || "Pending"
  switch (displayStatus) {
    case "Pending":
      return <Badge className="bg-yellow-500">{language === "ar" ? "قيد الانتظار" : "Pending"}</Badge>
    case "Shipped":
      return <Badge className="bg-blue-500">{language === "ar" ? "تم الشحن" : "Shipped"}</Badge>
    case "Delivered":
      return <Badge className="bg-green-500">{language === "ar" ? "تم التوصيل" : "Delivered"}</Badge>
    default:
      return <Badge variant="outline">{displayStatus}</Badge>
  }
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
        const res = await fetch(`https://localhost:7282/api/order/${id}`, {
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
                const itemRes = await fetch(`https://localhost:7282/api/items/${normalized.itemId}`);
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
      const res = await fetch(
        `https://localhost:7282/api/order/cancel-order/${order.id}`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (res.ok) {
        const result = await res.json();

        if (result === true) {
          setOrder(prev =>
            prev ? { ...prev, status: "Cancelled" } : prev
          );
        } else {
          alert("Failed to cancel order");
        }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">{language === "ar" ? "تفاصيل الطلب" : "Order Details"}</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => router.back()}>{language === "ar" ? "عودة" : "Back"}</Button>
              <Link href="/profile" className="text-sm text-primary hover:underline">{language === "ar" ? "الملف الشخصي" : "Profile"}</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b">
                    <div>
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "رقم الطلب" : "Order ID"}</div>
                      <div className="font-bold text-lg">{order.orderNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "التاريخ" : "Date"}</div>
                      <div className="font-medium">{new Date(order.orderDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</div>
                      <div className="mt-1 text-xs text-primary font-medium">
                        {language === "ar" ? "تاريخ التوصيل المتوقع: " : "Estimated Delivery: "}
                        {order.delivryDate ? new Date(order.delivryDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US") : "---"}
                      </div>
                      <div className="mt-2 text-right">{statusBadge(order.status, language)}</div>
                      {(order.status === "Pending" || order.status === "Processing") && (
                        <div className="mt-3">
                          <Button
                            variant="destructive"
                            onClick={handleCancelOrder}
                          >
                            {language === "ar" ? "إلغاء الطلب" : "Cancel Order"}
                          </Button>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                      <div className="font-medium">{order.phoneNumber}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">{language === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                      <span>{formatPrice(order.total)} {t("products.price")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "الشحن" : "Shipping"}</span>
                      <span>{formatPrice(0)} {t("products.price")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-foreground border-t pt-3 mt-3">
                      <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                      <span className="text-primary">{formatPrice(order.total)} {t("products.price")}</span>
                    </div>
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
                      {language === "ar" ? "طريقة الدفع" : "Payment Method"}: {order.paymentStatus}
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
