"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#7B3F32]/12 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#7B3F32]/10 blur-2xl z-0" />
        <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-[#C1AFA0]/30 blur-2xl z-0" />
        
        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8b7d73]">Insights</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f2219] mt-1">Analytics</h1>
          <p className="text-[#7c6f65] mt-1 text-sm font-medium">Detailed analytics for your store performance</p>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-white/60 backdrop-blur-xl border border-[#7B3F32]/10 p-1 rounded-2xl shadow-sm h-auto">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7B3F32] data-[state=active]:to-[#9e5948] data-[state=active]:text-white font-medium rounded-xl py-2 px-4 transition-all">Revenue</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7B3F32] data-[state=active]:to-[#9e5948] data-[state=active]:text-white font-medium rounded-xl py-2 px-4 transition-all">Orders</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7B3F32] data-[state=active]:to-[#9e5948] data-[state=active]:text-white font-medium rounded-xl py-2 px-4 transition-all">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            <CardContent className="h-[750px] p-0 relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" onClick={() => window.open('https://lookerstudio.google.com/embed/reporting/a57ecd37-7283-47b9-aa03-3411c7dbcf1d/page/kIV1C', '_blank')}>
                  Open in New Tab
                </Button>
              </div>
              <iframe
                width="100%"
                height="100%"
                src="https://lookerstudio.google.com/embed/reporting/a57ecd37-7283-47b9-aa03-3411c7dbcf1d/page/kIV1C"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            <CardContent className="h-[750px] p-0 relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" onClick={() => window.open('https://lookerstudio.google.com/embed/reporting/da7dbee6-53a9-4d05-ae92-fbd06f6c8893/page/p_ev5o6t54bd', '_blank')}>
                  Open in New Tab
                </Button>
              </div>
              <iframe
                width="100%"
                height="100%"
                src="https://lookerstudio.google.com/embed/reporting/da7dbee6-53a9-4d05-ae92-fbd06f6c8893/page/p_ev5o6t54bd"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="border-[#7B3F32]/10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            <CardContent className="h-[750px] p-0 relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" onClick={() => window.open('https://lookerstudio.google.com/embed/reporting/65c6334d-6af5-4d56-ae58-c4fb4d6d8d56/page/p_6F1C', '_blank')}>
                  Open in New Tab
                </Button>
              </div>
              <iframe
                width="100%"
                height="100%"
                src="https://lookerstudio.google.com/embed/reporting/65c6334d-6af5-4d56-ae58-c4fb4d6d8d56/page/p_6F1C"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}