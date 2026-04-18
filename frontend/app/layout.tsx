import type React from "react"
import type { Metadata } from "next"
import { geist, playfair, raleway } from "./fonts"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppProviders } from "@/providers"
import { MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Rhino website - Your Home, Your Style",
  description: "Shop furniture and home décor online. Transform your living space with quality products.",
  icons: {
    icon: "/images/logo-websait.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${raleway.variable} ${playfair.variable} antialiased bg-white text-black`} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
        <Analytics />
        <GoogleAnalytics gaId="G-78J3VLPBR7" />
        <a
          href="https://wa.me/201070065192"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={28} />
        </a>
      </body>
    </html>
  )
}
