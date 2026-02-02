"use client"

import React from "react"

import { AdminLanguageProvider, useAdminLanguage } from "@/context/admin-language-context"
import { ThemeProvider } from "@/context/theme-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { dir } = useAdminLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background" dir={dir}>
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
    <ThemeProvider>
      <AdminLanguageProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminLanguageProvider>
    </ThemeProvider>
  )
}
