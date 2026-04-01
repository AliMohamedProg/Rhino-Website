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
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/products"

interface Order {
  id: string
  orderDate: string
  country: string
  city: string
  address: string
  total: number
  status: string
  paymentStatus: string
}

const menuItems = [
  { key: "profile.orders", icon: Package },
  { key: "profile.settings", icon: Settings },
]

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab] = useState("profile.orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.get("api/order/my-orders")
      setOrders(data)
      setOrderCount(data.length)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    setWishlistCount(0)
  }, [])
  const handleCancelOrder = async (orderId: string) => {
    try {
      const result = await ApiClient.post(`api/order/cancel-order/${orderId}`, {})
      if (result === true) {
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId ? { ...o, status: "Cancelled" } : o
          )
        );
      } else {
        alert("Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

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
                {/* <div className="relative w-24 h-24 mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.userName ? user.userName.charAt(0).toUpperCase() : "G"}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                    <Settings size={14} />
                  </button>
                </div> */}
                <h2 className="text-xl font-semibold text-foreground">{user?.userName || "Guest User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || "guest@example.com"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    {language === "ar" ? "عضو نشط" : "Active Member"}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{orderCount}</p>
                  <p className="text-xs text-muted-foreground">{language === "ar" ? "طلبات" : "Orders"}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${activeTab === item.key
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 font-medium"
                      : "text-foreground hover:bg-muted"
                      }`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <item.icon size={20} className={activeTab === item.key ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground"} />
                    <span>{t(item.key) || (language === "ar" ? getArabicLabel(item.key) : item.key)}</span>
                  </button>
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
                </div>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length === 0 ? (
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
                    {orders.map((order) => (

                      <div key={order.id} className="border border-border rounded-lg p-3 sm:p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-1">
                              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                                <Package size={14} className="text-muted-foreground" />
                                {language === "ar" ? "تاريخ الطلب" : "Order Date"}: {new Date(order.orderDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                              </p>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-lg sm:text-xl font-bold text-foreground">{formatPrice(order.total)}</span>
                                <span className="text-xs text-muted-foreground uppercase">{t("products.price")}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
                                <MapPin size={14} className="flex-shrink-0" />
                                <span className="truncate">{order.city}, {order.address}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                            <div className="flex flex-col items-start sm:items-end gap-2">
                              {/* Status Badges */}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                                order.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                order.status === "Cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                order.status === "Processing" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                order.status === "Shipped" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}>
                                {order.status}
                              </span>
                              
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${
                                order.paymentStatus === "Paid" ? "border border-green-200 text-green-600 bg-green-50/50 dark:border-green-800 dark:text-green-500" :
                                order.paymentStatus === "Refunded" ? "border border-purple-200 text-purple-600 bg-purple-50/50 dark:border-purple-800 dark:text-purple-500" :
                                order.paymentStatus === "Failed" ? "border border-red-200 text-red-600 bg-red-50/50 dark:border-red-800 dark:text-red-500" :
                                "border border-yellow-200 text-yellow-600 bg-yellow-50/50 dark:border-yellow-800 dark:text-yellow-500"
                              }`}>
                                {language === "ar" ? "الدفع" : "Payment"}: {order.paymentStatus}
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Link
                                href={`/profile/orders/${order.id}`}
                                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline font-bold"
                              >
                                {language === "ar" ? "عرض التفاصيل" : "View Details"}
                              </Link>
                              
                              {(order.status === "Pending" || order.status === "Processing") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all rounded-lg h-7 sm:h-8 px-2 sm:px-4 text-[10px] sm:text-xs flex items-center gap-1 bg-transparent group"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-125 transition-transform duration-200"></span>
                                  {language === "ar" ? "إلغاء" : "Cancel"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
