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
  iconColor?: string
}

export function StatsCard({ title, value, growth, icon, trend, className, iconColor }: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") return val.toLocaleString()
    return val
  }

  const colorMap: Record<string, string> = {
    "bg-blue-500": "from-blue-500 to-blue-600",
    "bg-emerald-500": "from-emerald-500 to-emerald-600",
    "bg-amber-500": "from-amber-500 to-amber-600",
    "bg-purple-500": "from-purple-500 to-purple-600",
    "bg-rose-500": "from-rose-500 to-rose-600",
    "bg-cyan-500": "from-cyan-500 to-cyan-600",
  }

  const gradientClass = colorMap[iconColor || "bg-indigo-500"] || "from-indigo-500 to-purple-600"

  return (
    <Card className={cn("overflow-hidden border-[#7B3F32]/12 bg-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(123,63,50,0.12)] transition-all duration-300", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn("flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br shadow-lg", gradientClass)}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#7c6f65]">{title}</p>
            <p className="text-2xl font-bold text-[#2f2219] mt-0.5">{formatValue(value)}</p>
            {growth !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs font-medium mt-1", trend === "up" ? "text-emerald-600" : "text-rose-600")}>
                {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{growth > 0 ? "+" : ""}{growth}%</span>
                <span className="text-[#9b8d83] ml-1">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
