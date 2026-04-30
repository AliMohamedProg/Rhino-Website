"use client"

import React, { useEffect, useState } from "react"
import { AdminLanguageProvider } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAuth } from "@/app/Context/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Loading from "@/app/loading"
import Link from "next/link"
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
  LayoutGrid,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navSections = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Commerce",
    items: [
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "fabrics", href: "/admin/fabrics", icon: ImageIcon },
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Styles", href: "/admin/styles", icon: FolderTree },
      { title: "Categories", href: "/admin/categories", icon: LayoutGrid },
      { title: "Sliders", href: "/admin/sliders", icon: ImageIcon },
    ],
  },
  {
    label: "Audience",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Reviews", href: "/admin/reviews", icon: Star },
      { title: "Alliances", href: "/admin/alliances", icon: Building2 },
    ],
  },
  {
    label: "Insights",
    items: [{ title: "Analytics", href: "/admin/analytics", icon: BarChart3 }],
  },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-[#111827]">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d66a49] to-[#8f3f2a] text-lg font-bold text-white shadow-[0_10px_24px_rgba(214,106,73,0.35)]">
            R
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Rhino Admin</p>
            <p className="text-xs text-slate-400">Control Center</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="space-y-4 px-3">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1.5">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all",
                      active
                        ? "border-[#d66a49]/35 bg-gradient-to-r from-[#d66a49]/25 to-[#8f3f2a]/20 text-white shadow-[0_12px_30px_rgba(214,106,73,0.2)]"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-[#ffd3c7]" : "text-slate-500 group-hover:text-slate-300")} />
                    <span className="font-medium">{item.title}</span>
                    {active && <ChevronRight className="ml-auto h-4 w-4 text-[#ffd3c7]" />}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <p className="text-sm font-medium text-white">Admin Session</p>
          <p className="text-xs text-slate-400">admin@rhino.com</p>
        </div>
      </div>
    </aside>
  )
}

function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-700 hover:bg-[#f6ede8] md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden w-80 items-center gap-2 rounded-xl border border-[#8f3f2a]/15 bg-white px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-[#8f7c71]" />
            <input
              type="text"
              placeholder="Search products, orders, users..."
              className="w-full bg-transparent text-sm text-[#3a2c26] outline-none placeholder:text-[#9b8d83]"
            />
            <span className="rounded-md border border-[#8f3f2a]/15 bg-[#f9f3ef] px-1.5 py-0.5 text-[11px] text-[#8f7c71]">⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-700 hover:bg-[#f6ede8]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ef4444]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl text-slate-700 hover:bg-[#f6ede8]"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
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
    document.documentElement.setAttribute("data-theme", "admin")
    return () => {
      document.documentElement.removeAttribute("data-theme")
    }
  }, [])

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
    <div className="admin-app relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(214,106,73,0.18),_transparent_44%),radial-gradient(circle_at_bottom_left,_rgba(58,42,34,0.12),_transparent_42%),linear-gradient(180deg,_#f7efe8,_#f3ece5)]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-[#d66a49]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-6 h-80 w-80 rounded-full bg-[#c7aea2]/28 blur-3xl" />

      <div className="fixed inset-y-0 left-0 z-50 hidden w-72 md:block">
        <AdminSidebar />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 border-r border-white/20 bg-[#111827] p-0">
          <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="md:ml-72">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6">
          <div className="rounded-3xl border border-white/65 bg-white/72 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-6">
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
