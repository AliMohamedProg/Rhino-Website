"use client"

import { useEffect, useState } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/admin/data-table"
import { type User } from "@/lib/admin-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, MoreHorizontal, Pencil, Trash2, Shield, Ban, CheckCircle } from "lucide-react"

type ApiUser = {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  role?: string | null
  createdDate?: string | null
  totalOrders?: number
  totalSpent?: number
}

const normalizeRole = (role?: string | null): User["role"] => {
  if (!role) return "customer"
  const normalized = role.toLowerCase()
  if (normalized === "admin" || normalized === "manager" || normalized === "customer") {
    return normalized as User["role"]
  }
  if (normalized === "user") return "customer"
  return "customer"
}

const mapApiUser = (apiUser: ApiUser, index: number): User => {
  const safeEmail = apiUser.email?.trim() || ""
  const safeName = [apiUser.firstName, apiUser.lastName].filter(Boolean).join(" ").trim()
  const name = safeName || safeEmail || "Unknown User"
  const rawTotalOrders = typeof apiUser.totalOrders === "number"
    ? apiUser.totalOrders
    : Number(apiUser.totalOrders ?? 0)
  const rawTotalSpent = typeof apiUser.totalSpent === "number"
    ? apiUser.totalSpent
    : Number(apiUser.totalSpent ?? 0)
  const totalOrders = Number.isFinite(rawTotalOrders) ? rawTotalOrders : 0
  const totalSpent = Number.isFinite(rawTotalSpent) ? rawTotalSpent : 0

  return {
    id: apiUser.id || `user-${index}`,
    name,
    email: safeEmail,
    phone: apiUser.phoneNumber || "",
    role: normalizeRole(apiUser.role),
    status: "active",
    totalOrders,
    totalSpent,
    lastLogin: apiUser.createdDate || "",
    joinDate: apiUser.createdDate || "",
  }
}

export default function UsersPage() {
  const { t, language, dir } = useAdminLanguage()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const data = await ApiClient.get("api/admin/users/get-all")
        const list = Array.isArray(data) ? data : []
        const mapped = list.map((user: ApiUser, index: number) => mapApiUser(user, index))
        if (isMounted) setUsers(mapped)
      } catch (err) {
        console.error("Failed to fetch users:", err)
        if (isMounted) setLoadError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUsers()
    return () => {
      isMounted = false
    }
  }, [])

  const getRoleBadge = (role: User["role"]) => {
    const roleConfig = {
      admin: { variant: "default" as const, labelEn: "Admin", labelAr: "مدير", className: "bg-red-500" },
      manager: { variant: "default" as const, labelEn: "Manager", labelAr: "مشرف", className: "bg-blue-500" },
      customer: { variant: "secondary" as const, labelEn: "Customer", labelAr: "عميل", className: "" },
    }
    const config = roleConfig[role]
    return (
      <Badge variant={config.variant} className={config.className}>
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig = {
      active: { variant: "default" as const, labelEn: "Active", labelAr: "نشط", className: "bg-emerald-500" },
      inactive: { variant: "secondary" as const, labelEn: "Inactive", labelAr: "غير نشط", className: "" },
      blocked: { variant: "destructive" as const, labelEn: "Blocked", labelAr: "محظور", className: "" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {language === "ar" ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t("common.egp")}`
  }

  const columns = [
    {
      key: "user",
      header: t("users.name"),
      render: (user: User) => (
        <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={cn(dir === "rtl" && "text-right")}>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: t("users.phone"),
      render: (user: User) => (
        <span className="text-muted-foreground">
          {user.phone || (language === "ar" ? "غير متاح" : "N/A")}
        </span>
      ),
    },
    {
      key: "role",
      header: t("users.role"),
      render: (user: User) => getRoleBadge(user.role),
    },
    {
      key: "status",
      header: t("users.status"),
      render: (user: User) => getStatusBadge(user.status),
    },
    {
      key: "totalOrders",
      header: t("users.totalOrders"),
      render: (user: User) => (
        <span className="text-muted-foreground">{user.totalOrders}</span>
      ),
    },
    {
      key: "totalSpent",
      header: t("users.totalSpent"),
      render: (user: User) => (
        <span className="font-medium">{formatCurrency(user.totalSpent)}</span>
      ),
    },
    {
      key: "joinDate",
      header: t("users.joinDate"),
      render: (user: User) => (
        <span className="text-muted-foreground">
          {user.joinDate && !Number.isNaN(new Date(user.joinDate).getTime())
            ? new Date(user.joinDate).toLocaleDateString(
                language === "ar" ? "ar-EG" : "en-US"
              )
            : (language === "ar" ? "غير متاح" : "N/A")}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          dir === "rtl" && "flex-row-reverse"
        )}
      >
        <div className={cn(dir === "rtl" && "text-right")}>
          <h1 className="text-2xl font-bold tracking-tight">{t("users.title")}</h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? `إدارة ${users.length} مستخدم`
              : `Manage ${users.length} users`}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              {t("common.loading")}
            </div>
          ) : loadError ? (
            <div className="flex justify-center items-center h-48 text-destructive">
              {language === "ar" ? "فشل تحميل المستخدمين." : "Failed to load users."}
            </div>
          ) : (
            <DataTable
              data={users}
              columns={columns}
            searchPlaceholder={language === "ar" ? "البحث عن مستخدم..." : "Search users..."}
              searchKey="name"
            />
          )}
        </CardContent>
      </Card>

  
    </div>
  )
}
