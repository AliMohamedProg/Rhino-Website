"use client"

import React from "react"

import { AdminLanguageProvider } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAuth } from "@/app/Context/auth-context"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  BarChart3,
  ImageIcon,
  Star,
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Sliders", href: "/admin/sliders", icon: ImageIcon },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  // { title: "Settings", href: "/admin/settings", icon: Settings },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex flex-col h-full bg-gradient-to-b from-[#121826] via-[#151d2d] to-[#111827]">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B3F32] to-[#9e5948] shadow-lg shadow-[#7B3F32]/30">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">Rhino</span>
            <span className="block text-xs text-slate-400 -mt-0.5">Control Center</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border",
                  active
                    ? "bg-gradient-to-r from-[#7B3F32]/25 to-[#9e5948]/20 text-white border-[#7B3F32]/30 shadow-[0_8px_20px_rgba(123,63,50,0.25)]"
                    : "text-slate-300 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
                )}
              >
                <Icon className={cn("w-5 h-5", active ? "text-[#f2c8bc]" : "text-slate-500 group-hover:text-slate-300")} />
                <span>{item.title}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto text-[#f2c8bc]" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B3F32] to-[#9e5948] flex items-center justify-center">
            <span className="text-xs font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@rhino.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#7B3F32]/10 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-600 hover:bg-[#f7efe7]"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#f8f0e7] border border-[#7B3F32]/10 rounded-xl w-80">
            <Search className="w-4 h-4 text-[#8f7c71]" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-[#4b3d34] placeholder-[#8f7c71] outline-none"
            />
            <span className="text-xs text-[#8f7c71] bg-white px-1.5 py-0.5 rounded border border-[#7B3F32]/10">⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-600 hover:bg-[#f7efe7]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-[#f7efe7]"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
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

  if (loading) return <Loading />
  if (!user || user.role?.toLowerCase() !== "admin") return null

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8efe6] via-[#f6eee8] to-[#f3ebe2] overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 rounded-full bg-[#7B3F32]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#C1AFA0]/25 blur-3xl" />

      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-72">
        <AdminSidebar />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 border-r border-white/20 bg-[#121826]">
          <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="md:ml-72">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6">
          <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-4 md:p-6">
            {children}
          </div>
        </main>
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
