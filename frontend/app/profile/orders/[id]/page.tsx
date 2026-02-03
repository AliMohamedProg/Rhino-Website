"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Sample detailed order data (replace with API fetch later)
const sampleOrder = {
  id: "ORD-1001",
  date: "2025-12-01",
  status: "Processing",
  shipping: {
    name: "Ahmed Ali",
    address: "25 Talaat Harb, Cairo, Egypt",
    phone: "01001234567",
  },
  items: [
    { sku: "ITM-001", name: "Oak Dining Table", qty: 1, price: "1,200 EGP" },
    { sku: "ITM-002", name: "Ceramic Vase", qty: 2, price: "125 EGP" },
  ],
  subtotal: "1,450 EGP",
  shippingCost: "50 EGP",
  total: "1,500 EGP",
}

function statusBadge(status: string) {
  switch (status) {
    case "Processing":
      return <Badge variant="default">{status}</Badge>
    case "Shipped":
      return <Badge variant="secondary">{status}</Badge>
    case "Delivered":
      return <Badge variant="outline">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function OrderViewPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const orderId = (params as { id?: string })?.id || sampleOrder.id

  // TODO: fetch order by id from backend

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">{language === "ar" ? "تفاصيل الطلب" : "Order Details"}</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.back()}>{language === "ar" ? "عودة" : "Back"}</Button>
              <Link href="/profile/orders" className="text-sm text-primary hover:underline">{language === "ar" ? "قائمة الطلبات" : "Orders"}</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "رقم الطلب" : "Order ID"}</div>
                      <div className="font-medium">{orderId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "التاريخ" : "Date"}</div>
                      <div className="font-medium">{sampleOrder.date}</div>
                      <div className="mt-2">{statusBadge(sampleOrder.status)}</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">{language === "ar" ? "العناصر" : "Items"}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "ar" ? "المنتج" : "Product"}</TableHead>
                        <TableHead>{language === "ar" ? "الكمية" : "Qty"}</TableHead>
                        <TableHead>{language === "ar" ? "السعر" : "Price"}</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleOrder.items.map((it) => (
                        <TableRow key={it.sku}>
                          <TableCell className="font-medium">{it.name}</TableCell>
                          <TableCell>{it.qty}</TableCell>
                          <TableCell>{it.price}</TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{language === "ar" ? "الشحن" : "Shipping"}</h3>
                  <div className="space-y-1">
                    <div className="font-medium">{sampleOrder.shipping.name}</div>
                    <div className="text-sm text-muted-foreground">{sampleOrder.shipping.address}</div>
                    <div className="text-sm text-muted-foreground">{sampleOrder.shipping.phone}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside>
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{language === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                      <span>{sampleOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === "ar" ? "الشحن" : "Shipping"}</span>
                      <span>{sampleOrder.shippingCost}</span>
                    </div>
                    <div className="flex justify-between font-medium text-foreground border-t pt-2">
                      <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                      <span>{sampleOrder.total}</span>
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
