"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Building2, Users, Truck, Award } from "lucide-react"

export default function AboutPage() {
  const { language } = useLanguage()

  const stats = [
    {
      icon: Building2,
      value: "2015",
      label: { en: "Founded", ar: "تأسست" },
    },
    {
      icon: Users,
      value: "500K+",
      label: { en: "Happy Customers", ar: "عميل سعيد" },
    },
    {
      icon: Truck,
      value: "27",
      label: { en: "Governorates", ar: "محافظة" },
    },
    {
      icon: Award,
      value: "10K+",
      label: { en: "Products", ar: "منتج" },
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" ? "عن وود ديكور" : "About Wood Decor"}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {language === "ar"
                ? "وجهتك الأولى للأثاث والديكور المنزلي في مصر"
                : "Your #1 destination for furniture and home décor in Egypt"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg border border-border p-6 text-center">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-secondary" />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label[language]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">{language === "ar" ? "قصتنا" : "Our Story"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "تأسست وود ديكور في عام 2015 برؤية واضحة: جعل الأثاث عالي الجودة والديكور المنزلي في متناول كل منزل مصري. بدأنا كمتجر صغير ونمونا لنصبح واحدة من أكبر منصات الأثاث والديكور المنزلي في مصر."
                  : "Wood Decor was founded in 2015 with a clear vision: to make high-quality furniture and home décor accessible to every Egyptian home. We started as a small store and have grown to become one of the largest furniture and home décor platforms in Egypt."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {language === "ar" ? "مهمتنا" : "Our Mission"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "نسعى لتوفير تجربة تسوق سلسة ومريحة لعملائنا، مع تقديم منتجات عالية الجودة بأسعار تنافسية وخدمة توصيل سريعة وموثوقة في جميع أنحاء مصر."
                  : "We strive to provide a seamless and convenient shopping experience for our customers, offering high-quality products at competitive prices with fast and reliable delivery across Egypt."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {language === "ar" ? "لماذا تختارنا؟" : "Why Choose Us?"}
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  {language === "ar"
                    ? "تشكيلة واسعة من الأثاث والديكور المنزلي"
                    : "Wide selection of furniture and home décor"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  {language === "ar" ? "أسعار تنافسية وعروض مستمرة" : "Competitive prices and ongoing promotions"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  {language === "ar" ? "توصيل سريع لجميع المحافظات" : "Fast delivery to all governorates"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  {language === "ar" ? "ضمان جودة على جميع المنتجات" : "Quality guarantee on all products"}
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
