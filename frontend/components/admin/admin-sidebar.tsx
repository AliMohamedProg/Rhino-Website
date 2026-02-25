"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAdminLanguage } from "@/context/admin-language-context"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  BarChart3,
  Settings,
  FileText,
  Warehouse,
  Ticket,
  Star,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import Image from "next/image"

interface NavItem {
  titleKey: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: NavItem[] = [
  { titleKey: "sidebar.dashboard", href: "/admin", icon: LayoutDashboard },
  { titleKey: "sidebar.products", href: "/admin/products", icon: Package },
  { titleKey: "sidebar.orders", href: "/admin/orders", icon: ShoppingCart },
  { titleKey: "sidebar.users", href: "/admin/users", icon: Users },
  { titleKey: "sidebar.categories", href: "/admin/categories", icon: FolderTree },
  { titleKey: "sidebar.sliders", href: "/admin/sliders", icon: ImageIcon },
]

const secondaryNavItems: NavItem[] = [
  { titleKey: "sidebar.analytics", href: "/admin/analytics", icon: BarChart3 },
  { titleKey: "sidebar.reviews", href: "/admin/reviews", icon: Star },
]

const bottomNavItems: NavItem[] = [
  { titleKey: "sidebar.settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t, dir } = useAdminLanguage()
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
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
        {!collapsed && <span>{t(item.titleKey)}</span>}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        dir === "rtl" ? "right-0 border-l border-r-0" : "left-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/logo-websait.png"
              alt="Wood Decor Logo"
              width={40}
              height={40}
              sizes="40px"
              className="object-contain"
              priority
            />
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">W</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {/* Main Navigation */}
          <div className="mb-4">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 my-2 border-t border-sidebar-border" />

          {/* Secondary Navigation */}
          <div className="mb-4">
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 my-2 border-t border-sidebar-border" />

          {/* Bottom Navigation */}
          <div>
            {bottomNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {dir === "rtl" ? (
            collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  )
}
