"use client";

import { useState } from "react";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Copy, Tag } from "lucide-react";
import { toast } from "sonner";

const coupons = [
  {
    id: "CPN001",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    minOrder: 200,
    maxDiscount: 100,
    usageLimit: 1000,
    usedCount: 450,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
  },
  {
    id: "CPN002",
    code: "SAVE50",
    type: "fixed",
    value: 50,
    minOrder: 300,
    maxDiscount: null,
    usageLimit: 500,
    usedCount: 320,
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    status: "active",
  },
  {
    id: "CPN003",
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    minOrder: 500,
    maxDiscount: 200,
    usageLimit: 200,
    usedCount: 200,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "expired",
  },
  {
    id: "CPN004",
    code: "FLASH30",
    type: "percentage",
    value: 30,
    minOrder: 400,
    maxDiscount: 150,
    usageLimit: 100,
    usedCount: 45,
    startDate: "2024-12-01",
    endDate: "2024-12-15",
    status: "active",
  },
  {
    id: "CPN005",
    code: "VIP100",
    type: "fixed",
    value: 100,
    minOrder: 1000,
    maxDiscount: null,
    usageLimit: 50,
    usedCount: 12,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "inactive",
  },
];

export default function CouponsPage() {
  const { t, isRTL } = useAdminLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{isRTL ? "نشط" : "Active"}</Badge>;
      case "inactive":
        return <Badge variant="secondary">{isRTL ? "غير نشط" : "Inactive"}</Badge>;
      case "expired":
        return <Badge variant="destructive">{isRTL ? "منتهي" : "Expired"}</Badge>;
      default:
        return null;
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(isRTL ? "تم نسخ الكود" : "Code copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isRTL ? "الكوبونات" : "Coupons"}</h1>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة أكواد الخصم والعروض" : "Manage discount codes and promotions"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 me-2" />
              {isRTL ? "إضافة كوبون" : "Add Coupon"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isRTL ? "إضافة كوبون جديد" : "Add New Coupon"}</DialogTitle>
              <DialogDescription>
                {isRTL ? "أدخل تفاصيل كود الخصم الجديد" : "Enter the details for the new discount code"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>{isRTL ? "كود الخصم" : "Coupon Code"}</Label>
                <Input placeholder="e.g. SAVE20" className="uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{isRTL ? "نوع الخصم" : "Discount Type"}</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">{isRTL ? "نسبة مئوية" : "Percentage"}</SelectItem>
                      <SelectItem value="fixed">{isRTL ? "مبلغ ثابت" : "Fixed Amount"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{isRTL ? "قيمة الخصم" : "Discount Value"}</Label>
                  <Input type="number" placeholder="20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{isRTL ? "الحد الأدنى للطلب" : "Minimum Order"}</Label>
                  <Input type="number" placeholder="100" />
                </div>
                <div className="grid gap-2">
                  <Label>{isRTL ? "الحد الأقصى للخصم" : "Max Discount"}</Label>
                  <Input type="number" placeholder="50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{isRTL ? "تاريخ البداية" : "Start Date"}</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>{isRTL ? "تاريخ الانتهاء" : "End Date"}</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{isRTL ? "حد الاستخدام" : "Usage Limit"}</Label>
                <Input type="number" placeholder="1000" />
              </div>
              <div className="flex items-center justify-between">
                <Label>{isRTL ? "تفعيل الكوبون" : "Activate Coupon"}</Label>
                <Switch defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={() => setDialogOpen(false)}>
                {t("save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? "إجمالي الكوبونات" : "Total Coupons"}</p>
                <p className="text-2xl font-bold">{coupons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "الكوبونات النشطة" : "Active Coupons"}</p>
            <p className="text-2xl font-bold text-green-600">
              {coupons.filter(c => c.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "إجمالي الاستخدام" : "Total Usage"}</p>
            <p className="text-2xl font-bold">
              {coupons.reduce((sum, c) => sum + c.usedCount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "الكوبونات المنتهية" : "Expired Coupons"}</p>
            <p className="text-2xl font-bold text-red-600">
              {coupons.filter(c => c.status === "expired").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{isRTL ? "قائمة الكوبونات" : "Coupons List"}</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث بالكود..." : "Search by code..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                  <SelectItem value="inactive">{isRTL ? "غير نشط" : "Inactive"}</SelectItem>
                  <SelectItem value="expired">{isRTL ? "منتهي" : "Expired"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? "الكود" : "Code"}</TableHead>
                <TableHead>{isRTL ? "الخصم" : "Discount"}</TableHead>
                <TableHead>{isRTL ? "الحد الأدنى" : "Min Order"}</TableHead>
                <TableHead>{isRTL ? "الاستخدام" : "Usage"}</TableHead>
                <TableHead>{isRTL ? "الصلاحية" : "Validity"}</TableHead>
                <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyCode(coupon.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.type === "percentage" 
                      ? `${coupon.value}%` 
                      : `SAR ${coupon.value}`
                    }
                    {coupon.maxDiscount && (
                      <span className="text-xs text-muted-foreground block">
                        {isRTL ? `أقصى: ${coupon.maxDiscount} ر.س` : `Max: SAR ${coupon.maxDiscount}`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>SAR {coupon.minOrder}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                      <div className="mt-1 h-1.5 w-16 rounded-full bg-muted">
                        <div 
                          className="h-1.5 rounded-full bg-primary" 
                          style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{coupon.startDate}</p>
                      <p className="text-muted-foreground">{coupon.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 me-2" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 me-2" />
                          {isRTL ? "نسخ" : "Duplicate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 me-2" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
