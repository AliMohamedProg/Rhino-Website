"use client"

import { useEffect, useState } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
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
} from "@/components/ui/dropdown-menu"
import { exportUsersExcel, exportUsersPdf } from "@/app/ApiHelper/ExportApi"
import { MoreHorizontal, Download } from "lucide-react"

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
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      try {
        setLoading(true)
        setLoadError(false)
        const data = await ApiClient.get("api/admin/users/get-all")
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
            ? data.users
            : Array.isArray(data?.data)
              ? data.data
              : []
        const mapped = list.map((user: ApiUser, index: number) => mapApiUser(user, index))
        if (isMounted) setUsers(mapped)
      } catch (err) {
        console.error("Failed to fetch users:", err)
        // Show error but allow page to load with empty list
        if (isMounted) {
          setLoadError(true)
          setUsers([])
        }
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
      admin: { variant: "default" as const, label: "Admin", className: "bg-red-500" },
      manager: { variant: "default" as const, label: "Manager", className: "bg-blue-500" },
      customer: { variant: "secondary" as const, label: "Customer", className: "" },
    }
    const config = roleConfig[role]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active", className: "bg-emerald-500" },
      inactive: { variant: "secondary" as const, label: "Inactive", className: "" },
      blocked: { variant: "destructive" as const, label: "Blocked", className: "" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} EGP`
  }

  const columns = [
    {
      key: "user",
      header: "Name",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (user: User) => (
        <span className="text-muted-foreground">
          {user.phone || "N/A"}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user: User) => getRoleBadge(user.role),
    },
    {
      key: "status",
      header: "Status",
      render: (user: User) => getStatusBadge(user.status),
    },
    {
      key: "totalOrders",
      header: "Orders",
      render: (user: User) => (
        <span className="text-muted-foreground">{user.totalOrders}</span>
      ),
    },
    {
      key: "totalSpent",
      header: "Spent",
      render: (user: User) => (
        <span className="font-medium">{formatCurrency(user.totalSpent)}</span>
      ),
    },
    {
      key: "joinDate",
      header: "Join Date",
      render: (user: User) => (
        <span className="text-muted-foreground">
          {user.joinDate && !Number.isNaN(new Date(user.joinDate).getTime())
            ? new Date(user.joinDate).toLocaleDateString("en-US")
            : "N/A"}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
          <p className="text-gray-500">Manage {users.length} users</p>
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportUsersExcel()}>
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportUsersPdf()}>
              Export to PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground animate-pulse">
              Loading users...
            </div>
          ) : loadError ? (
            <div className="flex flex-col justify-center items-center h-48 text-destructive gap-2">
              <p>Unable to load users from the server.</p>
              <p className="text-sm text-muted-foreground">The API endpoint may not be available yet.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
              No users found
            </div>
          ) : (
            <DataTable
              data={users}
              columns={columns}
              searchPlaceholder="Search users..."
              searchKey="name"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}