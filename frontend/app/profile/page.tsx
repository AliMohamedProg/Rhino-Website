"use client"

import Link from "next/link"
import Image from "next/image"
import { User, Package, Settings, LogOut, Moon, Sun, Globe, Heart, CreditCard, MapPin, Bell, Shield, HelpCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "../Context/auth-context"
import { useEffect, useState } from "react"

const menuItems = [
  { key: "profile.orders", icon: Package, href: "/profile/orders" },
  { key: "profile.settings", icon: Settings, href: "/settings" },
]

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState("profile.orders")
  const [orderCount, setOrderCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Simulated counts - in real app, fetch from API
  useEffect(() => {
    setOrderCount(0)
    setWishlistCount(0)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-foreground">{t("profile.title")}</h1>

        <div className="grid md:grid-cols-4 gap-6">

          {/* Profile Card - Spans full width on mobile, 1 column on desktop */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl shadow-md p-6 border border-border">
              {/* Avatar Section */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.userName ? user.userName.charAt(0).toUpperCase() : "G"}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                    <Settings size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-foreground">{user?.userName || "Guest User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || "guest@example.com"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    {language === "ar" ? "عضو نشط" : "Active Member"}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{orderCount}</p>
                  <p className="text-xs text-muted-foreground">{language === "ar" ? "طلبات" : "Orders"}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{wishlistCount}</p>
                  <p className="text-xs text-muted-foreground">{language === "ar" ? "المفضلة" : "Wishlist"}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
                      activeTab === item.key 
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 font-medium" 
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <item.icon size={20} className={activeTab === item.key ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground"} />
                    <span>{t(item.key) || (language === "ar" ? getArabicLabel(item.key) : item.key)}</span>
                  </Link>
                ))}
                <button
                  onClick={async () => {
                    await logout()
                    window.location.href = "/"
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <LogOut size={20} />
                  <span>{t("profile.logout")}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 space-y-6">

            {/* Orders Preview Tab */}
            {activeTab === "profile.orders" && (
              <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Package size={24} className="text-blue-600 dark:text-blue-400" />
                    {language === "ar" ? "طلباتي" : "My Orders"}
                  </h3>
                  <Link href="/profile/orders" className="text-sm text-blue-600 hover:underline font-medium">
                    {t("products.viewMore")}
                  </Link>
                </div>
                {orderCount === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Package size={32} className="text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      {language === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
                    </h4>
                    <p className="text-gray-500 mb-4">
                      {language === "ar" ? "ابدأ التسوق واكتشف منتجاتنا المميزة" : "Start shopping and discover our amazing products"}
                    </p>
                    <Link href="/">
                      <Button className="bg-red-600 hover:bg-red-700">
                        {language === "ar" ? "تسوق الآن" : "Shop Now"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Order cards would go here */}
                  </div>
                )}
              </div>
            )}


            {/* Settings Tab */}
            {activeTab === "profile.settings" && (
              <div className="bg-card rounded-xl shadow-md p-6 border border-border space-y-8">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Settings size={24} className="text-blue-600 dark:text-blue-400" />
                  {language === "ar" ? "الإعدادات" : "Settings"}
                </h3>

                {/* Language */}
                <div className="border-b border-border pb-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2 text-lg">
                    <Globe size={20} className="text-muted-foreground" />
                    {language === "ar" ? "اللغة" : "Language"}
                  </h4>
                  <div className="flex gap-3">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      onClick={() => setLanguage("en")}
                      className={`flex-1 py-6 text-lg ${language === "en" ? "bg-blue-600 text-white" : ""}`}
                    >
                      🇬🇧 English
                    </Button>
                    <Button
                      variant={language === "ar" ? "default" : "outline"}
                      onClick={() => setLanguage("ar")} 
                      className={`flex-1 py-6 text-lg ${language === "ar" ? "bg-blue-600 text-white" : ""}`}
                    >
                      🇪🇬 العربية
                    </Button>
                  </div>
                </div>

                {/* Theme */}
                <div className="border-b border-border pb-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2 text-lg">
                    {theme === "light" ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-purple-500" />}
                    {language === "ar" ? "المظهر" : "Appearance"}
                  </h4>
                  <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sun size={20} className="text-muted-foreground" />
                      <span className="text-foreground font-medium">{language === "ar" ? "فاتح" : "Light"}</span>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium">{language === "ar" ? "داكن" : "Dark"}</span>
                      <Moon size={20} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}

function getArabicLabel(key: string): string {
  const labels: Record<string, string> = {
    "profile.orders": "الطلبات",
    "profile.settings": "الإعدادات",
  }
  return labels[key] || key
}
