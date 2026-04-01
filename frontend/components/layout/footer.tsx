"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Facebook, Twitter, Instagram, Youtube, Contact } from "lucide-react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

interface Category {
  id: string
  nameAr: string
  nameEn: string
  currentState: number
}

export function Footer() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiClient.get("api/category") as Category[]
        setCategories((Array.isArray(data) ? data : []).filter((c) => c.currentState === 1))
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
  }, [])


  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <div className="bg-primary-foreground rounded-lg flex items-center justify-center p-2 mb-3">
              <Image
                src="/images/logo-websait.png"
                alt="Wood Decor Logo"
                width={70}
                height={70}
                sizes="70px"
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold mb-3">
              {language === "ar" ? "وود ديكور" : "Wood Decor"}
            </span>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {language === "ar"
                ? "وجهتك الأولى للأثاث والديكور المنزلي في مصر"
                : "Your #1 destination for furniture and home décor in Egypt"}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/wood.decor.eg" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/wood.decor.eg/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-start">
            <h3 className="text-lg font-bold mb-4">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-primary-foreground transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/product" className="hover:text-primary-foreground transition-colors">{t("nav.furniture")}</Link></li>
              <li><Link href="/blog" className="hover:text-primary-foreground transition-colors">{language === "ar" ? "المدونة" : "Blog"}</Link></li>
              <li><Link href="/careers" className="hover:text-primary-foreground transition-colors">{language === "ar" ? "الوظائف" : "Careers"}</Link></li>
              <li><Link href="/contact" className="hover:text-primary-foreground transition-colors">{t("footer.contact")}</Link></li>
              <li><Link href="/about" className="hover:text-primary-foreground transition-colors">{t("footer.about")}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center md:text-start">
            <h3 className="text-lg font-bold mb-4">{language === "ar" ? "الأقسام" : "Categories"}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {categories.length === 0 && (
                <li className="text-primary-foreground/60">
                  {language === "ar" ? "تحميل..." : "Loading..."}
                </li>
              )}

              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {language === "ar" ? category.nameAr : category.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-start">
            <h3 className="text-lg font-bold mb-4">{language === "ar" ? "الدعم" : "Support"}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/faq" className="hover:text-primary-foreground transition-colors">{t("footer.faq")}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-foreground transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/returns" className="hover:text-primary-foreground transition-colors">{language === "ar" ? "سياسة الاسترجاع" : "Returns Policy"}</Link></li>
              <li><Link href="/terms" className="hover:text-primary-foreground transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  )
}
