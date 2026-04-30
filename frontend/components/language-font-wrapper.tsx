"use client"

import React from "react"
import { useLanguage } from "@/context/language-context"

export function LanguageFontWrapper({ 
  children, 
  geistClass, 
  cairoClass,
  playfairClass,
  ralewayClass
}: { 
  children: React.ReactNode; 
  geistClass: string; 
  cairoClass: string;
  playfairClass: string;
  ralewayClass: string;
}) {
  const { language } = useLanguage()
  return (
    <div className={`${language === "ar" ? cairoClass : geistClass} ${playfairClass} ${ralewayClass} font-sans`}>
      {children}
    </div>
  )
}
