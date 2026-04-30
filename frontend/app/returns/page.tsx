"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ReturnsPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground text-center mb-12">
            {language === "ar" ? "الإرجاع والاستبدال" : "Returns & Exchange"}
          </h1>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Return Policy */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {language === "ar" ? "سياسة الإرجاع" : "Return Policy"}
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                {language === "ar"
                  ? "نقدم سياسة إرجاع سهلة ومريحة. يمكنك إرجاع أي منتج خلال 14 يوماً من تاريخ التوصيل."
                  : "We offer an easy and convenient return policy. You can return any product within 14 days of delivery."}
              </p>
            </section>

            {/* Conditions */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  {language === "ar" ? "شروط الإرجاع" : "Return Conditions"}
                </h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  {language === "ar"
                    ? "المنتج في حالته الأصلية وغير مستخدم"
                    : "Product is in original condition and unused"}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  {language === "ar" ? "التغليف الأصلي متوفر" : "Original packaging is available"}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  {language === "ar" ? "جميع الملحقات والوثائق موجودة" : "All accessories and documents are present"}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  {language === "ar" ? "فاتورة الشراء متوفرة" : "Purchase invoice is available"}
                </li>
              </ul>
            </section>

            {/* Non-returnable */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-destructive" />
                <h2 className="text-xl font-semibold text-foreground">
                  {language === "ar" ? "منتجات لا يمكن إرجاعها" : "Non-Returnable Items"}
                </h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  {language === "ar" ? "المنتجات المصنعة حسب الطلب" : "Custom-made products"}
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  {language === "ar" ? "المنتجات المستعملة أو التالفة" : "Used or damaged products"}
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  {language === "ar" ? "منتجات العناية الشخصية" : "Personal care items"}
                </li>
              </ul>
            </section>

            {/* How to Return */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {language === "ar" ? "كيفية الإرجاع" : "How to Return"}
                </h2>
              </div>
              <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                <li>{language === "ar" ? "اتصل بخدمة العملاء على 19888" : "Call customer service at 19888"}</li>
                <li>{language === "ar" ? "احصل على رقم طلب الإرجاع" : "Get your return request number"}</li>
                <li>
                  {language === "ar" ? "جهز المنتج في تغليفه الأصلي" : "Prepare the product in its original packaging"}
                </li>
                <li>
                  {language === "ar"
                    ? "سيتم استلام المنتج خلال 3-5 أيام عمل"
                    : "Product will be picked up within 3-5 business days"}
                </li>
                <li>{language === "ar" ? "استرداد المبلغ خلال 7-14 يوم عمل" : "Refund within 7-14 business days"}</li>
              </ol>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
