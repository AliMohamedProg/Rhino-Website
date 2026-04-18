"use client"

import React from "react"

import { useState } from "react"
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
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
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

  const filteredData = searchKey
    ? data.filter((item) => {
      const value = item[searchKey]
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
    : data

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return (
    <div className="space-y-4" role="region" aria-label="Data table">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-admin-text-muted pointer-events-none"
          />
          <Input
            id="table-search"
            placeholder={searchPlaceholder || "Search..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 bg-background border-admin-card-border focus-visible:ring-2 focus-visible:ring-admin-primary"
          />
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[140px] bg-background border-admin-card-border focus-visible:ring-2 focus-visible:ring-admin-primary" aria-label="Items per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-admin-card-border overflow-hidden shadow-sm">
        <Table role="table">
          <TableHeader>
            <TableRow className="bg-admin-content-bg border-admin-card-border hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-left text-sm font-semibold text-admin-text-secondary",
                    column.className
                  )}
                  style={{ width: index === 0 ? 'auto' : undefined }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-admin-text-muted">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-admin-card-border hover:bg-admin-primary/5 transition-colors duration-150",
                    onRowClick && "cursor-pointer",
                    rowIndex % 2 === 0 ? "bg-background" : "bg-admin-content-bg/30"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "text-admin-text-primary py-4",
                        column.className
                      )}
                    >
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-admin-text-secondary order-2 sm:order-1">
          Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> entries
        </p>
        <div className="flex items-center gap-1 order-1 sm:order-2" role="navigation" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            className="border-admin-card-border text-admin-text-secondary hover:bg-admin-primary hover:text-white hover:border-admin-primary"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-admin-card-border text-admin-text-secondary hover:bg-admin-primary hover:text-white hover:border-admin-primary"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 mx-2" role="status">
            <span className="text-admin-text-primary font-medium">Page</span>
            <span className="sr-only">Current page</span>
            <span className="px-2 py-1 bg-admin-primary text-white rounded text-sm font-medium min-w-[3rem] text-center">
              {currentPage}
            </span>
            <span className="text-admin-text-secondary">of</span>
            <span className="font-medium text-admin-text-primary">{totalPages || 1}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-admin-card-border text-admin-text-secondary hover:bg-admin-primary hover:text-white hover:border-admin-primary"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-admin-card-border text-admin-text-secondary hover:bg-admin-primary hover:text-white hover:border-admin-primary"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage >= totalPages}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}