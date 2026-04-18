"use client"

import React from "react"

import { AdminLanguageProvider, useAdminLanguage } from "@/context/admin-language-context"
import { cairo } from "@/app/fonts"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAuth } from "@/app/Context/auth-context"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { dir, language } = useAdminLanguage()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role?.toLowerCase() !== "admin") {
        router.push("/access-denied")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <Loading />
  }

  if (!user || user.role?.toLowerCase() !== "admin") {
    return null
  }

  return (
    <div className={cn("min-h-screen bg-background", language === "ar" && cairo.className)} dir={dir}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side={dir === "rtl" ? "right" : "left"}
          className="w-64 p-0"
        >
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          dir === "rtl" ? "md:mr-64" : "md:ml-64"
        )}
      >
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminLanguageProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminLanguageProvider>
  )
}
