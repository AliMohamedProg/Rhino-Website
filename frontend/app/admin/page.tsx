"use client"

import { useAdminLanguage } from "@/context/admin-language-context"
import { StatsCard } from "@/components/admin/stats-card"
import { AreaChartCard, BarChartCard, PieChartCard, RevenueChart } from "@/components/admin/admin-charts"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { TopProductsCard } from "@/components/admin/top-products-card"
import {
  mockDashboardStats,
  mockSalesChartData,
  mockOrdersChartData,
  mockCategoryChartData,
  mockRevenueByDayData,
  mockOrders,
  mockProducts,
} from "@/lib/admin-data"
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { t, language, dir } = useAdminLanguage()

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M ${t("common.egp")}`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${t("common.egp")}`
    }
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

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
          value={formatCurrency(mockDashboardStats.totalRevenue)}
          growth={mockDashboardStats.revenueGrowth}
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.totalOrders")}
          value={mockDashboardStats.totalOrders}
          growth={mockDashboardStats.ordersGrowth}
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.totalProducts")}
          value={mockDashboardStats.totalProducts}
          growth={mockDashboardStats.productsGrowth}
          trend="up"
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.totalUsers")}
          value={mockDashboardStats.totalUsers}
          growth={mockDashboardStats.usersGrowth}
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AreaChartCard
          title={t("dashboard.salesChart")}
          data={mockSalesChartData}
        />
        <BarChartCard
          title={t("dashboard.ordersChart")}
          data={mockOrdersChartData}
        />
      </div>

      {/* Secondary Charts and Tables */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PieChartCard
          title={t("analytics.topCategories")}
          data={mockCategoryChartData}
          className="lg:col-span-1"
        />
        <RevenueChart
          title={t("dashboard.revenueChart")}
          data={mockRevenueByDayData}
          className="lg:col-span-2 -mt-6 lg:-mt-8"
        />
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentOrdersTable orders={mockOrders} className="lg:col-span-2" />
        <TopProductsCard products={mockProducts} className="lg:col-span-1" />
      </div>
    </div>
  )
}
