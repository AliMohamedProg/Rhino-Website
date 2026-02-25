"use client"

import { useAdminLanguage } from "@/context/admin-language-context"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import { GlobalSearch } from "@/components/admin/global-search"
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  Settings,
  Menu,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { t, language, setLanguage, dir } = useAdminLanguage()
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  const notifications = [
    { id: 1, title: "New order received", titleAr: "تم استلام طلب جديد", time: "5 min ago", timeAr: "منذ 5 دقائق" },
    { id: 2, title: "Low stock alert", titleAr: "تنبيه مخزون منخفض", time: "1 hour ago", timeAr: "منذ ساعة" },
    { id: 3, title: "New user registered", titleAr: "مستخدم جديد مسجل", time: "2 hours ago", timeAr: "منذ ساعتين" },
  ]

  return (
    <>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <header
        className={cn(
          "sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6",
          dir === "rtl" ? "flex-row-reverse" : ""
        )}
      >
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Search Button */}
        <Button
          variant="outline"
          className="relative flex-1 max-w-md justify-start text-muted-foreground bg-transparent"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4 me-2" />
          <span className="hidden sm:inline">{t("common.searchPlaceholder")}</span>
          <span className="sm:hidden">{language === "ar" ? "بحث..." : "Search..."}</span>
          <Kbd className="ms-auto hidden sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </Kbd>
        </Button>

        {/* Actions */}
        <div className={cn("flex items-center gap-2", dir === "rtl" ? "flex-row-reverse" : "")}>
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
              <DropdownMenuLabel>{t("settings.language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={cn(language === "en" && "bg-accent")}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("ar")}
                className={cn(language === "ar" && "bg-accent")}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
    </>
  )
}
