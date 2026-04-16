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
  isAuthenticated: boolean
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
      const data = await ApiClient.auth.me()
      // Map backend response to user object
      // Handle both PascalCase (Swagger) and camelCase (JS usual) and the previous userId/userName structure
      const userEmail = data.email || data.Email || data.userName || data.UserName;
      const isAdminEmail = userEmail === "admin@gmail.com";

      setUser({
        id: data.id || data.Id || data.userId || data.UserId || "",
        userName: data.fullName || data.fullNameEn || data.userName || data.UserName || userEmail || "User",
        email: userEmail || "",
        role: data.role || data.Role || (isAdminEmail ? "Admin" : "User"),
        isAdmin: (data.role || data.Role || "").toLowerCase() === "admin" || isAdminEmail
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
    try {
      await ApiClient.auth.logout()
    } catch (err) {
      console.error("Logout failed:", err)
    }
    setUser(null)
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
