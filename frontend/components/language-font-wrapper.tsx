"use client"

import React from "react"
import { useLanguage } from "@/context/language-context"

export function LanguageFontWrapper({ children, geistClass, cairoClass }: { children: React.ReactNode; geistClass: string; cairoClass: string }) {
  const { language } = useLanguage()
  return <div className={language === "ar" ? cairoClass : geistClass}>{children}</div>
}
