"use client";

import { useState } from "react";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Search, Package, AlertTriangle, TrendingDown, MoreHorizontal, Plus, Minus, History } from "lucide-react";

const inventoryItems = [
  {
    id: "INV001",
    sku: "SOF-001",
    name: "Modern L-Shaped Sofa",
    nameAr: "كنبة حرف L حديثة",
    category: "Living Room",
    stock: 45,
    minStock: 10,
    maxStock: 100,
    reserved: 5,
    warehouse: "Riyadh Main",
    lastUpdated: "2024-12-01",
    status: "in_stock",
  },
  {
    id: "INV002",
    sku: "BED-002",
    name: "Modern Bedroom Set",
    nameAr: "طقم غرفة نوم حديث",
    category: "Bedroom",
    stock: 8,
    minStock: 15,
    maxStock: 50,
    reserved: 3,
    warehouse: "Riyadh Main",
    lastUpdated: "2024-11-30",
    status: "low_stock",
  },
  {
    id: "INV003",
    sku: "DSK-003",
    name: "Executive Office Desk",
    nameAr: "مكتب تنفيذي",
    category: "Office",
    stock: 0,
    minStock: 5,
    maxStock: 30,
    reserved: 0,
    warehouse: "Jeddah",
    lastUpdated: "2024-11-28",
    status: "out_of_stock",
  },
  {
    id: "INV004",
    sku: "KID-004",
    name: "Kids Bedroom Set",
    nameAr: "طقم غرفة نوم أطفال",
    category: "Kids",
    stock: 22,
    minStock: 10,
    maxStock: 40,
    reserved: 2,
    warehouse: "Riyadh Main",
    lastUpdated: "2024-12-01",
    status: "in_stock",
  },
  {
    id: "INV005",
    sku: "SOF-005",
    name: "Corner Sofa Set",
    nameAr: "طقم كنب زاوية",
    category: "Living Room",
    stock: 12,
    minStock: 10,
    maxStock: 35,
    reserved: 4,
    warehouse: "Dammam",
    lastUpdated: "2024-11-29",
    status: "in_stock",
  },
  {
    id: "INV006",
    sku: "BED-006",
    name: "Luxury Wardrobe",
    nameAr: "خزانة ملابس فاخرة",
    category: "Bedroom",
    stock: 3,
    minStock: 8,
    maxStock: 25,
    reserved: 1,
    warehouse: "Riyadh Main",
    lastUpdated: "2024-11-27",
    status: "low_stock",
  },
];

const inventoryStats = {
  totalItems: 156,
  totalValue: 2450000,
  lowStock: 12,
  outOfStock: 5,
};

export default function InventoryPage() {
  const { t, isRTL } = useAdminLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{isRTL ? "متوفر" : "In Stock"}</Badge>;
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">{isRTL ? "مخزون منخفض" : "Low Stock"}</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">{isRTL ? "نفذ المخزون" : "Out of Stock"}</Badge>;
      default:
        return null;
    }
  };

  const getStockProgress = (stock: number, maxStock: number, minStock: number) => {
    const percentage = (stock / maxStock) * 100;
    let color = "bg-green-500";
    if (stock <= 0) color = "bg-red-500";
    else if (stock <= minStock) color = "bg-yellow-500";
    return { percentage, color };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isRTL ? "المخزون" : "Inventory"}</h1>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة ومراقبة مستويات المخزون" : "Manage and monitor stock levels"}
          </p>
        </div>
        <Button>
          <Package className="h-4 w-4 me-2" />
          {isRTL ? "إضافة مخزون" : "Add Stock"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? "إجمالي المنتجات" : "Total Items"}</p>
                <p className="text-2xl font-bold">{inventoryStats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{isRTL ? "قيمة المخزون" : "Inventory Value"}</p>
            <p className="text-2xl font-bold">SAR {inventoryStats.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900">
                <TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? "مخزون منخفض" : "Low Stock"}</p>
                <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isRTL ? "نفذ المخزون" : "Out of Stock"}</p>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{isRTL ? "قائمة المخزون" : "Inventory List"}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="in_stock">{isRTL ? "متوفر" : "In Stock"}</SelectItem>
                  <SelectItem value="low_stock">{isRTL ? "منخفض" : "Low Stock"}</SelectItem>
                  <SelectItem value="out_of_stock">{isRTL ? "نفذ" : "Out of Stock"}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={isRTL ? "الفئة" : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="Living Room">{isRTL ? "غرفة المعيشة" : "Living Room"}</SelectItem>
                  <SelectItem value="Bedroom">{isRTL ? "غرفة النوم" : "Bedroom"}</SelectItem>
                  <SelectItem value="Office">{isRTL ? "المكتب" : "Office"}</SelectItem>
                  <SelectItem value="Kids">{isRTL ? "الأطفال" : "Kids"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? "SKU" : "SKU"}</TableHead>
                <TableHead>{isRTL ? "المنتج" : "Product"}</TableHead>
                <TableHead>{isRTL ? "الفئة" : "Category"}</TableHead>
                <TableHead>{isRTL ? "المخزون" : "Stock"}</TableHead>
                <TableHead>{isRTL ? "المحجوز" : "Reserved"}</TableHead>
                <TableHead>{isRTL ? "المستودع" : "Warehouse"}</TableHead>
                <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const { percentage, color } = getStockProgress(item.stock, item.maxStock, item.minStock);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <p className="font-medium">{isRTL ? item.nameAr : item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? `آخر تحديث: ${item.lastUpdated}` : `Last updated: ${item.lastUpdated}`}
                      </p>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.stock}</span>
                          <span className="text-muted-foreground">/ {item.maxStock}</span>
                        </div>
                        <div className="h-2 w-24 rounded-full bg-muted">
                          <div 
                            className={`h-2 rounded-full ${color}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.reserved}</TableCell>
                    <TableCell>{item.warehouse}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Plus className="h-4 w-4 me-2" />
                            {isRTL ? "إضافة مخزون" : "Add Stock"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Minus className="h-4 w-4 me-2" />
                            {isRTL ? "خصم مخزون" : "Remove Stock"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="h-4 w-4 me-2" />
                            {isRTL ? "سجل الحركة" : "View History"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
