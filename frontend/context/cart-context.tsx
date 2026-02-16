"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  itemId: string
  name: { en: string; ar: string }
  price: number
  originalPrice?: number
  image: string
  quantity: number
  total: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity: number, color?: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => void
  total: number
  itemCount: number
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshCart = async () => {
    try {
      const res = await fetch("https://localhost:7282/api/Cart", {
        credentials: "include"
      })

      if (res.ok) {
        const cart = await res.json()
        if (cart && cart.items) {
          const mappedItems: CartItem[] = cart.items.map((item: any) => ({
            id: item.id,
            itemId: item.itemId,
            name: { en: item.nameEn, ar: item.nameAr },
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            total: item.total
          }))
          setItems(mappedItems)
        } else {
          setItems([])
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addItem = async (productId: string, quantity: number, color?: string) => {
    try {
      const res = await fetch("https://localhost:7282/api/Cart/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity, color: color || "Default" })
      })

      if (res.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  }

  const removeItem = async (productId: string) => {
    try {
      await fetch(`https://localhost:7282/api/Cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: 0 })
      })
      await refreshCart()
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await fetch(`https://localhost:7282/api/Cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity })
      })
      await refreshCart()
    } catch (error) {
      console.error("Failed to update cart item:", error)
    }
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isLoading, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
