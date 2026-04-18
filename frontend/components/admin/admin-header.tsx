"use client"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { GlobalSearch } from "@/components/admin/global-search"
import {
  Search,
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/Context/auth-context"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <header
        className={cn(
          "sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-admin-header-border bg-admin-header-bg/95 backdrop-blur-sm px-4 md:px-6 shadow-sm"
        )}
        role="banner"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-admin-primary/10 hover:text-admin-primary focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Button
            variant="outline"
            className="relative flex-1 max-w-md justify-start text-admin-text-muted bg-transparent border-admin-card-border hover:bg-admin-primary/5 hover:border-admin-primary hover:text-admin-primary focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 transition-all duration-200"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 me-2" />
            <span className="hidden sm:inline">Search products, orders, users...</span>
            <span className="sm:hidden">Search...</span>
            <Kbd className="ms-auto hidden sm:inline-flex bg-muted text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </Kbd>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-admin-primary/10 hover:text-admin-primary focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-admin-danger rounded-full border-2 border-admin-header-bg" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="font-medium">New order received</span>
                <span className="text-xs text-muted-foreground">Order #1234 - $299.00</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="font-medium">New review submitted</span>
                <span className="text-xs text-muted-foreground">5 stars for Oak Dining Table</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-admin-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-admin-primary/10 focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-admin-primary to-blue-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden lg:inline text-sm font-medium text-admin-text-primary">
                  {user?.userName || "Admin"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.userName || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "admin@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-admin-danger focus:text-admin-danger"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}