"use client"

import { useState } from "react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/admin/data-table"
import { mockUsers, type User } from "@/lib/admin-data"
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

export default function UsersPage() {
  const { t, language, dir } = useAdminLanguage()
  const [users, setUsers] = useState(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

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
          {new Date(user.joinDate).toLocaleDateString(
            language === "ar" ? "ar-EG" : "en-US"
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
            <DropdownMenuItem
              onClick={() => {
                setEditingUser(user)
                setDialogOpen(true)
              }}
            >
              <Pencil className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("users.editUser")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status !== "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                <CheckCircle className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {language === "ar" ? "تفعيل" : "Activate"}
              </DropdownMenuItem>
            )}
            {user.status !== "blocked" && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleStatusChange(user.id, "blocked")}
              >
                <Ban className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                {language === "ar" ? "حظر" : "Block"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[70px]",
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
        <Button onClick={() => { setEditingUser(null); setDialogOpen(true) }}>
          <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("users.addUser")}
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={users}
            columns={columns}
            searchPlaceholder={language === "ar" ? "البحث عن مستخدم..." : "Search users..."}
            searchKey="name"
          />
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={cn(dir === "rtl" && "text-right")}>
              {editingUser ? t("users.editUser") : t("users.addUser")}
            </DialogTitle>
            <DialogDescription className={cn(dir === "rtl" && "text-right")}>
              {editingUser
                ? language === "ar"
                  ? "تعديل بيانات المستخدم"
                  : "Edit user details"
                : language === "ar"
                ? "إضافة مستخدم جديد"
                : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("users.name")}</Label>
              <Input id="name" defaultValue={editingUser?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("users.email")}</Label>
              <Input id="email" type="email" defaultValue={editingUser?.email || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("users.phone")}</Label>
              <Input id="phone" defaultValue={editingUser?.phone || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t("users.role")}</Label>
              <Select defaultValue={editingUser?.role || "customer"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t("users.admin")}</SelectItem>
                  <SelectItem value="manager">{t("users.manager")}</SelectItem>
                  <SelectItem value="customer">{t("users.customer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={() => setDialogOpen(false)}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
