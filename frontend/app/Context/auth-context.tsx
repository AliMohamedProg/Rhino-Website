"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

type User = {
  id: string
  userName: string
  email: string
  role?: string
  isAdmin?: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const data = await ApiClient.get("api/auth/me")
      // Map backend response to user object
      // Falling back to "Admin" role if the email matches the seed admin
      const isAdminEmail = data.userName === "admin@gmail.com" || data.email === "admin@gmail.com";

      setUser({
        id: data.userId,
        userName: data.userName,
        email: data.email || data.userName,
        role: data.role || (isAdminEmail ? "Admin" : "User"),
        isAdmin: data.isAdmin || isAdminEmail
      })
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const logout = async () => {
    await ApiClient.post("api/auth/logout", {})
    setUser(null)
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
