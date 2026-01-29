"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"

export default function CartPage() {
  const { language, t } = useLanguage()
  const { items, removeItem, updateQuantity, total } = useCart()

  const shipping = total >= 1000 ? 0 : 50

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
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-card rounded-lg border border-border p-4 flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name[language]}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.name[language]}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-foreground">
                          {formatPrice(item.price)} {t("products.price")}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
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
