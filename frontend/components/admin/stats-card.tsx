"use client"

import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  growth?: number
  icon: React.ReactNode
  trend?: "up" | "down"
  className?: string
}

export function StatsCard({ title, value, growth, icon, trend, className }: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString()
    }
    return val
  }

  return (
    <Card className={cn("overflow-hidden relative", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 pl-14 pr-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{formatValue(value)}</p>
            {growth !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{growth > 0 ? "+" : ""}{growth}%</span>
              </div>
            )}
          </div>
          <div
            className="rounded-lg bg-primary/10 p-3 text-primary transition-all duration-300 absolute start-4 top-1/2 -translate-y-1/2"
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

