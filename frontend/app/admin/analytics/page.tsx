"use client";

import { useState } from "react";
import { useAdminLanguage } from "@/context/admin-language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed analytics for your store performance
          </p>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsContent value="revenue" className="space-y-4">
          <Card>
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
          <Card>
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

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardContent className="h-[750px] p-0 relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" onClick={() => window.open('https://lookerstudio.google.com/s/jRsBUMKJ1RY', '_blank')}>
                  Open in New Tab
                </Button>
              </div>
              <iframe width="100%" height="100%" src="https://lookerstudio.google.com/s/jRsBUMKJ1RY" frameBorder="0" allowFullScreen className="rounded-lg" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardContent className="h-[750px] p-0 relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" onClick={() => window.open('https://lookerstudio.google.com/s/osrfW19gP_s', '_blank')}>
                  Open in New Tab
                </Button>
              </div>
              <iframe width="100%" height="100%" src="https://lookerstudio.google.com/s/osrfW19gP_s" frameBorder="0" allowFullScreen className="rounded-lg" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

