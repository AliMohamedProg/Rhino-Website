"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Sliders", href: "/admin/sliders", icon: ImageIcon },
]

const secondaryNavItems: NavItem[] = [
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
]

const bottomNavItems: NavItem[] = [
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
          active
            ? "bg-admin-sidebar-active text-admin-sidebar-active-foreground shadow-sm"
            : "text-admin-sidebar-foreground/70 hover:bg-admin-sidebar-hover hover:text-white",
          collapsed && "justify-center px-2"
        )}
        aria-current={active ? "page" : undefined}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-admin-sidebar-active rounded-r-full" />
        )}
        <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", active && "text-inherit")} />
        {!collapsed && <span>{item.title}</span>}
        <span className="sr-only">{active ? "(current page)" : ""}</span>
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-admin-sidebar-border bg-admin-sidebar transition-all duration-300 shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-admin-sidebar-border px-4 bg-gradient-to-r from-admin-sidebar-active/10 to-transparent">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-admin-primary to-blue-600 flex items-center justify-center shadow-lg shadow-admin-primary/30 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-websait.png"
                alt="Wood Decor Logo"
                fill
                sizes="40px"
                className="object-contain p-1.5 rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg tracking-tight">Rhino</span>
              <span className="text-xs text-admin-sidebar-foreground/60">Admin Panel</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="mx-auto group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-admin-primary to-blue-600 shadow-lg shadow-admin-primary/30 group-hover:scale-105 transition-transform">
              <span className="text-lg font-bold text-white">R</span>
            </div>
          </Link>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          <div className="mb-2">
            <span className="px-3 text-xs font-semibold text-admin-sidebar-foreground/40 uppercase tracking-wider">
              {!collapsed && "Main"}
            </span>
          </div>
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          <div className="mx-3 my-3 border-t border-admin-sidebar-border/50" />

          <div className="mb-2">
            <span className="px-3 text-xs font-semibold text-admin-sidebar-foreground/40 uppercase tracking-wider">
              {!collapsed && "Analytics"}
            </span>
          </div>
          {secondaryNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          <div className="mx-3 my-3 border-t border-admin-sidebar-border/50" />

          <div className="mb-2">
            <span className="px-3 text-xs font-semibold text-admin-sidebar-foreground/40 uppercase tracking-wider">
              {!collapsed && "System"}
            </span>
          </div>
          {bottomNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-admin-sidebar-border/50 p-3 bg-admin-sidebar-hover/30">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-center text-admin-sidebar-foreground/70 hover:text-white hover:bg-admin-sidebar-hover transition-all duration-200",
            collapsed && "px-2"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </div>
          )}
          <span className="sr-only">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
        </Button>
      </div>
    </aside>
  )
}