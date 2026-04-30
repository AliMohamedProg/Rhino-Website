"use client"

import React, { useState, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

export default function RegisterPage() {
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

    if (!firstName) newErrors.firstName = "First name is required."
    if (!lastName) newErrors.lastName = "Last name is required."
    if (!email) {
        newErrors.email = "Email is required."
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) newErrors.email = "Invalid email format."
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required."
    } else {
      const phoneRegex = /^[0-9]{11}$/
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = "Invalid phone number. It must be 11 digits."
      }
    }

    if (!password) newErrors.password = "Password is required."
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters."

    if (password !== confirm) newErrors.confirm = "Passwords do not match."

    setErrors(newErrors)
    return Object.values(newErrors).every((e) => e === "")
  }, [firstName, lastName, email, phoneNumber, password, confirm])

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
        await ApiClient.post("api/auth/register", body)
        alert("Account created successfully")
        window.location.href = "/login"
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong"
        alert(`Error: ${msg}`)
      } finally {
        setLoading(false)
      }
    },
    [validate, firstName, lastName, email, password, confirm, phoneNumber],
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div
          className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="main"
          aria-label="Register"
        >
          <h1 className="text-4xl font-serif text-mahogany mb-2 text-center italic">
            Create Account
          </h1>
          <p className="text-sm text-taupe mb-10 text-center font-medium tracking-wide uppercase">
            Join the legacy of premium craftsmanship
          </p>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-xl transition-shadow hover:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reg-firstName" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">First Name</Label>
                  <Input
                    id="reg-firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                  />
                  {errors.firstName && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-lastName" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">Last Name</Label>
                  <Input
                    id="reg-lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                  />
                  {errors.lastName && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">Phone Number</Label>
                <Input
                  id="reg-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                />
                {errors.phoneNumber && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">Password</Label>
                    <PasswordInput
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                    />
                    {errors.password && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{errors.password}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reg-confirm" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">Confirm Password</Label>
                    <PasswordInput
                    id="reg-confirm"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm Password"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                    />
                    {errors.confirm && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{errors.confirm}</p>
                    )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 rounded-2xl bg-mahogany text-white font-bold tracking-[0.15em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg text-xs"
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
                <p className="text-sm text-taupe font-medium">Already have an account?</p>
                <Link
                    href="/login"
                    className="text-mahogany font-bold tracking-[0.1em] uppercase hover:underline text-xs"
                >
                    Sign in
                </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
