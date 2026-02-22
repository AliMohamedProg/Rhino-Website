import type React from "react"
import type { Metadata } from "next"
import { cairo, geist } from "./fonts"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { themeScript } from "@/lib/theme-script"
import { AppProviders } from "@/providers"

export const metadata: Metadata = {
  title: "Wood Decor - Your Home, Your Style",
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
  // ❌ شيل useAuth() من هنا

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AppProviders geistClass={geist.className} cairoClass={cairo.className}>
          {children}
        </AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
