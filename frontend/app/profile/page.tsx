// "use client"
// import Link from "next/link"
// import { User, Package, Heart, Settings, LogOut, Moon, Sun, Globe, Route } from "lucide-react"
// import { Header } from "@/components/layout/header"
// import { Footer } from "@/components/layout/footer"
// import { useLanguage } from "@/context/language-context"
// import { useTheme } from "@/context/theme-context"
// import { useWishlist } from "@/context/wishlist-context"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { useAuth } from "../Context/auth-context"
// import { useRouter } from "next/router"

// const menuItems = [
//   { key: "profile.orders", icon: Package, href: "/profile/orders" },
//   { key: "profile.wishlist", icon: Heart, href: "/wishlist" },
//   { key: "profile.settings", icon: Settings, href: "/settings" },
// ]

// export default function ProfilePage() {
//   const { language, setLanguage, t } = useLanguage()
//   const { theme, toggleTheme } = useTheme()
//   const { items: wishlistItems } = useWishlist()
//   const { logout } = useAuth()

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1 bg-secondary">
//         <div className="container mx-auto px-4 py-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("profile.title")}</h1>

//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Profile Card */}
//             <div className="bg-card rounded-lg border border-border p-6">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
//                   <User size={32} className="text-primary-foreground" />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-foreground">
//                     {language === "ar" ? "مستخدم ضيف" : "Guest User"}
//                   </h2>
//                   <p className="text-sm text-muted-foreground">guest@example.com</p>
//                 </div>
//               </div>

//               <nav className="space-y-1">
//                 {menuItems.map((item) => (
//                   <Link
//                     key={item.key}
//                     href={item.href}
//                     className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
//                   >
//                     <item.icon size={20} className="text-muted-foreground" />
//                     <span>{t(item.key)}</span>
//                     {item.key === "profile.wishlist" && wishlistItems.length > 0 && (
//                       <span className="ms-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
//                         {wishlistItems.length}
//                       </span>
//                     )}
//                   </Link>
//                 ))}
//                 <button  onClick={async () => {
//         await logout()
//         window.location.href = "/"
//       }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-secondary transition-colors">
//                   <LogOut size={20} />
//                   <span>{t("profile.logout")}</span>
//                 </button>
//               </nav>
//             </div>

//             {/* Settings */}
//             <div className="md:col-span-2 space-y-6">
//               {/* Language Settings */}
//               <div className="bg-card rounded-lg border border-border p-6">
//                 <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//                   <Globe size={20} />
//                   {t("profile.language")}
//                 </h3>
//                 <div className="flex gap-3">
//                   <Button
//                     variant={language === "en" ? "default" : "outline"}
//                     onClick={() => setLanguage("en")}
//                     className={language === "en" ? "bg-primary text-primary-foreground" : ""}
//                   >
//                     🇬🇧 English
//                   </Button>
//                   <Button
//                     variant={language === "ar" ? "default" : "outline"}
//                     onClick={() => setLanguage("ar")}
//                     className={language === "ar" ? "bg-primary text-primary-foreground" : ""}
//                   >
//                     🇪🇬 العربية
//                   </Button>
//                 </div>
//               </div>

//               {/* Theme Settings */}
//               <div className="bg-card rounded-lg border border-border p-6">
//                 <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//                   {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
//                   {t("profile.theme")}
//                 </h3>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Sun size={18} className="text-muted-foreground" />
//                     <span className="text-foreground">{t("profile.light")}</span>
//                   </div>
//                   <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
//                   <div className="flex items-center gap-3">
//                     <span className="text-foreground">{t("profile.dark")}</span>
//                     <Moon size={18} className="text-muted-foreground" />
//                   </div>
//                 </div>
//               </div>

//               {/* Orders Preview */}
//               <div className="bg-card rounded-lg border border-border p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                     <Package size={20} />
//                     {t("profile.orders")}
//                   </h3>
//                   <Link href="/profile/orders" className="text-sm text-primary hover:underline">
//                     {t("products.viewMore")}
//                   </Link>
//                 </div>
//                 <div className="text-center py-8 text-muted-foreground">
//                   {language === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
"use client"
import Link from "next/link"
import { User, Package, Settings, LogOut, Moon, Sun, Globe, Eye, EyeOff } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "../Context/auth-context"
import { useEffect, useState } from "react"

const menuItems = [
  { key: "profile.orders", icon: Package, href: "/profile/orders" },
  { key: "profile.settings", icon: Settings, href: "/settings" },
]

export default function ProfilePage() {
 
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState("profile.orders") // default selected menu

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-foreground">{t("profile.title")}</h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={32} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user?.username || "Guest User"}</h2>
                <p className="text-sm text-gray-500">{user?.email || "guest@example.com"}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
                    activeTab === item.key ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <item.icon size={20} className="text-gray-500" />
                  <span>{t(item.key)}</span>
                </button>
              ))}
              <button
                onClick={async () => {
                  await logout()
                  window.location.href = "/"
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-gray-100 transition-colors"
              >
                <LogOut size={20} />
                <span>{t("profile.logout")}</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-6">



            {/* Orders Preview Tab */}
            {activeTab === "profile.orders" && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package size={20} />
                    {t("profile.orders")}
                  </h3>
                  <Link href="/profile/orders" className="text-sm text-blue-600 hover:underline">
                    {t("products.viewMore")}
                  </Link>
                </div>
                <div className="text-center py-8 text-gray-400">
                  {language === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "profile.settings" && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  {t("profile.settings")}
                </h3>

                {/* Language */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe size={16} />
                    {t("profile.language")}
                  </h4>
                  <div className="flex gap-3">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      onClick={() => setLanguage("en")}
                      className={language === "en" ? "bg-blue-600 text-white" : ""}
                    >
                      🇬🇧 English
                    </Button>
                    <Button
                      variant={language === "ar" ? "default" : "outline"}
                      onClick={() => setLanguage("ar")} 
                      className={language === "ar" ? "bg-blue-600 text-white" : ""}
                    >
                      🇪🇬 العربية
                    </Button>
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
                    {t("profile.theme")}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sun size={16} className="text-gray-400" />
                      <span className="text-gray-900">{t("profile.light")}</span>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900">{t("profile.dark")}</span>
                      <Moon size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
