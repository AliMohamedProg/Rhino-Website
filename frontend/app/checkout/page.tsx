"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  CreditCard, 
  Smartphone, 
  Truck, 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  ChevronRight,
  Info 
} from "lucide-react"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/products"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { getImageUrl, cn } from "@/lib/utils"

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
  const [loading, setLoading] = useState(true)

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
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
    "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia", "New Valley", "Suez", 
    "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", 
    "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
  ]

  const shippingRates: Record<string, number> = {
    "Cairo": 50, "Giza": 50, "Alexandria": 60, "Port Said": 65, "Suez": 65,
    "Ismailia": 65, "Dakahlia": 70, "Gharbia": 70, "Kafr El Sheikh": 70,
    "Menofia": 70, "Damietta": 70, "Sharkia": 70, "Beheira": 70, "Qalyubia": 55,
    "Beni Suef": 80, "Fayoum": 80, "Minya": 90, "Assiut": 100, "Sohag": 110,
    "Qena": 120, "Luxor": 130, "Aswan": 150, "Red Sea": 150, "New Valley": 180,
    "Matrouh": 150, "North Sinai": 180, "South Sinai": 180,
  }

  const paymentMethodNames: Record<"cod" | "card" | "wallet", string> = {
    cod: "Cash On Delivery",
    card: "Credit / Debit Card",
    wallet: "Mobile Wallet"
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await ApiClient.get<Cart>("api/Cart")
        setCart(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const items = cart?.items || []
  const total = cart?.cartTotal || 0
  const baseShippingCharge = shippingRates[formData.city] || 50
  const shipping = (total >= 5000 || total === 0) ? 0 : baseShippingCharge;
  const orderTotal = total + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    
    setIsSubmitting(true)

    try {
      // Sanitize phone number to strictly max 11 digits for backend validation
      const sanitizedPhone = formData.phone.replace(/\D/g, "").slice(-11)

      // 1. Create Order (Using PascalCase to match AddOrderRequest.cs exactly)
      const order: any = await ApiClient.post(
        "api/order/create-from-cart",
        {
          Country: formData.country,
          City: formData.city,
          Address: formData.address,
          Total: orderTotal,
          PhoneNumber: sanitizedPhone,
          Email: formData.email,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          PaymentMethodName: paymentMethodNames[paymentMethod],
          TransactionId: null
        }
      )

      // The backend might return order with PascalCase Id or camelCase id
      const orderId = order.id || order.Id || order.ID

      // 2. COD flow
      if (paymentMethod === "cod") {
        router.push("/order-success")
        return
      }

      // 3. Digital Payment flow
      // amount must be in cents (integer) for the payment gateway
      const amountInCents = (Math.round(orderTotal * 100)) | 0
      
      const paymentData: any = await ApiClient.post(
        "api/payment/create",
        {
          Amount: amountInCents, 
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          PhoneNumber: sanitizedPhone,
          OrderId: orderId,
          PaymentMethod: paymentMethod,
        }
      )

      if (paymentData.redirectUrl) {
        localStorage.setItem("pendingOrderId", orderId)
        window.location.href = paymentData.redirectUrl
        return
      }

    } catch (err: any) {
      console.error("Checkout submission error:", err)
      if (err.message?.includes("Cart is empty")) {
        toast.error("Your order was initiated, but the cart was cleared. Please check your profile or contact support if payment failed.")
      } else {
        toast.error(`Order failed: ${err.message || "Please check your information and try again."}`)
      }
    } finally {
      setIsSubmitting(false)
    }

  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-mahogany border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold tracking-widest text-mahogany uppercase">Securing Session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 mt-20">
        <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
          
          {/* Left Column: Form Details */}
          <div className="flex-1 px-6 md:px-12 py-12 lg:border-r border-gray-100">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 mb-8 text-taupe text-[10px] font-bold tracking-[0.2em] uppercase">
                <Link href="/cart" className="flex items-center gap-1 hover:text-mahogany transition-colors">
                  <ChevronLeft size={14} /> Back to Cart
                </Link>
                <ChevronRight size={14} className="opacity-30" />
                <span className="text-mahogany">Checkout</span>
              </div>

              <h1 className="text-4xl font-bold text-black mb-10 tracking-tight">Shipping Information</h1>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Contact Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-mahogany/10 text-mahogany flex items-center justify-center text-xs font-bold">1</div>
                    <h2 className="text-lg font-bold text-black tracking-tight">Contact Details</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">First Name</label>
                      <Input 
                        placeholder="e.g. John" 
                        required 
                        className="rounded-2xl border-gray-100 focus:border-mahogany focus:ring-mahogany/5 h-14 px-5 text-sm"
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">Last Name</label>
                      <Input 
                        placeholder="e.g. Doe" 
                        required 
                        className="rounded-2xl border-gray-100 focus:border-mahogany focus:ring-mahogany/5 h-14 px-5 text-sm"
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        className="rounded-2xl border-gray-100 focus:border-mahogany focus:ring-mahogany/5 h-14 px-5 text-sm"
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">Phone Number</label>
                      <Input 
                        placeholder="01xxxxxxxxx" 
                        required 
                        className="rounded-2xl border-gray-100 focus:border-mahogany focus:ring-mahogany/5 h-14 px-5 text-sm"
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* Shipping Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-mahogany/10 text-mahogany flex items-center justify-center text-xs font-bold">2</div>
                    <h2 className="text-lg font-bold text-black tracking-tight">Shipping Address</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">Governorate</label>
                      <select
                        required
                        className="w-full rounded-2xl border border-gray-100 focus:border-mahogany focus:ring-mahogany/5 h-14 px-5 text-sm bg-white focus:outline-none transition-all"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      >
                        <option value="">Select city</option>
                        {egyptGovernoratesEn.map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">Country</label>
                      <Input 
                        value="Egypt" 
                        disabled 
                        className="rounded-2xl border-gray-50 bg-gray-50 text-gray-400 h-14 px-5 text-sm opacity-60"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-taupe uppercase tracking-widest pl-1">Street Address</label>
                      <Input 
                        placeholder="Unit, Floor, Street Name..." 
                        required 
                        className="rounded-2xl border-gray-100 focus:border-mahogany focus:ring-mahogany/5 h-14 px-5 text-sm"
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-mahogany/10 text-mahogany flex items-center justify-center text-xs font-bold">3</div>
                    <h2 className="text-lg font-bold text-black tracking-tight">Payment Method</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: "card", name: "Credit / Debit Card", icon: CreditCard, subtitle: "Secure Paymob Integration" },
                      { id: "wallet", name: "Mobile Wallet", icon: Smartphone, subtitle: "Vodafone, Etisalat, Orange, etc." },
                      { id: "cod", name: "Cash on Delivery", icon: Truck, subtitle: "Pay when you receive" },
                    ].map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={cn(
                          "relative flex items-center gap-4 p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group",
                          paymentMethod === method.id 
                            ? "border-mahogany bg-mahogany/5 shadow-lg shadow-mahogany/5" 
                            : "border-gray-100 bg-white hover:border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-2xl transition-colors",
                          paymentMethod === method.id ? "bg-mahogany text-white" : "bg-gray-50 text-taupe group-hover:bg-gray-100"
                        )}>
                          <method.icon size={22} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-black">{method.name}</p>
                          <p className="text-[11px] text-taupe font-medium">{method.subtitle}</p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all",
                          paymentMethod === method.id ? "bg-mahogany ring-2 ring-mahogany" : "bg-gray-100"
                        )}>
                          {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || total === 0}
                    className="w-full h-16 rounded-full bg-mahogany hover:bg-[#5C2E1A] text-white text-[12px] font-black tracking-[0.2em] uppercase shadow-2xl shadow-mahogany/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : `Complete Purchase — ${formatPrice(orderTotal)} EGP`}
                  </Button>
                  <p className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-taupe font-bold uppercase tracking-widest">
                    <Lock size={12} /> Secure 256-bit encrypted checkout
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="w-full lg:w-[450px] bg-gray-50/50 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto px-6 md:px-12 py-12">
            <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Order Summary</h2>
            
            <div className="space-y-6 mb-10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-24 h-24 bg-white rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.nameEn}
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute top-1 right-1 bg-mahogany text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <h3 className="text-sm font-bold text-black line-clamp-1">{item.nameEn}</h3>
                    <p className="text-[11px] text-taupe font-bold tracking-widest uppercase">{item.color || "Standard Finish"}</p>
                    <p className="text-sm font-bold text-mahogany mt-1">{formatPrice(item.price)} EGP</p>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-taupe font-medium">Your cart is currently empty.</p>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-8">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-taupe tracking-wide text-[11px] uppercase">Subtotal</span>
                <span className="text-sm font-bold text-black">{formatPrice(total)} EGP</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-taupe tracking-wide text-[11px] uppercase">Shipping</span>
                    <Info size={12} className="text-gray-300" />
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  shipping === 0 ? "text-green-600" : "text-black"
                )}>
                  {shipping === 0 ? "Free" : `${formatPrice(shipping)} EGP`}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-black tracking-tight">Total Amount</span>
                  <span className="text-[10px] text-taupe font-medium">Includes VAT and local taxes</span>
                </div>
                <span className="text-3xl font-black text-mahogany tracking-tight">{formatPrice(orderTotal)} EGP</span>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-[2rem] p-6 border border-gray-100 space-y-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-black">Rhino Performance Guarantee</p>
                        <p className="text-[10px] text-taupe">Experience our lifetime durability test</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}