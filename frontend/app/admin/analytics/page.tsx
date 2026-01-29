"use client";

import { useState } from "react";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Download, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 120, visitors: 15000 },
  { month: "Feb", revenue: 52000, orders: 145, visitors: 18000 },
  { month: "Mar", revenue: 48000, orders: 130, visitors: 16500 },
  { month: "Apr", revenue: 61000, orders: 175, visitors: 22000 },
  { month: "May", revenue: 55000, orders: 160, visitors: 20000 },
  { month: "Jun", revenue: 67000, orders: 190, visitors: 25000 },
  { month: "Jul", revenue: 72000, orders: 210, visitors: 28000 },
  { month: "Aug", revenue: 69000, orders: 200, visitors: 26500 },
  { month: "Sep", revenue: 78000, orders: 225, visitors: 30000 },
  { month: "Oct", revenue: 82000, orders: 240, visitors: 32000 },
  { month: "Nov", revenue: 95000, orders: 280, visitors: 38000 },
  { month: "Dec", revenue: 110000, orders: 320, visitors: 45000 },
];

const categoryData = [
  { name: "Living Room", value: 35, color: "#2563eb" },
  { name: "Bedroom", value: 28, color: "#16a34a" },
  { name: "Office", value: 18, color: "#dc2626" },
  { name: "Kids", value: 12, color: "#ca8a04" },
  { name: "Outdoor", value: 7, color: "#9333ea" },
];

const trafficSourceData = [
  { source: "Organic Search", visitors: 42000, percentage: 35 },
  { source: "Direct", visitors: 30000, percentage: 25 },
  { source: "Social Media", visitors: 24000, percentage: 20 },
  { source: "Paid Ads", visitors: 18000, percentage: 15 },
  { source: "Referral", visitors: 6000, percentage: 5 },
];

const conversionData = [
  { stage: "Visitors", count: 120000, rate: 100 },
  { stage: "Product Views", count: 85000, rate: 70.8 },
  { stage: "Add to Cart", count: 25000, rate: 20.8 },
  { stage: "Checkout", count: 12000, rate: 10 },
  { stage: "Purchase", count: 8500, rate: 7.1 },
];

export default function AnalyticsPage() {
  const { t, isRTL } = useAdminLanguage();
  const [dateRange, setDateRange] = useState("year");

  const metrics = [
    {
      title: isRTL ? "إجمالي الإيرادات" : "Total Revenue",
      value: "SAR 834,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: isRTL ? "إجمالي الطلبات" : "Total Orders",
      value: "2,395",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: isRTL ? "إجمالي الزوار" : "Total Visitors",
      value: "317,000",
      change: "+15.3%",
      trend: "up",
      icon: Eye,
    },
    {
      title: isRTL ? "معدل التحويل" : "Conversion Rate",
      value: "7.1%",
      change: "-0.5%",
      trend: "down",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("analytics")}</h1>
          <p className="text-muted-foreground">
            {isRTL ? "تحليلات مفصلة لأداء متجرك" : "Detailed analytics for your store performance"}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{isRTL ? "هذا الأسبوع" : "This Week"}</SelectItem>
              <SelectItem value="month">{isRTL ? "هذا الشهر" : "This Month"}</SelectItem>
              <SelectItem value="quarter">{isRTL ? "هذا الربع" : "This Quarter"}</SelectItem>
              <SelectItem value="year">{isRTL ? "هذا العام" : "This Year"}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 me-2" />
            {isRTL ? "تصدير" : "Export"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">{isRTL ? "الإيرادات" : "Revenue"}</TabsTrigger>
          <TabsTrigger value="orders">{isRTL ? "الطلبات" : "Orders"}</TabsTrigger>
          <TabsTrigger value="traffic">{isRTL ? "الزيارات" : "Traffic"}</TabsTrigger>
          <TabsTrigger value="conversion">{isRTL ? "التحويل" : "Conversion"}</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{isRTL ? "الإيرادات الشهرية" : "Monthly Revenue"}</CardTitle>
                <CardDescription>
                  {isRTL ? "نظرة عامة على الإيرادات خلال العام" : "Revenue overview throughout the year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `${value/1000}K`} />
                      <Tooltip 
                        formatter={(value: number) => [`SAR ${value.toLocaleString()}`, isRTL ? "الإيرادات" : "Revenue"]}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#2563eb" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? "المبيعات حسب الفئة" : "Sales by Category"}</CardTitle>
                <CardDescription>
                  {isRTL ? "توزيع المبيعات على الفئات" : "Sales distribution by category"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="font-medium">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "الطلبات الشهرية" : "Monthly Orders"}</CardTitle>
              <CardDescription>
                {isRTL ? "عدد الطلبات خلال العام" : "Number of orders throughout the year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [value, isRTL ? "الطلبات" : "Orders"]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Bar dataKey="orders" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? "الزوار الشهريين" : "Monthly Visitors"}</CardTitle>
                <CardDescription>
                  {isRTL ? "عدد الزوار خلال العام" : "Visitor count throughout the year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `${value/1000}K`} />
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString(), isRTL ? "الزوار" : "Visitors"]}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Line type="monotone" dataKey="visitors" stroke="#9333ea" strokeWidth={2} dot={{ fill: "#9333ea" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? "مصادر الزيارات" : "Traffic Sources"}</CardTitle>
                <CardDescription>
                  {isRTL ? "من أين يأتي زوارك" : "Where your visitors come from"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSourceData.map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.visitors.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-primary" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "قمع التحويل" : "Conversion Funnel"}</CardTitle>
              <CardDescription>
                {isRTL ? "رحلة العميل من الزيارة إلى الشراء" : "Customer journey from visit to purchase"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="text-end">
                        <p className="font-medium">{stage.count.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{stage.rate}%</p>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-muted ms-11">
                      <div 
                        className="h-3 rounded-full bg-primary transition-all" 
                        style={{ width: `${stage.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
