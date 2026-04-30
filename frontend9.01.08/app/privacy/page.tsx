"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"

export default function PrivacyPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground text-center mb-12">
            {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>

          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "مقدمة" : "Introduction"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "نحن في وود ديكور نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك."
                  : "At Wood Decor, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information."}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "البيانات التي نجمعها" : "Data We Collect"}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  {language === "ar"
                    ? "معلومات الاتصال (الاسم، البريد الإلكتروني، رقم الهاتف)"
                    : "Contact information (name, email, phone number)"}
                </li>
                <li>{language === "ar" ? "عنوان التوصيل" : "Delivery address"}</li>
                <li>{language === "ar" ? "سجل الطلبات والمشتريات" : "Order and purchase history"}</li>
                <li>
                  {language === "ar" ? "معلومات الدفع (مشفرة ومؤمنة)" : "Payment information (encrypted and secured)"}
                </li>
                <li>{language === "ar" ? "بيانات التصفح والكوكيز" : "Browsing data and cookies"}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "كيف نستخدم بياناتك" : "How We Use Your Data"}
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{language === "ar" ? "معالجة وتوصيل طلباتك" : "Processing and delivering your orders"}</li>
                <li>{language === "ar" ? "التواصل معك بشأن طلباتك" : "Communicating with you about your orders"}</li>
                <li>{language === "ar" ? "تحسين تجربة التسوق" : "Improving your shopping experience"}</li>
                <li>
                  {language === "ar"
                    ? "إرسال العروض والتحديثات (بموافقتك)"
                    : "Sending offers and updates (with your consent)"}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "حماية البيانات" : "Data Protection"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "نستخدم تقنيات تشفير متقدمة وإجراءات أمنية صارمة لحماية بياناتك الشخصية من الوصول غير المصرح به."
                  : "We use advanced encryption technologies and strict security measures to protect your personal data from unauthorized access."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "اتصل بنا" : "Contact Us"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى الاتصال بنا على support@wooddecor.com"
                  : "If you have any questions about this privacy policy, please contact us at support@wooddecor.com"}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
