"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreditCard, Truck } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/products"

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

export default function CheckoutPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Egypt", // Default value
    firstName: "",
    lastName: ""
  })

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const res = await fetch("https://localhost:7282/api/Cart", {
          credentials: "include"
        })

        if (!res.ok) {
          if (res.status === 401) {
            setError(language === "ar" ? "يرجى تسجيل الدخول" : "Please login")
          } else {
            setError(`Error: ${res.status}`)
          }
          return
        }

        const data = await res.json()
        setCart(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch cart:", err)
        setError(language === "ar" ? "فشل في جلب السلة" : "Failed to fetch cart")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [language])

  const items = cart?.items || []
  const total = cart?.cartTotal || 0
  const shipping = total >= 1000 ? 0 : 50

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const verifyAndRedirect = async () => {
      try {
        const verifyRes = await fetch("https://localhost:7282/api/order/my-orders", {
          credentials: "include"
        })
        if (verifyRes.ok) {
          const orders = await verifyRes.json()
          const latestOrder = orders[0]
          if (latestOrder) {
            const orderTime = new Date(latestOrder.orderDate).getTime()
            const now = Date.now()
            if (now - orderTime < 120000) {
              router.push("/order-success")
              return true
            }
          }
        }
      } catch (vErr) {
        console.error("Verification check failed:", vErr)
      }
      return false
    }

    try {
      const res = await fetch("https://localhost:7282/api/order/create-from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          Country: formData.country,
          City: formData.city,
          Address: formData.address,
          Total: total + shipping,
          PhoneNumber: formData.phone,
          Email: formData.email,
          FirstName: formData.firstName,
          LastName: formData.lastName
        })
      })

      if (res.ok) {
        try {
          const order = await res.json()
          console.log("Order created:", order)
          router.push("/order-success")
        } catch (jsonErr) {
          console.error("Server crashed during response:", jsonErr)
          const success = await verifyAndRedirect()
          if (!success) {
            alert(language === "ar" ? "فشل في إنشاء الطلب" : "Failed to create order")
          }
        }
      } else {
        const errorText = await res.text()
        if (errorText.includes('"orderNumber":"ORD-') || errorText.includes('"OrderNumber":"ORD-')) {
          router.push("/order-success")
        } else {
          const success = await verifyAndRedirect()
          if (!success) {
            alert(language === "ar" ? "فشل في إنشاء الطلب" : "Failed to create order")
          }
        }
      }
    } catch (err) {
      console.error("Connection or server error:", err)
      const success = await verifyAndRedirect()
      if (!success) {
        alert(language === "ar" ? "حدث خطأ" : "An error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-secondary">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t("cart.empty")}</h1>
            <Link href="/">
              <Button>{t("cart.continueShopping")}</Button>
            </Link>
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("checkout.title")}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Truck size={20} />
                    {t("checkout.shipping")}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{language === "ar" ? "الاسم الأول" : "First Name"}</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{language === "ar" ? "اسم العائلة" : "Last Name"}</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("checkout.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("checkout.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="012XXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{language === "ar" ? "الدولة" : "Country"}</Label>
                      <Input
                        id="country"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("checkout.city")}</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address">{t("checkout.address")}</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard size={20} />
                    {t("checkout.payment")}
                  </h2>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"}`}
                      >
                        {paymentMethod === "cod" && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <span className="font-medium text-foreground">{t("checkout.cod")}</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-primary" : "border-muted-foreground"}`}
                      >
                        {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <span className="font-medium text-foreground">{t("checkout.card")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">{t("checkout.summary")}</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={language === "ar" ? (item.nameAr || item.nameEn) : item.nameEn}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute -top-1 -end-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground line-clamp-1">
                            {language === "ar" ? (item.nameAr || item.nameEn) : item.nameEn}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(item.price * item.quantity)} {t("products.price")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm border-t border-border pt-4">
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

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? language === "ar"
                        ? "جاري التنفيذ..."
                        : "Processing..."
                      : t("checkout.placeOrder")}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
