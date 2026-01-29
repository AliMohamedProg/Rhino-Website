"use client";

import { useState } from "react";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Store, Bell, Shield, CreditCard, Truck, Mail } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t, isRTL } = useAdminLanguage();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isRTL ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة إعدادات المتجر والتفضيلات" : "Manage your store settings and preferences"}
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 me-2" />
          {loading ? (isRTL ? "جاري الحفظ..." : "Saving...") : t("save")}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? "عام" : "General"}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? "الإشعارات" : "Notifications"}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? "الأمان" : "Security"}</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? "الدفع" : "Payment"}</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? "الشحن" : "Shipping"}</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? "البريد" : "Email"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "معلومات المتجر" : "Store Information"}</CardTitle>
              <CardDescription>
                {isRTL ? "المعلومات الأساسية لمتجرك" : "Basic information about your store"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{isRTL ? "اسم المتجر" : "Store Name"}</Label>
                  <Input defaultValue="Homzmart" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input type="email" defaultValue="contact@homzmart.com" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "رقم الهاتف" : "Phone"}</Label>
                  <Input defaultValue="+966 50 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "العملة" : "Currency"}</Label>
                  <Select defaultValue="SAR">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">{isRTL ? "ريال سعودي (SAR)" : "Saudi Riyal (SAR)"}</SelectItem>
                      <SelectItem value="USD">{isRTL ? "دولار أمريكي (USD)" : "US Dollar (USD)"}</SelectItem>
                      <SelectItem value="EUR">{isRTL ? "يورو (EUR)" : "Euro (EUR)"}</SelectItem>
                      <SelectItem value="AED">{isRTL ? "درهم إماراتي (AED)" : "UAE Dirham (AED)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "العنوان" : "Address"}</Label>
                <Textarea defaultValue="123 Main St, Riyadh, Saudi Arabia" />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "وصف المتجر" : "Store Description"}</Label>
                <Textarea 
                  defaultValue={isRTL ? "متجر هومزمارت للأثاث والمفروشات المنزلية" : "Homzmart - Your destination for home furniture and decor"}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إعدادات اللغة" : "Language Settings"}</CardTitle>
              <CardDescription>
                {isRTL ? "تكوين اللغات المدعومة" : "Configure supported languages"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "اللغة العربية" : "Arabic Language"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "تفعيل دعم اللغة العربية" : "Enable Arabic language support"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "اللغة الإنجليزية" : "English Language"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "تفعيل دعم اللغة الإنجليزية" : "Enable English language support"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}</CardTitle>
              <CardDescription>
                {isRTL ? "إدارة إشعارات البريد الإلكتروني" : "Manage email notification preferences"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "طلبات جديدة" : "New Orders"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إشعار عند استلام طلب جديد" : "Notify when a new order is received"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "مخزون منخفض" : "Low Stock"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إشعار عند انخفاض المخزون" : "Notify when stock is running low"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "تسجيل مستخدم جديد" : "New User Registration"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إشعار عند تسجيل مستخدم جديد" : "Notify when a new user registers"}
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "مراجعات المنتجات" : "Product Reviews"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إشعار عند إضافة مراجعة جديدة" : "Notify when a new review is added"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إعدادات الأمان" : "Security Settings"}</CardTitle>
              <CardDescription>
                {isRTL ? "تكوين إعدادات أمان الحساب" : "Configure account security settings"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "المصادقة الثنائية" : "Two-Factor Authentication"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "تفعيل المصادقة الثنائية لمزيد من الأمان" : "Enable 2FA for additional security"}
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "تسجيل الدخول بالبريد" : "Email Login Alerts"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إشعار عند تسجيل الدخول من جهاز جديد" : "Alert when logging in from a new device"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "مهلة الجلسة (دقائق)" : "Session Timeout (minutes)"}</Label>
                <Input type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "طرق الدفع" : "Payment Methods"}</CardTitle>
              <CardDescription>
                {isRTL ? "تكوين طرق الدفع المتاحة" : "Configure available payment methods"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "بطاقات الائتمان" : "Credit Cards"}</Label>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Apple Pay</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "الدفع عبر Apple Pay" : "Pay with Apple Pay"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "الدفع عند الاستلام" : "Cash on Delivery"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "السماح بالدفع عند الاستلام" : "Allow cash payment on delivery"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tabby / Tamara</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "الدفع بالتقسيط" : "Buy now, pay later"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إعدادات الشحن" : "Shipping Settings"}</CardTitle>
              <CardDescription>
                {isRTL ? "تكوين خيارات الشحن والتوصيل" : "Configure shipping and delivery options"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{isRTL ? "رسوم الشحن الافتراضية" : "Default Shipping Fee"}</Label>
                  <Input type="number" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "حد الشحن المجاني" : "Free Shipping Threshold"}</Label>
                  <Input type="number" defaultValue="500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "الشحن السريع" : "Express Shipping"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "توصيل خلال 24 ساعة" : "Delivery within 24 hours"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "الشحن الدولي" : "International Shipping"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "السماح بالشحن الدولي" : "Allow international shipping"}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إعدادات البريد الإلكتروني" : "Email Configuration"}</CardTitle>
              <CardDescription>
                {isRTL ? "تكوين خادم البريد الإلكتروني" : "Configure email server settings"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{isRTL ? "خادم SMTP" : "SMTP Server"}</Label>
                  <Input defaultValue="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "منفذ SMTP" : "SMTP Port"}</Label>
                  <Input defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "اسم المستخدم" : "Username"}</Label>
                  <Input defaultValue="noreply@homzmart.com" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? "كلمة المرور" : "Password"}</Label>
                  <Input type="password" defaultValue="********" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? "تشفير TLS" : "TLS Encryption"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "استخدام اتصال آمن" : "Use secure connection"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
