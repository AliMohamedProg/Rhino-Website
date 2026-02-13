"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/context/theme-context"
import { LanguageProvider } from "@/context/language-context"
import { LanguageFontWrapper } from "@/components/language-font-wrapper"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { AuthProvider } from "@/app/Context/auth-context"
import AuthWrapper from "@/components/auth-wrapper"

/** Font class names passed from root layout (server). */
interface AppProvidersProps {
  children: ReactNode
  geistClass?: string
  cairoClass?: string
}

/**
 * Single composition of all app-level providers.
 * Keeps layout.tsx minimal and centralizes provider order.
 */
export function AppProviders({ children, geistClass = "", cairoClass = "" }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LanguageFontWrapper geistClass={geistClass} cairoClass={cairoClass}>
          <CartProvider>
            <WishlistProvider>
              <AuthProvider>
                <AuthWrapper>{children}</AuthWrapper>
              </AuthProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageFontWrapper>
      </LanguageProvider>
    </ThemeProvider>
  )
}
