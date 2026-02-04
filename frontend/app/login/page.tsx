"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // مهم جدًا لمنع إعادة تحميل الصفحة

    try {
      const res = await fetch("https://localhost:7282/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 مهم جدًا عشان الكوكي يتحفظ
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error(language === "ar" ? "فشل تسجيل الدخول" : "Login failed")
      }

      const data = await res.json()
      console.log("Logged in user:", data)

      // ممكن تعمل redirect بعد تسجيل الدخول
      // window.location.href = "/dashboard"

    } catch (err: any) {
      alert(err.message)
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-6">{language === "ar" ? "تسجيل الدخول" : "Login"}</h1>

          <div className="bg-card rounded-lg border border-border p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} />
              </div>

              <div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                placeholder={language === "ar" ? "كلمة المرور" : "Password"}/>
              </div>

              <Button type="submit" className="w-full">
                {language === "ar" ? "تسجيل الدخول" : "Sign In"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4">
              {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <Link href="/register" className="text-primary hover:underline">
                {language === "ar" ? "إنشاء حساب" : "Create one"}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
