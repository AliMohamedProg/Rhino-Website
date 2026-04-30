"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Save, Store, Bell, Shield } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Settings saved successfully")
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#8f3f2a]/12 bg-white/85 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-[#d66a49]/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-[#c7aea2]/26 blur-2xl" />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7d73]">System</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#2f2219]">Settings</h1>
          <p className="mt-1 text-sm font-medium text-[#7c6f65]">Manage your store profile, notifications and security options.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="h-auto rounded-2xl border border-[#8f3f2a]/12 bg-white/75 p-1">
          <TabsTrigger value="general" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8f3f2a] data-[state=active]:to-[#c16043] data-[state=active]:text-white">General</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8f3f2a] data-[state=active]:to-[#c16043] data-[state=active]:text-white">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8f3f2a] data-[state=active]:to-[#c16043] data-[state=active]:text-white">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2f2219]"><Store className="h-5 w-5" /> Store Information</CardTitle>
              <CardDescription>Keep the storefront profile accurate and up to date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="Rhino Furniture" className="admin-input" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storeEmail">Email</Label>
                <Input id="storeEmail" type="email" defaultValue="contact@rhino.com" className="admin-input" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storePhone">Phone</Label>
                <Input id="storePhone" defaultValue="+20 100 000 0000" className="admin-input" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Textarea id="storeAddress" defaultValue="Cairo, Egypt" className="admin-input" />
              </div>
              <Button onClick={handleSave} disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-[#8f3f2a] to-[#c16043] text-white">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2f2219]"><Bell className="h-5 w-5" /> Notification Settings</CardTitle>
              <CardDescription>Choose what updates the admin team should receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#8f3f2a]/10 bg-white/80 p-4">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-[#7c6f65]">Receive emails for every new order.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#8f3f2a]/10 bg-white/80 p-4">
                <div>
                  <Label>Order Updates</Label>
                  <p className="text-sm text-[#7c6f65]">Get alerts when order status changes.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#8f3f2a]/10 bg-white/80 p-4">
                <div>
                  <Label>New Reviews</Label>
                  <p className="text-sm text-[#7c6f65]">Notify team when customers leave reviews.</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleSave} disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-[#8f3f2a] to-[#c16043] text-white">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="admin-card border-[#8f3f2a]/12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2f2219]"><Shield className="h-5 w-5" /> Security Settings</CardTitle>
              <CardDescription>Update passwords and strengthen admin account access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" className="admin-input" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="admin-input" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" className="admin-input" />
              </div>
              <Button onClick={handleSave} disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-[#8f3f2a] to-[#c16043] text-white">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
