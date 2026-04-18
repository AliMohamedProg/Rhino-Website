"use client"

import React from "react"
import { useEffect, useState } from "react"
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
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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

  const filteredData = searchKey
    ? data.filter((item) => {
        const value = item[searchKey]
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
      })
    : data

  const getComparableValue = (item: T, key: string): string | number => {
    const value = item[key as keyof T]
    if (typeof value === "number") return value
    if (value instanceof Date) return value.getTime()
    if (typeof value === "string") return value.toLowerCase()
    if (value === null || value === undefined) return ""
    return String(value).toLowerCase()
  }

  const sortedData = sortBy
    ? [...filteredData].sort((a, b) => {
        const aValue = getComparableValue(a, sortBy)
        const bValue = getComparableValue(b, sortBy)

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    : filteredData

  const totalItems = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
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
    if (sortBy !== key) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
    return sortDirection === "asc"
      ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
      : <ArrowDown className="h-3.5 w-3.5 text-primary" />
  }

  return (
    <div className="space-y-4" role="region" aria-label="Data table">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
           <Input
             id="table-search"
             placeholder={searchPlaceholder || "Search..."}
             value={searchQuery}
             onChange={(e) => {
               setSearchQuery(e.target.value)
               setCurrentPage(1)
             }}
             className="pl-9 bg-white border-[#7B3F32]/15 focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
           />
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[140px] bg-white border-[#7B3F32]/15 focus-visible:ring-2 focus-visible:ring-primary rounded-xl" aria-label="Items per page">
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

       <div className="rounded-2xl border border-[#7B3F32]/12 overflow-hidden shadow-[0_10px_26px_rgba(0,0,0,0.05)] bg-white">
        <Table role="table">
          <TableHeader>
           <TableRow className="bg-[#f7efe7] border-[#7B3F32]/10 hover:bg-[#f7efe7]">
             {columns.map((column, index) => (
               <TableHead
                 key={column.key}
                 className={cn(
                   "text-left text-xs font-semibold text-[#6f6157] uppercase tracking-wider h-12",
                   column.className
                 )}
                  style={{ width: index === 0 ? 'auto' : undefined }}
                >
                  {column.sortable !== false ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex items-center gap-1.5 hover:text-[#3D2B1F] transition-colors"
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
               <TableCell colSpan={columns.length} className="h-28 text-center text-[#8c7b6f]">
                 No data found
               </TableCell>
             </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                 <TableRow
                   key={item.id}
                   className={cn(
                     "border-[#7B3F32]/10 hover:bg-[#fcf6f1] transition-colors duration-150",
                     onRowClick && "cursor-pointer",
                     rowIndex % 2 === 0 ? "bg-white" : "bg-[#fffaf6]"
                   )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                     <TableCell
                       key={column.key}
                       className={cn(
                         "text-[#3D2B1F] py-4",
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
         <p className="text-muted-foreground order-2 sm:order-1">
           Showing <span className="font-medium text-foreground">{totalItems === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium text-foreground">{Math.min(endIndex, totalItems)}</span> of <span className="font-medium text-foreground">{totalItems}</span> entries
         </p>
        <div className="flex items-center gap-1 order-1 sm:order-2" role="navigation" aria-label="Pagination">
           <Button
             variant="outline"
             size="sm"
             className="border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
             onClick={() => goToPage(1)}
             disabled={currentPage === 1 || totalItems === 0}
             aria-label="First page"
           >
             <ChevronsLeft className="h-4 w-4" />
           </Button>
           <Button
             variant="outline"
             size="sm"
             className="border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
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
                   "w-9",
                   currentPage === pageNum
                     ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                     : "border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
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
             className="border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
             onClick={() => goToPage(currentPage + 1)}
             disabled={currentPage === totalPages || totalItems === 0}
             aria-label="Next page"
           >
             <ChevronRight className="h-4 w-4" />
           </Button>
           <Button
             variant="outline"
             size="sm"
             className="border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
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
