"use client"
import Link from "next/link"
import { User, Package, Heart, Settings, LogOut, Moon, Sun, Globe, Route } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "../Context/auth-context"
import { useRouter } from "next/router"

const menuItems = [
  { key: "profile.orders", icon: Package, href: "/profile/orders" },
  { key: "profile.wishlist", icon: Heart, href: "/wishlist" },
  { key: "profile.settings", icon: Settings, href: "/settings" },
]

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { items: wishlistItems } = useWishlist()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("profile.title")}</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <User size={32} className="text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {language === "ar" ? "مستخدم ضيف" : "Guest User"}
                  </h2>
                  <p className="text-sm text-muted-foreground">guest@example.com</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
                  >
                    <item.icon size={20} className="text-muted-foreground" />
                    <span>{t(item.key)}</span>
                    {item.key === "profile.wishlist" && wishlistItems.length > 0 && (
                      <span className="ms-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                ))}
                <button  onClick={async () => {
        await logout()
        window.location.href = "/"
      }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-secondary transition-colors">
                  <LogOut size={20} />
                  <span>{t("profile.logout")}</span>
                </button>
              </nav>
            </div>

            {/* Settings */}
            <div className="md:col-span-2 space-y-6">
              {/* Language Settings */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe size={20} />
                  {t("profile.language")}
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                    className={language === "en" ? "bg-primary text-primary-foreground" : ""}
                  >
                    🇬🇧 English
                  </Button>
                  <Button
                    variant={language === "ar" ? "default" : "outline"}
                    onClick={() => setLanguage("ar")}
                    className={language === "ar" ? "bg-primary text-primary-foreground" : ""}
                  >
                    🇪🇬 العربية
                  </Button>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
                  {t("profile.theme")}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sun size={18} className="text-muted-foreground" />
                    <span className="text-foreground">{t("profile.light")}</span>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  <div className="flex items-center gap-3">
                    <span className="text-foreground">{t("profile.dark")}</span>
                    <Moon size={18} className="text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Orders Preview */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Package size={20} />
                    {t("profile.orders")}
                  </h3>
                  <Link href="/profile/orders" className="text-sm text-primary hover:underline">
                    {t("products.viewMore")}
                  </Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  {language === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
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
