"use client";

import { useState } from "react";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, Download, Calendar as CalendarIcon, 
  DollarSign, ShoppingCart, Users, Package, TrendingUp, Clock
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const reportTypes = [
  {
    id: "sales",
    icon: DollarSign,
    titleEn: "Sales Report",
    titleAr: "تقرير المبيعات",
    descriptionEn: "Detailed sales data including revenue, discounts, and refunds",
    descriptionAr: "بيانات المبيعات المفصلة بما في ذلك الإيرادات والخصومات والمرتجعات",
  },
  {
    id: "orders",
    icon: ShoppingCart,
    titleEn: "Orders Report",
    titleAr: "تقرير الطلبات",
    descriptionEn: "Order statistics, status breakdown, and fulfillment rates",
    descriptionAr: "إحصائيات الطلبات وتوزيع الحالات ومعدلات الإنجاز",
  },
  {
    id: "customers",
    icon: Users,
    titleEn: "Customers Report",
    titleAr: "تقرير العملاء",
    descriptionEn: "Customer acquisition, retention, and lifetime value analysis",
    descriptionAr: "تحليل اكتساب العملاء والاحتفاظ بهم والقيمة الدائمة",
  },
  {
    id: "inventory",
    icon: Package,
    titleEn: "Inventory Report",
    titleAr: "تقرير المخزون",
    descriptionEn: "Stock levels, low inventory alerts, and turnover rates",
    descriptionAr: "مستويات المخزون وتنبيهات انخفاض المخزون ومعدلات الدوران",
  },
  {
    id: "performance",
    icon: TrendingUp,
    titleEn: "Performance Report",
    titleAr: "تقرير الأداء",
    descriptionEn: "Overall store performance metrics and KPIs",
    descriptionAr: "مقاييس أداء المتجر الإجمالية ومؤشرات الأداء الرئيسية",
  },
];

const recentReports = [
  { name: "Sales Report - November 2024", date: "2024-11-30", size: "2.4 MB", type: "PDF" },
  { name: "Orders Report - November 2024", date: "2024-11-30", size: "1.8 MB", type: "PDF" },
  { name: "Inventory Report - Q3 2024", date: "2024-10-01", size: "3.2 MB", type: "Excel" },
  { name: "Customer Analysis - 2024", date: "2024-09-15", size: "4.1 MB", type: "PDF" },
];

export default function ReportsPage() {
  const { t, isRTL } = useAdminLanguage();
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleGenerateReport = () => {
    // This would trigger report generation
    console.log("Generating report:", { selectedReport, dateFrom, dateTo, exportFormat });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("reports")}</h1>
        <p className="text-muted-foreground">
          {isRTL ? "إنشاء وتحميل تقارير مخصصة" : "Generate and download custom reports"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "اختر نوع التقرير" : "Select Report Type"}</CardTitle>
              <CardDescription>
                {isRTL ? "اختر نوع التقرير الذي تريد إنشاءه" : "Choose the type of report you want to generate"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 text-start transition-colors hover:bg-accent",
                      selectedReport === report.id && "border-primary bg-accent"
                    )}
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {isRTL ? report.titleAr : report.titleEn}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? report.descriptionAr : report.descriptionEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range & Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "خيارات التقرير" : "Report Options"}</CardTitle>
              <CardDescription>
                {isRTL ? "حدد النطاق الزمني وتنسيق التصدير" : "Set the date range and export format"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? "من تاريخ" : "From Date"}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-start font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="me-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : (isRTL ? "اختر التاريخ" : "Pick a date")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? "إلى تاريخ" : "To Date"}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-start font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="me-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : (isRTL ? "اختر التاريخ" : "Pick a date")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? "تنسيق التصدير" : "Export Format"}</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                className="mt-6 w-full sm:w-auto" 
                onClick={handleGenerateReport}
                disabled={!selectedReport}
              >
                <FileText className="h-4 w-4 me-2" />
                {isRTL ? "إنشاء التقرير" : "Generate Report"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "التقارير الأخيرة" : "Recent Reports"}</CardTitle>
            <CardDescription>
              {isRTL ? "التقارير التي تم إنشاؤها مؤخراً" : "Recently generated reports"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-muted p-2">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{report.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {report.date}
                        <span>•</span>
                        {report.size}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
