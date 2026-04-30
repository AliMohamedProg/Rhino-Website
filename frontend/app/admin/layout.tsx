import React from "react"
import type { Metadata } from "next"
import { AdminLayoutClient } from "./admin-layout-client"

export const metadata: Metadata = {
  title: "Admin Panel - rhino",
  description: "Admin dashboard for Rhino e-commerce platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
