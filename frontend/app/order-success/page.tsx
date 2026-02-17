"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  const { language, t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary flex items-center justify-center">
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
      </main>
      <Footer />
    </div>
  )
}
