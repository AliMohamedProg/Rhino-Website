"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Truck, Clock, MapPin, Package } from "lucide-react"

export default function ShippingPage() {
  const { language } = useLanguage()

  const features = [
    {
      icon: Truck,
      title: { en: "Free Delivery", ar: "توصيل مجاني" },
      description: {
        en: "Free delivery on orders above 2000 EGP",
        ar: "توصيل مجاني للطلبات فوق 2000 جنيه",
      },
    },
    {
      icon: Clock,
      title: { en: "Fast Delivery", ar: "توصيل سريع" },
      description: {
        en: "3-7 business days delivery time",
        ar: "3-7 أيام عمل وقت التوصيل",
      },
    },
    {
      icon: MapPin,
      title: { en: "Nationwide", ar: "جميع المحافظات" },
      description: {
        en: "We deliver to all 27 governorates",
        ar: "نوصل لجميع المحافظات الـ 27",
      },
    },
    {
      icon: Package,
      title: { en: "Safe Packaging", ar: "تغليف آمن" },
      description: {
        en: "Products are carefully packaged for safe delivery",
        ar: "يتم تغليف المنتجات بعناية للتوصيل الآمن",
      },
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground text-center mb-12">
            {language === "ar" ? "الشحن والتوصيل" : "Shipping & Delivery"}
          </h1>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="font-semibold text-foreground mb-2">{feature.title[language]}</h3>
                <p className="text-sm text-muted-foreground">{feature.description[language]}</p>
              </div>
            ))}
          </div>

          {/* Shipping Info */}
          <div className="max-w-3xl mx-auto space-y-8">
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "رسوم الشحن" : "Shipping Rates"}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start py-3 font-medium text-foreground">
                        {language === "ar" ? "قيمة الطلب" : "Order Value"}
                      </th>
                      <th className="text-start py-3 font-medium text-foreground">
                        {language === "ar" ? "القاهرة والجيزة" : "Cairo & Giza"}
                      </th>
                      <th className="text-start py-3 font-medium text-foreground">
                        {language === "ar" ? "باقي المحافظات" : "Other Governorates"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3">{language === "ar" ? "أقل من 2000 ج.م" : "Below 2000 EGP"}</td>
                      <td className="py-3">50 {language === "ar" ? "ج.م" : "EGP"}</td>
                      <td className="py-3">100 {language === "ar" ? "ج.م" : "EGP"}</td>
                    </tr>
                    <tr>
                      <td className="py-3">{language === "ar" ? "2000 ج.م وأكثر" : "2000 EGP and above"}</td>
                      <td className="py-3 text-green-600">{language === "ar" ? "مجاني" : "Free"}</td>
                      <td className="py-3 text-green-600">{language === "ar" ? "مجاني" : "Free"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === "ar" ? "أوقات التوصيل" : "Delivery Times"}
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    {language === "ar" ? "القاهرة والجيزة:" : "Cairo & Giza:"}
                  </strong>{" "}
                  {language === "ar" ? "3-5 أيام عمل" : "3-5 business days"}
                </li>
                <li>
                  <strong className="text-foreground">{language === "ar" ? "الإسكندرية:" : "Alexandria:"}</strong>{" "}
                  {language === "ar" ? "4-6 أيام عمل" : "4-6 business days"}
                </li>
                <li>
                  <strong className="text-foreground">
                    {language === "ar" ? "باقي المحافظات:" : "Other Governorates:"}
                  </strong>{" "}
                  {language === "ar" ? "5-7 أيام عمل" : "5-7 business days"}
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
