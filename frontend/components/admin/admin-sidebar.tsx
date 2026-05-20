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
  ImageIcon,
  Star,
  Layers,
  Palette,
  Tag,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Collections", href: "/admin/collections", icon: Layers },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Styles", href: "/admin/styles", icon: Palette },
  { title: "Types", href: "/admin/types", icon: Tag },
  { title: "Sliders", href: "/admin/sliders", icon: ImageIcon },
]

const secondaryNavItems: NavItem[] = [
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { title: "Reviews", href: "/admin/reviews", icon: Star },
]

const bottomNavItems: NavItem[] = [
  // { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

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
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-admin-primary text-white shadow-md"
            : "text-admin-sidebar-foreground/70 hover:bg-admin-sidebar-hover hover:text-white"
        )}
        aria-current={active ? "page" : undefined}
      >
        <Icon className={cn("h-5 w-5 shrink-0", active && "text-white")} />
        <span>{item.title}</span>
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-admin-sidebar border-r border-admin-sidebar-border transition-all duration-300",
        "w-64"
      )}
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-center border-b border-admin-sidebar-border px-4">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-admin-primary to-indigo-500 shadow-lg shadow-admin-primary/30">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg">Rhino</span>
            <span className="text-xs text-admin-sidebar-foreground/60">Admin</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          <div className="mb-2">
            <span className="px-3 text-xs font-semibold text-admin-sidebar-foreground/40 uppercase tracking-wider">
              Main
            </span>
          </div>
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          <div className="mx-3 my-3 border-t border-admin-sidebar-border/50" />

          <div className="mb-2">
            <span className="px-3 text-xs font-semibold text-admin-sidebar-foreground/40 uppercase tracking-wider">
              Analytics
            </span>
          </div>
          {secondaryNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          <div className="mx-3 my-3 border-t border-admin-sidebar-border/50" />

          <div className="mb-2">
            <span className="px-3 text-xs font-semibold text-admin-sidebar-foreground/40 uppercase tracking-wider">
              System
            </span>
          </div>
          {bottomNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
