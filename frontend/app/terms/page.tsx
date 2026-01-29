"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"

export default function TermsPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground text-center mb-12">
            {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
          </h1>

          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "1. القبول بالشروط" : "1. Acceptance of Terms"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "باستخدامك لموقع وود ديكور، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع."
                  : "By using the Wood Decor website, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the website."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "2. المنتجات والأسعار" : "2. Products and Prices"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "جميع الأسعار المعروضة بالجنيه المصري وتشمل ضريبة القيمة المضافة. نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق."
                  : "All prices displayed are in Egyptian Pounds and include VAT. We reserve the right to modify prices without prior notice."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "3. الطلبات والدفع" : "3. Orders and Payment"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "نقبل الدفع عند الاستلام وبطاقات الائتمان. يتم تأكيد الطلب بعد التحقق من توفر المنتج ومعلومات الدفع."
                  : "We accept cash on delivery and credit cards. Orders are confirmed after verifying product availability and payment information."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "4. التوصيل" : "4. Delivery"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "نسعى لتوصيل جميع الطلبات في الوقت المحدد، لكن قد تحدث تأخيرات بسبب ظروف خارجة عن إرادتنا. سيتم إبلاغك بأي تأخير."
                  : "We strive to deliver all orders on time, but delays may occur due to circumstances beyond our control. You will be notified of any delays."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "5. الضمان" : "5. Warranty"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "تخضع جميع المنتجات لضمان الشركة المصنعة. لا يشمل الضمان الأضرار الناتجة عن سوء الاستخدام أو الحوادث."
                  : "All products are subject to the manufacturer's warranty. The warranty does not cover damage resulting from misuse or accidents."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "6. حقوق الملكية الفكرية" : "6. Intellectual Property"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "جميع المحتويات على الموقع بما في ذلك الصور والنصوص والشعارات هي ملك لوود ديكور ومحمية بموجب قوانين حقوق الملكية الفكرية."
                  : "All content on the website including images, text, and logos are the property of Wood Decor and are protected by intellectual property laws."}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
