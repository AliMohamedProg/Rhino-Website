"use client"

import React, { useState, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      setLoading(true)

      try {
        const res = await fetch("https://localhost:7282/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
          throw new Error(language === "ar" ? "فشل تسجيل الدخول" : "Login failed")
        }

        const data = await res.json()
        window.location.href = "/"
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : (language === "ar" ? "حدث خطأ" : "Something went wrong")
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [email, password, language],
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="main"
          aria-label={language === "ar" ? "تسجيل الدخول" : "Login"}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {language === "ar" ? "أدخل بريدك وكلمة المرور" : "Enter your email and password"}
          </p>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm transition-shadow hover:shadow-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "ar" ? "example@email.com" : "example@email.com"}
                  required
                  autoComplete="email"
                  aria-invalid={!!error}
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </Label>
                <PasswordInput
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "ar" ? "كلمة المرور" : "Password"}
                  required
                  autoComplete="current-password"
                  error={!!error}
                  className="transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200"
                disabled={loading}
              >
                {loading
                  ? (language === "ar" ? "جاري تسجيل الدخول..." : "Signing in...")
                  : (language === "ar" ? "تسجيل الدخول" : "Sign In")}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-5 pt-4 border-t border-border text-center">
              {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
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
