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
      admin: { variant: "default" as const, label: "Admin", className: "bg-gradient-to-r from-[#7B3F32] to-[#9e5948] hover:from-[#5f3026] hover:to-[#8e4f3f] text-white border-0 font-bold shadow-sm shadow-[#7B3F32]/20" },
      manager: { variant: "default" as const, label: "Manager", className: "bg-[#C1AFA0] hover:bg-[#a59487] text-[#2f2219] border-0 font-bold shadow-sm" },
      customer: { variant: "secondary" as const, label: "Customer", className: "bg-[#f6eee8] text-[#7c6f65] border-[#7B3F32]/10 hover:bg-[#efe3d9] font-bold tracking-wide" },
    }
    const config = roleConfig[role]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: User["status"]) => {
    return null;
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
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />
        
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Users</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Manage {users.length} users</p>
        </div>
      </div>

      <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
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