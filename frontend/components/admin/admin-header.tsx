"use client"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { GlobalSearch } from "@/components/admin/global-search"
import {
  Search,
  Menu,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <header
        className={cn(
          "sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 shadow-sm",
        )}
      >
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-primary/10 hover:text-primary"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Search Button */}
        <Button
          variant="outline"
          className="relative flex-1 max-w-md justify-start text-muted-foreground bg-transparent border-muted hover:bg-primary/5 hover:border-primary hover:text-primary transition-all duration-200"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4 me-2" />
          <span className="hidden sm:inline">Search products...</span>
          <span className="sm:hidden">Search...</span>
          <Kbd className="ms-auto hidden sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </Kbd>
        </Button>
      </header>
    </>
  )
}

