// API Base URL
const API_BASE_URL = ((process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")) + "/api/admin"

// Slider Interface
export interface Slider {
  id: string
  title: string
  imageUrl: string
  currentState: number
  createdDate: string
}

import { ApiClient } from "@/app/ApiHelper/ApiClient"

// Slider API Functions
export async function getSliders(): Promise<Slider[]> {
  try {
    const rawData = await ApiClient.get("api/admin/Sliders")
    if (!Array.isArray(rawData)) return []

    // Normalize property names (handle both camelCase and PascalCase)
    return rawData.map((item: any) => ({
      id: item.id ?? item.Id ?? "",
      title: item.title ?? item.Title ?? "",
      imageUrl: item.imageUrl ?? item.ImageUrl ?? "",
      currentState: item.currentState ?? item.CurrentState ?? 0,
      createdDate: item.createdDate ?? item.CreatedDate ?? "",
    }))
  } catch (error) {
    console.error("Error fetching sliders:", error)
    return []
  }
}

export async function addSlider(sliderData: {
  title: string
  imageUrl: string
}): Promise<Slider | null> {
  try {
    const result = await ApiClient.post<Slider>("api/admin/Sliders/add-slider", sliderData)
    return result as Slider
  } catch (error) {
    console.error("Error adding slider:", error)
    return null
  }
}

export async function editSlider(sliderData: {
  id: string
  title: string
  imageUrl: string
}): Promise<Slider | null> {
  try {
    const result = await ApiClient.post<Slider>("api/admin/Sliders/edit-slider", sliderData)
    return result as Slider
  } catch (error) {
    console.error("Error editing slider:", error)
    return null
  }
}

export async function deleteSlider(sliderId: string): Promise<boolean> {
  try {
    await ApiClient.post(`api/admin/Sliders/delete-slider/${sliderId}`, {})
    return true
  } catch (error) {
    console.error("Error deleting slider:", error)
    return false
  }
}

// Mock data for admin panel - will be replaced with API calls later

export interface Fabric {
  id: string
  name: string
  imageUrl: string
  productId?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discountAmount?: number
  stock: number
  category: string
  categoryId: string
  typeId?: string
  styleId?: string
  dimensions?: string
  status: "active" | "inactive" | "draft"
  featured: boolean
  onSale: boolean
  images: string[]
  mainImage?: string
  colors?: string
  material?: string
  sku: string
  createdDate: string
  updatedAt: string
  isSeller?: boolean
  fabrics?: Fabric[]
}

export interface Order {
  id: string
  orderNumber: string
  paymentMethodName: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    image?: string
  }[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  createdDate: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "manager" | "customer"
  status: "active" | "inactive" | "blocked"
  avatar?: string
  totalOrders: number
  totalSpent: number
  lastLogin: string
  joinDate: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  imageUrl?: string
  productsCount: number
  status: "active" | "inactive"
  createdDate: string
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenueGrowth: number
  ordersGrowth: number
  productsGrowth: number
  usersGrowth: number
}

export interface ChartData {
  name: string
  value: number
  value2?: number
}


