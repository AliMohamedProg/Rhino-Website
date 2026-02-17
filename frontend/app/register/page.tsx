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

export default function RegisterPage() {
  const { language } = useLanguage()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    firstName: string
    lastName: string
    email: string
    password: string
    confirm: string
    phoneNumber: string
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    phoneNumber: "",
  })

  const validate = useCallback(() => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm: "",
      phoneNumber: "",
    }

    if (!firstName) newErrors.firstName = language === "ar" ? "الاسم الأول مطلوب." : "First name is required."
    else if (firstName.length > 50) newErrors.firstName = language === "ar" ? "الاسم الأول يجب ألا يزيد عن 50 حرفاً." : "First name must be less than 50 characters."

    if (!lastName) newErrors.lastName = language === "ar" ? "الاسم الأخير مطلوب." : "Last name is required."
    else if (lastName.length > 50) newErrors.lastName = language === "ar" ? "الاسم الأخير يجب ألا يزيد عن 50 حرفاً." : "Last name must be less than 50 characters."

    if (!email) newErrors.email = language === "ar" ? "البريد الإلكتروني مطلوب." : "Email is required."
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) newErrors.email = language === "ar" ? "صيغة البريد الإلكتروني غير صحيحة." : "Invalid email format."
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = language === "ar" ? "رقم الهاتف مطلوب." : "Phone number is required."
    } else {
      const phoneRegex = /^[0-9]{11}$/
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = language === "ar" ? "رقم الهاتف غير صالح. يجب أن يحتوي على 11 رقم." : "Invalid phone number. It must be exactly 11 digits."
      }
    }

    if (!password) newErrors.password = language === "ar" ? "كلمة المرور مطلوبة." : "Password is required."
    else if (password.length < 8) newErrors.password = language === "ar" ? "كلمة المرور يجب ان تكون على الاقل 8 حرفاً." : "Password must be at least 8 characters."
    else {
      if (!/[0-9]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)." : "Password must contain at least one digit."
      else if (!/[a-z]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)." : "Password must contain at least one lowercase letter."
      else if (!/[A-Z]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)." : "Password must contain at least one uppercase letter."
      else if (!/[^a-zA-Z0-9]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على رمز واحد على الأقل (مثلاً @، #، $)." : "Password must contain at least one special character."
    }

    if (password !== confirm) newErrors.confirm = language === "ar" ? "كلمة المرور غير متطابقة." : "Passwords do not match."

    setErrors(newErrors)
    return Object.values(newErrors).every((e) => e === "")
  }, [language, firstName, lastName, email, phoneNumber, password, confirm])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return

      setLoading(true)
      const body = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword: confirm,
        phoneNumber,
        role: "User",
      }

      try {
        const res = await fetch("https://localhost:7282/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": language === "ar" ? "ar" : "en",
          },
          body: JSON.stringify(body),
        })

        const data = await res.json()
        window.location.href = "/login"

        if (!res.ok) {
          const errorMsg = data.errors
            ? Object.values(data.errors).flat().join(", ")
            : data.message || (language === "ar" ? "فشل التسجيل" : "Registration failed")
          throw new Error(errorMsg)
        }

        alert(language === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : (language === "ar" ? "حدث خطأ" : "Something went wrong")
        alert(language === "ar" ? `حدث خطأ: ${msg}` : `Error: ${msg}`)
      } finally {
        setLoading(false)
      }
    },
    [validate, firstName, lastName, email, password, confirm, phoneNumber, language],
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="main"
          aria-label={language === "ar" ? "إنشاء حساب" : "Register"}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            {language === "ar" ? "إنشاء حساب" : "Register"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {language === "ar" ? "أدخل بياناتك لإنشاء حساب جديد" : "Enter your details to create an account"}
          </p>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm transition-shadow hover:shadow-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-firstName">{language === "ar" ? "الاسم الأول" : "First Name"}</Label>
                  <Input
                    id="reg-firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={language === "ar" ? "الاسم الأول" : "First Name"}
                    aria-invalid={!!errors.firstName}
                    className="transition-all duration-200"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-lastName">{language === "ar" ? "الاسم الأخير" : "Last Name"}</Label>
                  <Input
                    id="reg-lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={language === "ar" ? "الاسم الأخير" : "Last Name"}
                    aria-invalid={!!errors.lastName}
                    className="transition-all duration-200"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
                  aria-invalid={!!errors.email}
                  className="transition-all duration-200"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">{language === "ar" ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input
                  id="reg-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={language === "ar" ? "رقم الهاتف" : "Phone Number"}
                  aria-invalid={!!errors.phoneNumber}
                  className="transition-all duration-200"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">{language === "ar" ? "كلمة المرور" : "Password"}</Label>
                <PasswordInput
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "ar" ? "كلمة المرور" : "Password"}
                  error={!!errors.password}
                  className="transition-all duration-200"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-confirm">{language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
                <PasswordInput
                  id="reg-confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                  error={!!errors.confirm}
                  className="transition-all duration-200"
                />
                {errors.confirm && (
                  <p className="text-sm text-destructive">{errors.confirm}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200"
                disabled={loading}
              >
                {loading
                  ? (language === "ar" ? "جاري المعالجة..." : "Processing...")
                  : (language === "ar" ? "إنشاء حساب" : "Create Account")}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-5 pt-4 border-t border-border text-center">
              {language === "ar" ? "هل لديك حساب؟" : "Already have an account?"}{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {language === "ar" ? "تسجيل الدخول" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
