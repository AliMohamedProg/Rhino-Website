"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { useEffect, useState } from "react"

interface CartItem {
  id: string
  itemId: string
  nameEn: string
  nameAr: string
  image: string
  price: number
  quantity: number
  total: number
  color: string
}

interface Cart {
  id: string
  items: CartItem[]
  cartTotal: number
}

export default function CartPage() {
  const { language, t } = useLanguage()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ====== Fetch Cart ======
  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await fetch("https://localhost:7282/api/Cart", {
        credentials: "include"
      })

      console.log("Cart API response status:", res.status)

      if (!res.ok) {
        if (res.status === 401) {
          setError(language === "ar" ? "يرجى تسجيل الدخول" : "Please login")
        } else {
          setError(`Error: ${res.status}`)
        }
        return
      }

      const data = await res.json()
      console.log("Cart API response data:", data)
      setCart(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch cart:", err)
      setError(language === "ar" ? "فشل في جلب السلة" : "Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [language])

  // ====== Add Item ======
  const addItem = async (productId: string, quantity: number) => {
    try {
      const res = await fetch("https://localhost:7282/api/Cart/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity })
      })
      if (res.ok) {
        const updatedCart = await res.json()
        setCart(updatedCart)
      }
    } catch (err) {
      console.error("Failed to add item:", err)
    }
  }

  // ====== Update Quantity ======
  const updateQuantity = async (productId: string, quantity: number) => {
    console.log("updateQuantity called with:", productId, quantity)
    if (quantity < 1) return removeItem(productId)

    try {
      console.log("Making API call to:", `https://localhost:7282/api/Cart/items/${productId}`)
      const res = await fetch(`https://localhost:7282/api/Cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity })
      })
      console.log("Response status:", res.status)
      if (res.ok) {
        console.log("Update successful, refreshing cart")
        fetchCart() // Refresh cart after update
      } else {
        console.error("Update failed with status:", res.status)
      }
    } catch (err) {
      console.error("Failed to update quantity:", err)
    }
  }

  // ====== Remove Item ======
  const removeItem = async (productId: string) => {
    try {
      const res = await fetch(`https://localhost:7282/api/Cart/item/delete/${productId}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (res.ok) fetchCart() // Refresh cart after deletion
    } catch (err) {
      console.error("Failed to remove item:", err)
    }
  }

  const items = cart?.items || []
  const total = cart?.cartTotal || 0
  const shipping = total >= 1000 ? 0 : 50

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">{error}</h2>
              <p className="text-muted-foreground mb-6">
                {language === "ar" ? "سجل الدخول لاستخدام السلة" : "Login to use the cart"}
              </p>
              <Link href="/login">
                <Button>{language === "ar" ? "تسجيل الدخول" : "Login"}</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("cart.title")}</h1>

          {items.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">{t("cart.empty")}</h2>
              <p className="text-muted-foreground mb-6">
                {language === "ar" ? "أضف بعض المنتجات لسلتك للبدء" : "Add some products to your cart to get started"}
              </p>
              <Link href="/">
                <Button>{t("cart.continueShopping")}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="bg-card rounded-lg border border-border p-4 flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={language === "ar" ? item.nameAr : item.nameEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.itemId}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                          {language === "ar" ? (item.nameAr && item.nameAr !== "string" ? item.nameAr : item.nameEn) : item.nameEn}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-foreground">
                          {formatPrice(item.price)} {t("products.price")}
                        </span>
                        {item.color && (
                          <span className="text-sm text-muted-foreground ml-4">
                            {language === "ar" ? "اللون:" : "Color:"} {item.color}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.itemId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">{t("checkout.summary")}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                      <span className="font-medium text-foreground">
                        {formatPrice(total)} {t("products.price")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.shipping")}</span>
                      <span className="font-medium text-foreground">
                        {shipping === 0
                          ? language === "ar"
                            ? "مجاني"
                            : "Free"
                          : `${formatPrice(shipping)} ${t("products.price")}`}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold text-foreground">{t("cart.total")}</span>
                      <span className="font-bold text-lg text-foreground">
                        {formatPrice(total + shipping)} {t("products.price")}
                      </span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block mt-6">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      {t("cart.checkout")}
                    </Button>
                  </Link>
                  <Link href="/" className="block mt-3">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("cart.continueShopping")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
