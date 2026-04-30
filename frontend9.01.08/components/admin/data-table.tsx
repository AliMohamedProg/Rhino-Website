"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKey?: keyof T
  pageSize?: number
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder,
  searchKey,
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(pageSize)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredData = useMemo(() => {
    if (!searchKey) return data

    return data.filter((item) => {
      const value = item[searchKey]
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
  }, [data, searchKey, searchQuery])

  const getComparableValue = (item: T, key: string): string | number => {
    const value = item[key as keyof T]
    if (typeof value === "number") return value
    if (value instanceof Date) return value.getTime()
    if (typeof value === "string") return value.toLowerCase()
    if (value === null || value === undefined) return ""
    return String(value).toLowerCase()
  }

  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = getComparableValue(a, sortBy)
      const bValue = getComparableValue(b, sortBy)

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortBy, sortDirection])

  const totalItems = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const toggleSort = (key: string) => {
    if (sortBy !== key) {
      setSortBy(key)
      setSortDirection("asc")
      return
    }
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const renderSortIcon = (key: string) => {
    if (sortBy !== key) return <ArrowUpDown className="h-3.5 w-3.5 text-[#94867a]" />
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-[#8f3f2a]" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-[#8f3f2a]" />
    )
  }

  return (
    <div className="space-y-4" role="region" aria-label="Data table">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94867a]" />
          <Input
            id="table-search"
            placeholder={searchPlaceholder || "Search..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="admin-input h-11 border-[#8f3f2a]/20 bg-white pl-9"
          />
        </div>

        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger
            className="admin-input h-11 w-[148px] border-[#8f3f2a]/20 bg-white"
            aria-label="Items per page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#8f3f2a]/15 bg-white shadow-xl">
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="admin-card overflow-hidden rounded-[1.6rem]">
        <Table role="table">
          <TableHeader>
            <TableRow className="border-[#8f3f2a]/10 bg-[#f8f1ec] hover:bg-[#f8f1ec]">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-12 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7c6f65]",
                    column.className
                  )}
                >
                  {column.sortable !== false ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-[#3d2b1f]"
                    >
                      <span>{column.header}</span>
                      {renderSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-28 text-center text-[#94867a]">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-[#8f3f2a]/10 transition-colors",
                    rowIndex % 2 === 0 ? "bg-white/95" : "bg-[#fff9f5]",
                    onRowClick ? "cursor-pointer hover:bg-[#fff3ea]" : "hover:bg-[#fff3ea]"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("py-4 text-[#3d2b1f]", column.className)}>
                      {column.render
                        ? column.render(item)
                        : (item[column.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p className="text-[#7c6f65]">
          Showing <span className="font-semibold text-[#3d2b1f]">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
          <span className="font-semibold text-[#3d2b1f]">{Math.min(endIndex, totalItems)}</span> of{" "}
          <span className="font-semibold text-[#3d2b1f]">{totalItems}</span> entries
        </p>

        <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 rounded-lg border-[#8f3f2a]/20 p-0 text-[#8f3f2a] hover:bg-[#f8ece6]"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1 || totalItems === 0}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 rounded-lg border-[#8f3f2a]/20 p-0 text-[#8f3f2a] hover:bg-[#f8ece6]"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || totalItems === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-lg p-0",
                  currentPage === pageNum
                    ? "border-0 bg-gradient-to-r from-[#8f3f2a] to-[#c16043] text-white"
                    : "border-[#8f3f2a]/20 bg-transparent text-[#8f3f2a] hover:bg-[#f8ece6]"
                )}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 rounded-lg border-[#8f3f2a]/20 p-0 text-[#8f3f2a] hover:bg-[#f8ece6]"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 rounded-lg border-[#8f3f2a]/20 p-0 text-[#8f3f2a] hover:bg-[#f8ece6]"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages || totalItems === 0}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
