"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"

function OrderSuccessContent() {
  const { language, t } = useLanguage()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const successParam = searchParams.get("success")
  const idParam = searchParams.get("id")

  useEffect(() => {
    const processPaymentReturn = async () => {
      // If there are no paymob params, it means the user just came from a COD order.
      if (successParam === null) {
        setStatus("success")
        return
      }

      if (successParam === "false") {
        setStatus("error")
        return
      }

      if (successParam === "true") {
        const pendingOrderId = localStorage.getItem("pendingOrderId")
        if (pendingOrderId && idParam) {
          try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")
            const res = await fetch(`${apiUrl}/api/order/mark-as-paid/${pendingOrderId}?transactionId=${idParam}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include"
            })

            localStorage.removeItem("pendingOrderId")

            if (res.ok) {
              setStatus("success")
            } else {
              // Fallback to success as long as transaction was successful in Paymob
              setStatus("success")
            }
          } catch (err) {
            console.error("Failed to mark order as paid:", err)
            localStorage.removeItem("pendingOrderId")
            setStatus("success") // Fallback
          }
        } else {
          // No pending order ID found, but payment was successful
          setStatus("success")
        }
      }
    }

    processPaymentReturn()
  }, [successParam])

  if (status === "loading") {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center max-w-md mx-4">
        <Loader2 size={80} className="mx-auto text-primary animate-spin mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {language === "ar" ? "جاري معالجة الطلب..." : "Processing Order..."}
        </h1>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center max-w-md mx-4">
        <XCircle size={80} className="mx-auto text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {language === "ar" ? "فشلت عملية الدفع" : "Payment Failed"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === "ar"
            ? "لم نتمكن من إتمام عملية الدفع. يرجى المحاولة مرة أخرى."
            : "We couldn't process your payment. Please try again."}
        </p>
        <Link href="/checkout">
          <Button className="w-full">{language === "ar" ? "العودة للدفع" : "Back to Checkout"}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-12 text-center max-w-md mx-4">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {language === "ar" ? "تم تأكيد طلبك!" : "Order Confirmed!"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {language === "ar"
          ? "شكراً لطلبك. سنتواصل معك قريباً لتأكيد التفاصيل."
          : "Thank you for your order. We will contact you soon to confirm the details."}
      </p>
      <div className="flex flex-col gap-3">
        <Link href="/profile">
          <Button className="w-full">{t("profile.orders")}</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full bg-transparent">
            {t("cart.continueShopping")}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary flex items-center justify-center">
        <Suspense fallback={<div className="text-foreground">Loading...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
