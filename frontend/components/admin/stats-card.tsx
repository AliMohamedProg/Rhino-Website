"use client"

import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  growth?: number
  icon: React.ReactNode
  trend?: "up" | "down"
  className?: string
  iconColor?: string
}

export function StatsCard({ title, value, growth, icon, trend, className, iconColor }: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString()
    }
    return val
  }

  const iconBgColor = iconColor || "bg-admin-primary"

  return (
    <Card className={cn(
      "overflow-hidden relative border border-admin-card-border shadow-sm hover:shadow-lg transition-all duration-300 group",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 pl-16 pr-0">
            <p className="text-sm font-medium text-admin-text-secondary">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-admin-text-primary">{formatValue(value)}</p>
            {growth !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  trend === "up" ? "text-admin-success" : "text-admin-danger"
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{growth > 0 ? "+" : ""}{growth}%</span>
                <span className="text-admin-text-muted text-xs ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "rounded-xl p-4 text-white transition-all duration-300 absolute start-4 top-1/2 -translate-y-1/2 shadow-lg",
              iconBgColor
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
      <div className="h-1 bg-gradient-to-r from-transparent via-admin-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  )
}