"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500">Detailed analytics for your store performance</p>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Revenue</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Orders</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
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
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
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
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
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