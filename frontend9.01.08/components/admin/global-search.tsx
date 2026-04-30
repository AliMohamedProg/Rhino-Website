"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, Package, ShoppingCart, Users, FolderTree,
  Settings, BarChart3, FileText, Tag, Warehouse, Star
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", titleAr: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { title: "Products", titleAr: "المنتجات", href: "/admin/products", icon: Package },
  { title: "Orders", titleAr: "الطلبات", href: "/admin/orders", icon: ShoppingCart },
  { title: "Users", titleAr: "المستخدمين", href: "/admin/users", icon: Users },
  { title: "Categories", titleAr: "الفئات", href: "/admin/categories", icon: FolderTree },
  { title: "Analytics", titleAr: "التحليلات", href: "/admin/analytics", icon: BarChart3 },
  { title: "Reports", titleAr: "التقارير", href: "/admin/reports", icon: FileText },
  { title: "Coupons", titleAr: "الكوبونات", href: "/admin/coupons", icon: Tag },
  { title: "Inventory", titleAr: "المخزون", href: "/admin/inventory", icon: Warehouse },
  { title: "Reviews", titleAr: "المراجعات", href: "/admin/reviews", icon: Star },
  { title: "Settings", titleAr: "الإعدادات", href: "/admin/settings", icon: Settings },
];

const quickActions = [
  { title: "Add New Product", titleAr: "إضافة منتج جديد", href: "/admin/products/new", icon: Package },
  { title: "View All Orders", titleAr: "عرض جميع الطلبات", href: "/admin/orders", icon: ShoppingCart },
  { title: "Add New Category", titleAr: "إضافة فئة جديدة", href: "/admin/categories", icon: FolderTree },
  { title: "Generate Report", titleAr: "إنشاء تقرير", href: "/admin/reports", icon: FileText },
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();

  const runCommand = useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for a page or action..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.title} ${item.titleAr}`}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="me-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.href}
              value={`${action.title} ${action.titleAr}`}
              onSelect={() => runCommand(() => router.push(action.href))}
            >
              <action.icon className="me-2 h-4 w-4" />
              <span>{action.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
