"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
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
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")
            
            const res = await fetch(`${apiUrl}/api/order/mark-as-paid/${pendingOrderId}?transactionId=${idParam}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include"
            })

            localStorage.removeItem("pendingOrderId")
            setStatus("success")
          } catch (err) {
            console.error("Failed to mark order as paid:", err)
            localStorage.removeItem("pendingOrderId")
            setStatus("success") 
          }
        } else {
          setStatus("success")
        }
      }
    }

    processPaymentReturn()
  }, [successParam, idParam])

  if (status === "loading") {
    return (
      <div className="bg-white rounded-[3rem] p-16 text-center max-w-md mx-4 shadow-xl border border-gray-50 flex flex-col items-center">
        <Loader2 size={60} className="text-mahogany animate-spin mb-8" />
        <h1 className="text-3xl font-bold text-black mb-3 italic tracking-tight">Finalizing...</h1>
        <p className="text-taupe text-[11px] font-bold tracking-[0.2em] uppercase">Securing your furniture legacy</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="bg-white rounded-[3rem] p-16 text-center max-w-md mx-4 shadow-xl border border-gray-50 flex flex-col items-center">
        <XCircle size={60} className="text-red-500 mb-8" />
        <h1 className="text-3xl font-bold text-black mb-4">Payment Incomplete</h1>
        <p className="text-taupe text-sm font-medium mb-10 leading-relaxed">
          The transaction could not be verified. Please contact support or try another payment method.
        </p>
        <Link href="/checkout" className="w-full">
          <Button className="w-full h-14 rounded-full bg-mahogany text-white text-[11px] font-bold tracking-widest uppercase hover:bg-black transition-all">Retry Checkout</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[3rem] p-16 text-center max-w-lg mx-4 shadow-2xl border border-gray-50 flex flex-col items-center">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8">
        <CheckCircle size={40} />
      </div>
      <h1 className="text-4xl font-black text-black mb-4 tracking-tighter italic">Signature Success.</h1>
      <p className="text-taupe text-sm font-medium mb-12 leading-relaxed max-w-xs">
        Your order has been confirmed. Our artisans are now preparing your pieces for their new home.
      </p>
      <div className="flex flex-col w-full gap-4">
        <Link href="/profile">
          <Button className="w-full h-16 rounded-full bg-mahogany text-white text-[11px] font-bold tracking-widest uppercase hover:scale-105 transition-all shadow-lg shadow-mahogany/20">
            View My Orders
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full h-14 rounded-full text-taupe text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 underline-offset-8 decoration-mahogany">
            Return to Gallery
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 bg-[#FDFDFD] flex items-center justify-center py-20">
        <Suspense fallback={<div className="text-mahogany font-bold">Initializing Success Page...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

