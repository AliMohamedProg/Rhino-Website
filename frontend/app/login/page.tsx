"use client"

import React, { useState, useCallback } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

export default function LoginPage() {
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
        await ApiClient.post("api/auth/login", { email, password })
        window.location.href = "/"
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong"
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [email, password],
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div
          className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="main"
          aria-label="Login"
        >
          <h1 className="text-4xl font-serif text-mahogany mb-2 text-center italic">
            Login
          </h1>
          <p className="text-sm text-taupe mb-10 text-center font-medium tracking-wide uppercase">
            Enter your email and password
          </p>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-xl transition-shadow hover:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-bold tracking-tight">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  autoComplete="email"
                  className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-[10px] font-bold tracking-[0.2em] text-taupe uppercase ml-2">
                  Password
                </Label>
                <PasswordInput
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 h-14 px-6"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-16 rounded-2xl bg-mahogany text-white font-bold tracking-[0.15em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg text-xs"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
               <p className="text-sm text-taupe font-medium">
                Don't have an account?
              </p>
              <Link
                href="/register"
                className="text-mahogany font-bold tracking-[0.1em] uppercase hover:underline text-xs"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
