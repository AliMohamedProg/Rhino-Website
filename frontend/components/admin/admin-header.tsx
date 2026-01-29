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

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{language === "ar" ? "الإشعارات" : "Notifications"}</span>
                <Badge variant="secondary">3 {language === "ar" ? "جديد" : "new"}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                  <span className="font-medium">
                    {language === "ar" ? notification.titleAr : notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {language === "ar" ? notification.timeAr : notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                {t("common.viewAll")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@homzmart.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {t("common.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {t("sidebar.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {t("common.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
