"use client"

import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  const { t, language } = useLanguage()

  const footerLinks = [
    {
      title: language === "ar" ? "خدمة العملاء" : "Customer Service",
      links: [
        { label: t("footer.contact"), href: "/contact" },
        { label: t("footer.faq"), href: "/faq" },
        { label: language === "ar" ? "الشحن والتوصيل" : "Shipping & Delivery", href: "/shipping" },
        { label: language === "ar" ? "الإرجاع والاستبدال" : "Returns & Exchange", href: "/returns" },
      ],
    },
    {
      title: language === "ar" ? "عن وود ديكور" : "About Wood Decor",
      links: [
        { label: t("footer.about"), href: "/about" },
        { label: language === "ar" ? "وظائف" : "Careers", href: "/careers" },
        { label: language === "ar" ? "المدونة" : "Blog", href: "/blog" },
      ],
    },
    {
      title: language === "ar" ? "القانونية" : "Legal",
      links: [
        { label: t("footer.privacy"), href: "/privacy" },
        { label: t("footer.terms"), href: "/terms" },
      ],
    },
  ]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">W</span>
              </div>
              <span className="text-xl font-bold">{language === "ar" ? "وود ديكور" : "Wood Decor"}</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {language === "ar"
                ? "وجهتك الأولى للأثاث والديكور المنزلي في مصر"
                : "Your #1 destination for furniture and home décor in Egypt"}
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  )
}
