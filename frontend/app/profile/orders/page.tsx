"use client"

import React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const sampleOrders = [
  { id: "ORD-1001", date: "2025-12-01", total: "2,450 EGP", items: 3, status: "Processing" },
  { id: "ORD-1002", date: "2025-11-10", total: "1,200 EGP", items: 1, status: "Shipped" },
  { id: "ORD-1003", date: "2025-10-22", total: "4,800 EGP", items: 5, status: "Delivered" },
]

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

export default function OrdersPage() {
  const { language, t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">{language === "ar" ? "طلباتي" : "My Orders"}</h1>
            <Link href="/profile" className="text-sm text-primary hover:underline">
              {language === "ar" ? "العودة للملف الشخصي" : "Back to profile"}
            </Link>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            {sampleOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{language === "ar" ? "لا توجد طلبات" : "You have no orders yet."}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "رقم الطلب" : "Order ID"}</TableHead>
                    <TableHead>{language === "ar" ? "التاريخ" : "Date"}</TableHead>
                    <TableHead>{language === "ar" ? "العناصر" : "Items"}</TableHead>
                    <TableHead>{language === "ar" ? "المبلغ" : "Total"}</TableHead>
                    <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>{o.date}</TableCell>
                      <TableCell>{o.items}</TableCell>
                      <TableCell>{o.total}</TableCell>
                      <TableCell>{statusBadge(o.status)}</TableCell>
                      <TableCell>
                        <Link href={`/profile/orders/${o.id}`}>
                          <Button size="sm" variant="ghost">
                            {language === "ar" ? "عرض" : "View"}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>{language === "ar" ? "قائمة الطلبات الأخيرة" : "Recent orders"}</TableCaption>
              </Table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
