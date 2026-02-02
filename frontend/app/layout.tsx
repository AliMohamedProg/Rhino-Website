import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import { LanguageFontWrapper } from "@/components/language-font-wrapper"
import { ThemeProvider } from "@/context/theme-context"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Wood Decor - Your Home, Your Style",
  description: "Shop furniture and home décor online. Transform your living space with quality products.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <LanguageFontWrapper geistClass={_geist.className} cairoClass={_cairo.className}>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </LanguageFontWrapper>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
</body>
    </html>
  )
}
