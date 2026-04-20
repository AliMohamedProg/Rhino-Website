"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ApiClient } from "@/app/ApiHelper/ApiClient"

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
      const cart = await ApiClient.get("api/Cart")
      if (cart && cart.items) {
        const mappedItems: CartItem[] = cart.items.map((item: any) => ({
          id: item.id ?? item.Id ?? "",
          itemId: item.itemId ?? item.ItemId ?? "",
          name: { en: item.nameEn ?? item.NameEn ?? "", ar: item.nameAr ?? item.NameAr ?? "" },
          price: item.price ?? item.Price ?? 0,
          image: item.image ?? item.Image ?? "/placeholder.jpg",
          quantity: item.quantity ?? item.Quantity ?? 0,
          total: item.total ?? item.Total ?? 0
        }))
        setItems(mappedItems)
      } else {
        setItems([])
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
    console.log(`[CartContext] Adding item: ${productId}, qty: ${quantity}, color: ${color}`);
    try {
      await ApiClient.post("api/Cart/add-to-cart", {
        request: {
          productId,
          quantity,
          color: color || "Default"
        }
      })
      console.log(`[CartContext] Successfully added item ${productId}`);
      await refreshCart()
    } catch (error: any) {
      console.error("[CartContext] Failed to add item to cart:", error)
      if (error.message === "Unauthorized") {
        alert("Please login to add items to the cart.")
      } else {
        alert("Failed to add item to cart.")
      }
    }
  }


  const removeItem = async (productId: string) => {
    try {
      await ApiClient.delete(`api/Cart/item/delete/${productId}`)
      await refreshCart()
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await ApiClient.patch(`api/Cart/items/${productId}`, {
        request: { quantity }
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
