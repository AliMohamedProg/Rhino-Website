"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { Facebook, Twitter, Instagram, Youtube, Contact } from "lucide-react"

export function Footer() {
  const { t, language } = useLanguage()


  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-4">
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

            <span className="text-xl font-bold">
              {language === "ar" ? "وود ديكور" : "Wood Decor"}
            </span>
          </div>

          {/* Description */}
          <p className="text-primary-foreground/80 text-sm mb-4 w-2xl">
            {language === "ar"
              ? "وجهتك الأولى للأثاث والديكور المنزلي في مصر"
              : "Your #1 destination for furniture and home décor in Egypt"}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-7">
            <a href="https://www.facebook.com/wood.decor.eg" className="hover:opacity-80 transition-opacity">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/wood.decor.eg/" className="hover:opacity-80 transition-opacity">
              <Instagram size={20} />
            </a>
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
