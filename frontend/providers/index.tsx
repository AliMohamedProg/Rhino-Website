"use client"

import type { ReactNode } from "react"
import { LanguageProvider } from "@/context/language-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/app/Context/auth-context"
import AuthWrapper from "@/components/auth-wrapper"
import { Toaster } from "@/components/ui/sonner"

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Single composition of all app-level providers.
 * Includes multi-language support (English/Arabic).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <AuthWrapper>
              {children}
              <Toaster richColors position="top-center" />
            </AuthWrapper>
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </LanguageProvider>
  )
}

