"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Heart, User, Menu, X, Moon, Sun, ChevronDown } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navItems = [
  { key: "nav.furniture", href: "/category/furniture", category: "bedroom" },
  { key: "nav.decor", href: "/category/decor", category: "living" },
  { key: "nav.kitchen", href: "/category/kitchen", category: "dining" },
  { key: "nav.appliances", href: "/category/appliances", category: "office" },
  { key: "nav.electronics", href: "/category/electronics", category: "outdoor" },
  { key: "nav.sports", href: "/category/sports", category: "bedroom" },
  { key: "nav.gifts", href: "/category/gifts", category: "living" },
]

export function Header() {
  const { language, setLanguage, t, dir } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { itemCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">
                {language === "ar" ? "توصيل مجاني للطلبات أكثر من 1000 جنيه" : "Free delivery on orders over 1000 EGP"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                  {language === "en" ? "🇬🇧 English" : "🇪🇬 العربية"}
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>🇬🇧 English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")}>🇪🇬 العربية</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo - Left side */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <img src="/images/logo-websait.png" alt="WoodDecor" className="w-10 h-10 object-contain" />
              </div>
            </Link>

            {/* Search Bar - Center */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Input
                  type="search"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pe-10 bg-muted border-border"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Actions - Right side */}
            <div className="flex items-center gap-2">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart size={22} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -end-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                  <span className="sr-only">{t("header.wishlist")}</span>
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart size={22} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -end-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                  <span className="sr-only">{t("header.cart")}</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User size={22} />
                  <span className="sr-only">{t("header.account")}</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative">
              <Input
                type="search"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pe-10 bg-muted border-border"
              />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <nav className="bg-primary hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 h-12 overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
