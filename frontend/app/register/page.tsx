"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)

  // State لتخزين رسائل الأخطاء لكل حقل
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    phoneNumber: "",
  })

  const validate = () => {
    const newErrors: typeof errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm: "",
      phoneNumber: "",
    }

// الاسم الأول و الأخير
if (!firstName) newErrors.firstName = language === "ar" ? "الاسم الأول مطلوب." : "First name is required."
else if (firstName.length > 50) newErrors.firstName = language === "ar" ? "الاسم الأول يجب ألا يزيد عن 50 حرفاً." : "First name must be less than 50 characters."

if (!lastName) newErrors.lastName = language === "ar" ? "الاسم الأخير مطلوب." : "Last name is required."
else if (lastName.length > 50) newErrors.lastName = language === "ar" ? "الاسم الأخير يجب ألا يزيد عن 50 حرفاً." : "Last name must be less than 50 characters."


    // البريد الإلكتروني
    if (!email) newErrors.email = language === "ar" ? "البريد الإلكتروني مطلوب." : "Email is required."
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) newErrors.email = language === "ar" ? "صيغة البريد الإلكتروني غير صحيحة." : "Invalid email format."
    }
// رقم الهاتف إجباري ويجب أن يكون 11 رقم
if (!phoneNumber) {
  newErrors.phoneNumber = language === "ar" 
    ? "رقم الهاتف مطلوب." 
    : "Phone number is required."
} else {
  const phoneRegex = /^[0-9]{11}$/
  if (!phoneRegex.test(phoneNumber)) {
    newErrors.phoneNumber = language === "ar" 
      ? "رقم الهاتف غير صالح. يجب أن يحتوي على 11 رقم." 
      : "Invalid phone number. It must be exactly 11 digits."
  }
}
    // كلمة المرور
    if (!password) newErrors.password = language === "ar" ? "كلمة المرور مطلوبة." : "Password is required."
    else if (password.length < 8) newErrors.password = language === "ar" ? "كلمة المرور يجب ان تكون على الاقل 8 حرفاً." : "Password must be at least 8 characters."
    else {
      if (!/[0-9]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)." : "Password must contain at least one digit."
      else if (!/[a-z]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)." : "Password must contain at least one lowercase letter."
      else if (!/[A-Z]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)." : "Password must contain at least one uppercase letter."
      else if (!/[^a-zA-Z0-9]/.test(password)) newErrors.password = language === "ar" ? "يجب أن تحتوي كلمة المرور على رمز واحد على الأقل (مثلاً @، #، $)." : "Password must contain at least one special character."
    }

    // تأكيد كلمة المرور
    if (password !== confirm) newErrors.confirm = language === "ar" ? "كلمة المرور غير متطابقة." : "Passwords do not match."

    setErrors(newErrors)

    // لو فيه أي خطأ رجع false
    return Object.values(newErrors).every(e => e === "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
          "Accept-Language": language === "ar" ? "ar" : "en"
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(", ") : (data.message || (language === "ar" ? "فشل التسجيل" : "Registration failed"))
        throw new Error(errorMsg)
      }

      alert(language === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully")
      // router.push("/")
    } catch (err: any) {
      console.error("Fetch Error:", err)
      alert(language === "ar" ? `حدث خطأ: ${err.message}` : `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
            {language === "ar" ? "إنشاء حساب" : "Register"}
          </h1>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={language === "ar" ? "الاسم الأول" : "First Name"} />
                  {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={language === "ar" ? "الاسم الأخير" : "Last Name"} />
                  {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={language === "ar" ? "رقم الهاتف" : "Phone Number"} />
                {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={language === "ar" ? "كلمة المرور" : "Password"} />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"} />
                {errors.confirm && <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (language === "ar" ? "جاري المعالجة..." : "Processing...") : (language === "ar" ? "إنشاء حساب" : "Create Account")}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              {language === "ar" ? "هل لديك حساب؟" : "Already have an account?"}{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
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
