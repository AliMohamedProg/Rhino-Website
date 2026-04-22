"use client"

import Link from "next/link"
import Image from "next/image"
import { User, Package, Settings, LogOut, Moon, Sun, Globe, Heart, CreditCard, MapPin, Bell, Shield, HelpCircle } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
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

const getStatusMeta = (status: string, language: "ar" | "en") => {
  const normalized = (status || "pending").toLowerCase()

  if (normalized.includes("deliver")) {
    return {
      label: language === "ar" ? "تم التوصيل" : "Delivered",
      className: "bg-green-100 text-green-800 border-green-200",
    }
  }
  if (normalized.includes("ship")) {
    return {
      label: language === "ar" ? "تم الشحن" : "Shipped",
      className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }
  }
  if (normalized.includes("process")) {
    return {
      label: language === "ar" ? "قيد المعالجة" : "Processing",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    }
  }
  if (normalized.includes("cancel")) {
    return {
      label: language === "ar" ? "ملغي" : "Cancelled",
      className: "bg-red-100 text-red-800 border-red-200",
    }
  }
  if (normalized.includes("refund")) {
    return {
      label: language === "ar" ? "مرتجع" : "Refunded",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    }
  }

  return {
    label: language === "ar" ? "قيد الانتظار" : "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }
}

const menuItems = [
  { key: "profile.orders", icon: Package },
]

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage()
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
      const data = await ApiClient.get<Order[]>("api/order/my-orders")
      const list = Array.isArray(data) ? data : []
      setOrders(list)
      setOrderCount(list.length)
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
      <main className="flex-1 w-full px-6 md:px-16 py-20 bg-[#FAFAFA]">
        <div className="max-w-[1800px] mx-auto">
          <header className="mb-16">
            <h1 className="text-5xl md:text-6xl font-serif text-mahogany mb-4 italic tracking-tight">
              {t("profile.title")}
            </h1>
            <p className="text-taupe uppercase tracking-[0.3em] font-bold text-[10px] sm:text-xs">
              Manage your orders and account settings
            </p>
          </header>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Sidebar - Sticky on desktop */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 border border-sand/30 backdrop-blur-sm">
              {/* Avatar Section */}
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 rounded-full bg-blush flex items-center justify-center text-mahogany text-3xl font-serif italic mb-6 shadow-inner">
                  {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                </div>
                <h2 className="text-2xl font-serif text-mahogany mb-1 italic">
                  {user?.userName || "Guest Member"}
                </h2>
                <p className="text-[10px] text-taupe font-bold tracking-widest uppercase mb-4 opacity-60">
                  {user?.email || "member@rhino.com"}
                </p>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-green-50 text-green-600 border border-green-100">
                  {language === "ar" ? "حساب موثق" : "Verified Account"}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-10">
                <div className="bg-[#FDFDFD] rounded-3xl p-6 border border-sand/20 text-center shadow-sm">
                  <p className="text-3xl font-serif text-mahogany italic mb-1">{orderCount}</p>
                  <p className="text-[9px] text-taupe font-black tracking-widest uppercase opacity-60">
                    {language === "ar" ? "إجمالي الطلبات" : "Total Orders"}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-left transition-all duration-300 ${activeTab === item.key
                      ? "bg-mahogany text-white shadow-lg shadow-mahogany/20 scale-[1.02]"
                      : "text-taupe hover:bg-blush hover:text-mahogany"
                      }`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <item.icon size={18} className={activeTab === item.key ? "text-white" : "opacity-60"} />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {t(item.key) || (language === "ar" ? getArabicLabel(item.key) : item.key.split('.')[1])}
                    </span>
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-sand/30">
                  <button
                    onClick={async () => {
                      await logout()
                      window.location.href = "/"
                    }}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
                  >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {t("profile.logout")}
                    </span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-10">


            {/* Orders Preview Tab */}
            {activeTab === "profile.orders" && (
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-12 border border-sand/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-serif text-mahogany italic flex items-center gap-4">
                    <Package size={28} className="text-mahogany/40" />
                    {language === "ar" ? "طلباتي" : "My Orders"}
                  </h3>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-2 border-mahogany/20 border-t-mahogany rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-24 h-24 mx-auto mb-8 bg-blush rounded-full flex items-center justify-center text-mahogany opacity-40">
                      <Package size={40} />
                    </div>
                    <h4 className="text-2xl font-serif text-mahogany italic mb-4">
                      {language === "ar" ? "لا توجد طلبات بعد" : "Your collection is empty"}
                    </h4>
                    <p className="text-taupe text-sm max-w-md mx-auto mb-10 opacity-70">
                      {language === "ar" ? "ابدأ التسوق واكتشف منتجاتنا المميزة" : "Discover our handcrafted furniture and start building your legacy home."}
                    </p>
                    <Link href="/products">
                      <Button className="bg-mahogany text-white px-12 h-16 rounded-full font-bold tracking-[0.2em] uppercase text-[10px] hover:scale-110 transition-transform">
                        {language === "ar" ? "تسوق الآن" : "Start Shopping"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => {
                      const statusMeta = getStatusMeta(order.status, language === "ar" ? "ar" : "en")
                      return (
                      <div key={order.id} className="group bg-[#FDFDFD] border border-sand/20 rounded-[2rem] p-10 hover:shadow-xl hover:shadow-mahogany/5 transition-all duration-500">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${statusMeta.className}`}>
                                {statusMeta.label}
                              </span>
                              <span className="text-taupe opacity-30">|</span>
                              <p className="text-[10px] text-taupe font-bold tracking-widest uppercase opacity-60">
                                {new Date(order.orderDate).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>

                            <div className="flex flex-col gap-1">
                              <p className="text-3xl font-serif text-mahogany italic">
                                {formatPrice(order.total)}
                              </p>
                              <div className="flex items-center gap-2 text-taupe text-[10px] font-bold tracking-widest uppercase opacity-60">
                                <MapPin size={12} />
                                <span>{order.city}, {order.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto mt-4 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-t-0 border-sand/30">
                            <Link
                              href={`/profile/orders/${order.id}`}
                              className="flex-1 xl:flex-none text-center px-8 py-4 rounded-full border border-mahogany text-mahogany text-[9px] font-black tracking-widest uppercase hover:bg-mahogany hover:text-white transition-all duration-300"
                            >
                              {language === "ar" ? "التفاصيل" : "View Details"}
                            </Link>

                            {(order.status || "").toLowerCase().includes("pending") || (order.status || "").toLowerCase().includes("process") ? (
                              <Button
                                variant="ghost"
                                className="flex-1 xl:flex-none h-12 px-8 text-red-500 hover:bg-red-50 text-[9px] font-black tracking-widest uppercase rounded-full"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                {language === "ar" ? "إلغاء الطلب" : "Cancel order"}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                )}
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
  }
  return labels[key] || key
}
