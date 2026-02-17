"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react"

import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { useAuth } from "@/app/Context/auth-context"

import { useCart } from "@/context/cart-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* =======================
   Types
======================= */
interface Category {
  id: string
  nameAr: string
  nameEn: string
  currentState: number
}

/* =======================
   Component
======================= */
export function Header() {
  const { language, setLanguage, t, dir } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, loading } = useAuth()
  const { itemCount } = useCart()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  const router = useRouter()

  /* =======================
     Fetch Categories
  ======================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://localhost:7282/api/category")
        if (!res.ok) throw new Error("Failed to fetch categories")

        const data: Category[] = await res.json()
        setCategories(data.filter(c => c.currentState === 1))
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
  }, [])
  /* =======================
     Handlers
  ======================= */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  /* =======================
     JSX
  ======================= */
  return (
    <header className="sticky top-0 z-50">
      {/* ================= Top Bar ================= */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <span className="hidden sm:inline">
              {language === "ar"
                ? "توصيل مجاني للطلبات أكثر من 1000 جنيه"
                : "Free delivery on orders over 1000 EGP"}
            </span>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme}>
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {language === "en" ? "🇬🇧 English" : "🇪🇬 العربية"}
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>

                <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    🇬🇧 English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")}>
                    🇪🇬 العربية
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Main Header ================= */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="block relative w-10 h-10">
              <Image
                src="/images/logo-websait.png"
                alt="Wood Decor Logo"
                width={40}
                height={40}
                sizes="40px"
                className="object-contain"
                priority
              />
            </Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-md hidden md:block"
            >
              <div className="relative">
                <Input
                  type="search"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pe-10"
                />
                <button className="absolute end-3 top-1/2 -translate-y-1/2">
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!loading && !user && (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      {language === "ar" ? "تسجيل الدخول" : "Login"}
                    </Button>
                  </Link>

                  <Link href="/register">
                    <Button size="sm">
                      {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                    </Button>
                  </Link>
                </>
              )}

              {!loading && user && (
                <>
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart size={22} />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link href="/profile">
                    <Button variant="ghost" size="icon">
                      <User size={22} />
                    </Button>
                  </Link>

                  {user.isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-2">
                        <LayoutDashboard size={18} />
                        {language === "ar" ? "لوحة التحكم" : "Admin Panel"}
                      </Button>
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <LayoutDashboard size={22} />
                      </Button>
                    </Link>
                  )}
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Categories Nav ================= */}
      <nav className="bg-primary hidden md:block">
        <ul className="flex justify-center gap-8 h-12 items-center">
          {categories.length === 0 && (
            <li className="text-primary-foreground/70">
              {language === "ar" ? "تحميل..." : "Loading..."}
            </li>
          )}

          {categories.map(category => (
            <li key={category.id}>
              <Link
                href={`/category/${category.id}`}
                className="text-primary-foreground hover:underline"
              >
                {language === "ar" ? category.nameAr : category.nameEn}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
