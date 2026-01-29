"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"

export default function WishlistPage() {
  const { language, t } = useLanguage()
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
    })
    removeItem(item.id)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("profile.wishlist")}</h1>

          {items.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Heart size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {language === "ar" ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "ar" ? "أضف منتجات تحبها لقائمة المفضلة" : "Add products you love to your wishlist"}
              </p>
              <Link href="/">
                <Button>{t("cart.continueShopping")}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="relative h-48 bg-secondary">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name[language]}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 end-2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {item.name[language]}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-foreground">
                        {formatPrice(item.price)} {t("products.price")}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleMoveToCart(item)}
                    >
                      <ShoppingCart size={16} className="me-2" />
                      {t("products.addToCart")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
