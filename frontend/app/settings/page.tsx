"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Globe, Moon, Sun, Bell, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { language, setLanguage, t, dir } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-secondary transition-colors">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            {dir === "rtl" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            <Link href="/profile" className="hover:text-secondary transition-colors">
              {t("profile.title")}
            </Link>
            {dir === "rtl" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            <span className="text-foreground">{t("profile.settings")}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("profile.settings")}</h1>

          <div className="max-w-2xl space-y-6">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} className="text-secondary" />
                  {t("profile.language")}
                </CardTitle>
                <CardDescription>
                  {language === "ar" ? "اختر لغة العرض المفضلة" : "Choose your preferred display language"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    className={language === "en" ? "bg-secondary text-secondary-foreground" : ""}
                    onClick={() => setLanguage("en")}
                  >
                    🇬🇧 English
                  </Button>
                  <Button
                    variant={language === "ar" ? "default" : "outline"}
                    className={language === "ar" ? "bg-secondary text-secondary-foreground" : ""}
                    onClick={() => setLanguage("ar")}
                  >
                    🇪🇬 العربية
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === "light" ? (
                    <Sun size={20} className="text-accent" />
                  ) : (
                    <Moon size={20} className="text-secondary" />
                  )}
                  {t("profile.theme")}
                </CardTitle>
                <CardDescription>
                  {language === "ar" ? "اختر المظهر المفضل للموقع" : "Choose your preferred theme for the website"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sun size={20} className="text-accent" />
                    <span>{t("profile.light")}</span>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
                  <div className="flex items-center gap-3">
                    <span>{t("profile.dark")}</span>
                    <Moon size={20} className="text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={20} className="text-secondary" />
                  {language === "ar" ? "الإشعارات" : "Notifications"}
                </CardTitle>
                <CardDescription>
                  {language === "ar" ? "إدارة تفضيلات الإشعارات" : "Manage your notification preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="order-updates">{language === "ar" ? "تحديثات الطلبات" : "Order updates"}</Label>
                  <Switch id="order-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="promotions">{language === "ar" ? "العروض والتخفيضات" : "Promotions and deals"}</Label>
                  <Switch id="promotions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="newsletter">{language === "ar" ? "النشرة الإخبارية" : "Newsletter"}</Label>
                  <Switch id="newsletter" />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} className="text-secondary" />
                  {language === "ar" ? "الخصوصية والأمان" : "Privacy & Security"}
                </CardTitle>
                <CardDescription>
                  {language === "ar" ? "إدارة إعدادات الخصوصية والأمان" : "Manage your privacy and security settings"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">
                    {language === "ar" ? "التحقق بخطوتين" : "Two-factor authentication"}
                  </Label>
                  <Switch id="two-factor" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="activity-log">{language === "ar" ? "سجل النشاط" : "Activity log"}</Label>
                  <Switch id="activity-log" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Back to Profile */}
            <div className="flex justify-center pt-4">
              <Link href="/profile">
                <Button variant="outline">
                  {dir === "rtl" ? (
                    <ChevronRight size={16} className="me-2" />
                  ) : (
                    <ChevronLeft size={16} className="me-2" />
                  )}
                  {language === "ar" ? "العودة للحساب" : "Back to Account"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
