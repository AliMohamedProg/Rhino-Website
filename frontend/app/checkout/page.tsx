"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Smartphone, Truck } from "lucide-react"

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
  const searchParams = useSearchParams()

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "wallet">("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Egypt",
    firstName: "",
    lastName: ""
  })

  const egyptGovernoratesEn = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Dakahlia",
    "Red Sea",
    "Beheira",
    "Fayoum",
    "Gharbia",
    "Ismailia",
    "Menofia",
    "Minya",
    "Qalyubia",
    "New Valley",
    "Suez",
    "Aswan",
    "Assiut",
    "Beni Suef",
    "Port Said",
    "Damietta",
    "Sharkia",
    "South Sinai",
    "Kafr El Sheikh",
    "Matrouh",
    "Luxor",
    "Qena",
    "North Sinai",
    "Sohag"
  ]

  const egyptGovernoratesAr = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "الدقهلية",
    "البحر الأحمر",
    "البحيرة",
    "الفيوم",
    "الغربية",
    "الإسماعيلية",
    "المنوفية",
    "المنيا",
    "القليوبية",
    "الوادي الجديد",
    "السويس",
    "أسوان",
    "أسيوط",
    "بني سويف",
    "بورسعيد",
    "دمياط",
    "الشرقية",
    "جنوب سيناء",
    "كفر الشيخ",
    "مطروح",
    "الأقصر",
    "قنا",
    "شمال سيناء",
    "سوهاج"
  ]
  const paymentMethodNames: Record<"cod" | "card" | "wallet", string> = {
    cod: "Cash On Delivery",
    card: "Credit / Debit Card",
    wallet: "Mobile Wallet"
  }
  // =============================
  // Fetch Cart
  // =============================
  useEffect(() => {
    fetch("https://localhost:7282/api/Cart", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.log(err))
  }, [])

  const items = cart?.items || []
  const total = cart?.cartTotal || 0
  const shipping = total >= 1000 ? 0 : 50



  // =============================
  // Submit
  // =============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1️⃣ Create Order
      const orderRes = await fetch(
        "https://localhost:7282/api/order/create-from-cart",
        {
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
            LastName: formData.lastName,
            // PaymentMethod: paymentMethod,
            PaymentMethodName: paymentMethodNames[paymentMethod]
          })
        }
      )

      const order = await orderRes.json()

      // 2️⃣ If COD → مباشرة نجاح
      if (paymentMethod === "cod") {
        router.push("/order-success")
        return
      }

      // 3️⃣ If Card or Wallet → call payment API
      const paymentRes = await fetch(
        "https://localhost:7282/api/payment/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount: total + shipping,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone,
            orderId: order.id,
            paymentMethod: paymentMethod,
            // paymentMethodName: paymentMethodNames[paymentMethod]
          })
        }
      )

      const paymentData = await paymentRes.json()

      // 🔥 Wallet & Card Redirect
      if (paymentData.redirectUrl) {
        // نحفظ transactionId في localStorage مؤقتًا
        localStorage.setItem("pendingOrderId", order.id)

        window.location.href = paymentData.redirectUrl
        return
      }

    } catch (err) {
      console.log(err)
      alert("Payment Failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // =============================
  // UI
  // =============================

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">
            {t("checkout.title")}
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Shipping */}
            <div className="bg-card p-6 rounded-lg mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="First Name"
                  required
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />

                <Input placeholder="Last Name"
                  required
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />

                <Input placeholder="Email"
                  type="email"
                  required
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />

                <Input placeholder="Phone"
                  required
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input placeholder="Country"
                  required
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  value={language === "ar" ? "مصر" : "Egypt"}
                  disabled
                />
                <div>
                  <select
                    required
                    className="w-full mt-2 p-2 border rounded-md bg-background"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  >
                    <option value="">
                      {language === "ar" ? "اختر المحافظة" : "Select Governorate"}
                    </option>

                    {(language === "ar"
                      ? egyptGovernoratesAr
                      : egyptGovernoratesEn
                    ).map((gov, index) => (
                      <option key={index} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
                <Input placeholder="Address"
                  required
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-card p-6 rounded-lg mb-6">
              <h2 className="font-bold mb-4">Payment Method</h2>

              {/* Card */}
              <label className="flex items-center gap-3 border p-4 rounded mb-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <CreditCard />
                <span>Card</span>
              </label>

              {/* Wallet */}
              <label className="flex items-center gap-3 border p-4 rounded mb-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
                <Smartphone />
                <span>Wallet (Vodafone / Etisalat / Orange)</span>
              </label>

              {/* COD */}
              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <Truck />
                <span>Cash On Delivery</span>
              </label>
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

          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}