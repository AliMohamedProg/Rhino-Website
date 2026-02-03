"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: hook up real auth
    alert(language === "ar" ? "تم تسجيل الدخول (محاكاة)" : "Logged in (demo)")
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
                <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="password">{language === "ar" ? "كلمة المرور" : "Password"}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
