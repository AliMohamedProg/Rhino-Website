"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CreditCard, ShieldCheck } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatPrice } from "@/lib/products"
import { useEffect, useState } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"
import { getImageUrl } from "@/lib/utils"

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
  const [stockByItemId, setStockByItemId] = useState<Record<string, number>>({})

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.get<Cart>("api/Cart")
      setCart(data)
      
      if (data.items.length > 0) {
        const stocks = await Promise.all(
          data.items.map(async (item) => {
            try {
              const itemData: any = await ApiClient.get(`api/Items/${item.itemId}`)
              return { id: item.itemId, stock: itemData.stockNumber ?? 0 }
            } catch {
              return null
            }
          })
        )
        const stockMap: Record<string, number> = {}
        stocks.forEach(s => { if(s) stockMap[s.id] = s.stock })
        setStockByItemId(stockMap)
      }
      setError(null)
    } catch (err: any) {
      console.error(err)
      if (err.message?.includes("401")) {
        setError("Please login to view your cart")
      } else {
        setError("Your cart session is currently unavailable.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) return removeItem(productId)
    try {
      await ApiClient.patch(`api/Cart/items/${productId}`, { Quantity: quantity })
      fetchCart()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update quantity")
    }
  }

  const removeItem = async (productId: string) => {
    try {
      await ApiClient.delete(`api/Cart/item/delete/${productId}`)
      fetchCart()
      toast.success("Item removed from cart")
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove item")
    }
  }

  const items = cart?.items || []
  const subtotal = cart?.cartTotal || 0
  const shipping = subtotal >= 5000 ? 0 : 50

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-mahogany border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-20 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h1 className="text-5xl font-black text-black tracking-tight italic mb-2">Cart.</h1>
              <p className="text-taupe text-[11px] font-bold tracking-[0.2em] uppercase">Review your selected pieces</p>
            </div>
            <p className="text-sm font-bold text-black">{items.length} {items.length === 1 ? 'Item' : 'Items'}</p>
          </div>

          {error || items.length === 0 ? (
            <div className="bg-gray-50 rounded-[3rem] p-20 text-center border border-gray-100 italic shadow-inner">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-6" />
              <h2 className="text-2xl font-bold text-black mb-4">
                {error || "Your cart is currently awaiting your selection."}
              </h2>
              <Link href="/">
                <Button className="h-14 rounded-full bg-mahogany px-10 text-[11px] font-bold tracking-widest uppercase hover:scale-105 transition-all">
                  Browse Collection
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-16">
              {/* Product List */}
              <div className="lg:col-span-8 space-y-10">
                {items.map((item) => (
                  <div key={item.id} className="group relative flex flex-col md:flex-row gap-8 pb-10 border-b border-gray-100">
                    <div className="relative w-full md:w-48 aspect-square bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-50">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.nameEn}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <Link href={`/product/${item.itemId}`}>
                            <h3 className="text-xl font-bold text-black hover:text-mahogany transition-colors">
                              {item.nameEn}
                            </h3>
                          </Link>
                          <p className="text-xl font-black text-black">{formatPrice(item.price)} EGP</p>
                        </div>
                        <p className="text-[11px] font-bold text-taupe tracking-widest uppercase">{item.color || "Standard Finish"}</p>
                      </div>

                      <div className="flex items-center justify-between mt-8 md:mt-0">
                        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all text-black hover:shadow-sm"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="w-12 text-center text-sm font-black text-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all text-black hover:shadow-sm"
                            disabled={stockByItemId[item.itemId] && item.quantity >= stockByItemId[item.itemId]}
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.itemId)}
                          className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Side */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                <div className="bg-black text-white rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
                  {/* Decorative background circle */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <h2 className="text-2xl font-bold mb-10 italic">Summary.</h2>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center opacity-60">
                      <span className="text-[11px] font-bold tracking-widest uppercase">Subtotal</span>
                      <span className="text-sm font-bold">{formatPrice(subtotal)} EGP</span>
                    </div>
                    <div className="flex justify-between items-center opacity-60">
                      <span className="text-[11px] font-bold tracking-widest uppercase">Shipping</span>
                      <span className="text-sm font-bold">{shipping === 0 ? "Complimentary" : `${formatPrice(shipping)} EGP`}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <span className="text-[11px] font-bold tracking-widest uppercase mb-1">Total</span>
                      <span className="text-4xl font-black text-mahogany">{formatPrice(subtotal + shipping)} EGP</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link href="/checkout">
                      <Button className="w-full h-16 rounded-full bg-white text-black hover:bg-mahogany hover:text-white text-[12px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3">
                        Express Checkout <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="ghost" className="w-full h-14 rounded-full border border-white/10 hover:bg-white/5 text-[10px] font-bold tracking-widest uppercase transition-all">
                        Continue Selection
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-10 flex items-center justify-between text-[10px] font-bold text-white/30 tracking-widest uppercase border-t border-white/5 pt-8">
                     <span>Secure Payment</span>
                     <div className="flex gap-4">
                        <CreditCard size={14} />
                        <ShieldCheck size={14} />
                     </div>
                  </div>
                </div>

                <div className="mt-8 bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                    <p className="text-[10px] font-bold text-taupe uppercase tracking-widest leading-relaxed">
                        Rhino ensures 100% authenticity and lifetime craftsmanship on every piece shipped.
                    </p>
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




