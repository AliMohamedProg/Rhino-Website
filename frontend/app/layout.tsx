import type React from "react"
import type { Metadata } from "next"
import { cairo, geist } from "./fonts"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { themeScript } from "@/lib/theme-script"
import { AppProviders } from "@/providers"
import { MessageCircle } from "lucide-react"

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-78J3VLPBR7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-78J3VLPBR7');
          `}
        </Script>
        <a
          href="https://wa.me/201080075293"
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
