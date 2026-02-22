"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { TopProductsCard } from "@/components/admin/top-products-card"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import type { Order, Product } from "@/lib/admin-data"
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const { t, language, dir } = useAdminLanguage()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await ApiClient.get("api/admin/dashboard")
        if (data) {
          setDashboardData(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M ${t("common.egp")}`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${t("common.egp")}`
    }
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  // Use API data only
  const stats = dashboardData
  const recentOrdersData = dashboardData?.recentOrders || []
  const topProductsData = dashboardData?.topProducts || []

  // Transform API data for charts
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
        name: language === "ar" ? item.nameAr : item.nameEn,
        value: item.totalSold,
      }))
    : []

  // Revenue chart - use monthly sales data (same as sales chart since no daily data available)
  const revenueChartData = salesChartData

  // Convert dashboard recent orders to Order format for the table
  const recentOrders: Order[] = recentOrdersData
    ? recentOrdersData.map((order, index) => ({
        id: `order-${index}`,
        orderNumber: order.orderNumber,
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

  // Convert dashboard top products to Product format
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
      {/* Page Header */}
      <div className={cn(dir === "rtl" && "text-right")}>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.welcome")}, Admin!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.totalRevenue")}
          value={formatCurrency(stats?.totalRevenue || 0)}
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.totalOrders")}
          value={stats?.totalOrders || 0}
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.totalProducts")}
          value={stats?.totalProducts || 0}
          trend="up"
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.totalUsers")}
          value={stats?.totalUsers || 0}
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AreaChartCard
          title={t("dashboard.salesChart")}
          data={salesChartData}
        />
        <BarChartCard
          title={t("dashboard.ordersChart")}
          data={ordersChartData}
        />
      </div>

      {/* Secondary Charts and Tables */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PieChartCard
          title={t("analytics.topCategories")}
          data={categoryChartData}
          className="lg:col-span-1"
        />
        <RevenueChart
          title={t("dashboard.revenueChart")}
          data={revenueChartData}
          className="lg:col-span-2 -mt-6 lg:-mt-0"
        />
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentOrdersTable orders={recentOrders} className="lg:col-span-2" />
        <TopProductsCard products={topProducts} className="lg:col-span-1" />
      </div>
    </div>
  )
}
