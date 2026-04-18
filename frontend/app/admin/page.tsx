"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { TopProductsCard } from "@/components/admin/top-products-card"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import type { Order, Product } from "@/lib/admin-data"
import { DollarSign, ShoppingCart, Package, Users, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { HeroBanner } from "@/components/home/hero-banner"
import { getPublicSliders } from "@/lib/products"

// Dashboard API types
interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  monthlySales: { month: number; monthName: string; total: number }[]
  monthlyOrders: { month: number; monthName: string; count: number }[]
  topCategories: { nameAr: string; nameEn: string; totalSold: number }[]
  recentOrders: {
    orderNumber: string
    customerName: string
    total: number
    status: string
    date: string
  }[]
  topProducts: {
    nameAr: string
    nameEn: string
    totalSold: number
    price: number
    stock: number
  }[]
}

// Lazy load chart components (recharts) for better initial bundle size
const AreaChartCard = dynamic(
  () => import("@/components/admin/admin-charts").then((m) => ({ default: m.AreaChartCard })),
  { ssr: false, loading: () => <div className="h-[300px] rounded-lg border bg-muted/30 animate-pulse" /> },
)
const BarChartCard = dynamic(
  () => import("@/components/admin/admin-charts").then((m) => ({ default: m.BarChartCard })),
  { ssr: false, loading: () => <div className="h-[300px] rounded-lg border bg-muted/30 animate-pulse" /> },
)
const PieChartCard = dynamic(
  () => import("@/components/admin/admin-charts").then((m) => ({ default: m.PieChartCard })),
  { ssr: false, loading: () => <div className="h-[300px] rounded-lg border bg-muted/30 animate-pulse" /> },
)
const RevenueChart = dynamic(
  () => import("@/components/admin/admin-charts").then((m) => ({ default: m.RevenueChart })),
  { ssr: false, loading: () => <div className="h-[300px] rounded-lg border bg-muted/30 animate-pulse" /> },
)

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [initialSliders, setInitialSliders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const [data, sliders] = await Promise.all([
          ApiClient.get("api/admin/dashboard") as Promise<DashboardData>,
          getPublicSliders()
        ])
        if (data) setDashboardData(data)
        if (sliders) setInitialSliders(sliders)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M EGP`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K EGP`
    }
    return `${amount.toLocaleString()} EGP`
  }

  const stats = dashboardData
  const recentOrdersData = dashboardData?.recentOrders || []
  const topProductsData = dashboardData?.topProducts || []

  const salesChartData = dashboardData?.monthlySales
    ? dashboardData.monthlySales.map((item) => ({
        name: item.monthName,
        value: item.total,
      }))
    : []

  const ordersChartData = dashboardData?.monthlyOrders
    ? dashboardData.monthlyOrders.map((item) => ({
        name: item.monthName,
        value: item.count,
      }))
    : []

  const categoryChartData = dashboardData?.topCategories
    ? dashboardData.topCategories.map((item) => ({
        name: item.nameEn,
        value: item.totalSold,
      }))
    : []

  const revenueChartData = salesChartData

  const recentOrders: Order[] = recentOrdersData
    ? recentOrdersData.map((order, index) => ({
        id: `order-${index}`,
        orderNumber: order.orderNumber,
        paymentMethodName: "",
        customer: {
          id: `customer-${index}`,
          name: order.customerName,
          email: "",
          phone: "",
        },
        items: [],
        subtotal: order.total,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: order.total,
        status: (order.status?.toLowerCase() as Order["status"]) || "pending",
        paymentMethod: "",
        shippingAddress: {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        createdDate: order.date || new Date().toISOString(),
        updatedAt: order.date || new Date().toISOString(),
      }))
    : []

  const topProducts: Product[] = topProductsData
    ? topProductsData.map((product) => ({
        id: `product-${product.nameEn}`,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        descriptionEn: "",
        descriptionAr: "",
        price: product.price,
        originalPrice: product.price,
        stock: product.stock,
        category: "",
        categoryId: "",
        status: "active" as const,
        featured: true,
        onSale: false,
        images: ["/placeholder.jpg"],
        mainImage: "/placeholder.jpg",
        sku: "",
        createdDate: "",
        updatedAt: "",
      }))
    : []

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-7 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl" />
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Dashboard</h1>
          <p className="text-[#7c6f65] mt-1">Welcome back, Admin. Here is your latest performance snapshot.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          trend="up"
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AreaChartCard
          title="Sales Overview"
          data={salesChartData}
        />
        <BarChartCard
          title="Orders Overview"
          data={ordersChartData}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <PieChartCard
          title="Top Categories"
          data={categoryChartData}
          className="lg:col-span-1"
        />
        <RevenueChart
          title="Revenue Overview"
          data={revenueChartData}
          className="lg:col-span-2 -mt-6 lg:-mt-0"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <RecentOrdersTable orders={recentOrders} className="lg:col-span-2" />
        <TopProductsCard products={topProducts} className="lg:col-span-1" />
      </div>
    </div>
  )
}
