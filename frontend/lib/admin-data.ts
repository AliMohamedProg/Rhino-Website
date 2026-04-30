// API Base URL
const API_BASE_URL = ((process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "")) + "/api/admin"

// Slider Interface
export interface Slider {
  id: string
  titleAr: string
  titleEn: string
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
      titleAr: item.titleAr ?? item.TitleAr ?? "",
      titleEn: item.titleEn ?? item.TitleEn ?? "",
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
  titleAr: string
  titleEn: string
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
  titleAr: string
  titleEn: string
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

export interface Product {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  price: number
  originalPrice?: number
  discountAmount?: number
  stock: number
  category: string
  categoryId: string
  styleId?: string
  dimensions?: string
  status: "active" | "inactive" | "draft"
  featured: boolean
  onSale: boolean
  images: string[]
  mainImage?: string
  colorsEn?: string
  colorsAr?: string
  materialEn?: string
  materialAr?: string
  sku: string
  createdDate: string
  updatedAt: string
  isSeller?: boolean
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
    nameEn?: string
    nameAr?: string
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
  nameEn: string
  nameAr: string
  slug: string
  descriptionEn?: string
  descriptionAr?: string
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

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "1",
    nameEn: "Modern L-Shaped Sofa",
    nameAr: "كنبة حرف L عصرية",
    descriptionEn: "Elegant L-shaped sofa with premium fabric upholstery",
    descriptionAr: "كنبة حرف L أنيقة بتنجيد قماش فاخر",
    price: 15999,
    originalPrice: 19999,
    stock: 25,
    category: "Living Room",
    categoryId: "1",
    status: "active",
    featured: true,
    onSale: true,
    images: ["/l-shaped-sofa-living-room.jpg"],
    sku: "SOF-001",
    createdDate: "2025-01-15",
    updatedAt: "2025-01-28",
  },
  {
    id: "2",
    nameEn: "King Size Bedroom Set",
    nameAr: "طقم غرفة نوم كينج",
    descriptionEn: "Complete bedroom set with bed, wardrobe, and nightstands",
    descriptionAr: "طقم غرفة نوم كامل يشمل سرير وخزانة وكومودينو",
    price: 45000,
    originalPrice: 52000,
    stock: 12,
    category: "Bedroom",
    categoryId: "2",
    status: "active",
    featured: true,
    onSale: true,
    images: ["/modern-bedroom-furniture-set-front-view.jpg"],
    sku: "BED-001",
    createdDate: "2025-01-10",
    updatedAt: "2025-01-25",
  },
  {
    id: "3",
    nameEn: "Home Office Desk",
    nameAr: "مكتب منزلي",
    descriptionEn: "Spacious home office desk with storage drawers",
    descriptionAr: "مكتب منزلي واسع مع أدراج للتخزين",
    price: 4500,
    stock: 50,
    category: "Office",
    categoryId: "3",
    status: "active",
    featured: false,
    onSale: false,
    images: ["/modern-home-office-desk-wood.jpg"],
    sku: "DSK-001",
    createdDate: "2025-01-08",
    updatedAt: "2025-01-20",
  },
  {
    id: "4",
    nameEn: "Kids Bedroom Furniture Set",
    nameAr: "طقم أثاث غرفة أطفال",
    descriptionEn: "Colorful kids bedroom set with bed and wardrobe",
    descriptionAr: "طقم غرفة نوم أطفال ملون يشمل سرير وخزانة",
    price: 18500,
    originalPrice: 22000,
    stock: 8,
    category: "Kids",
    categoryId: "4",
    status: "active",
    featured: true,
    onSale: true,
    images: ["/kids-bedroom-furniture.jpg"],
    sku: "KID-001",
    createdDate: "2025-01-05",
    updatedAt: "2025-01-22",
  },
  {
    id: "5",
    nameEn: "Modern Wardrobe",
    nameAr: "خزانة ملابس عصرية",
    descriptionEn: "Large modern wardrobe with sliding doors",
    descriptionAr: "خزانة ملابس عصرية كبيرة بأبواب منزلقة",
    price: 12000,
    stock: 15,
    category: "Bedroom",
    categoryId: "2",
    status: "active",
    featured: false,
    onSale: false,
    images: ["/modern-bedroom-wardrobe.jpg"],
    sku: "WRD-001",
    createdDate: "2025-01-03",
    updatedAt: "2025-01-18",
  },
  {
    id: "6",
    nameEn: "Corner Sofa Set",
    nameAr: "طقم كنب زاوية",
    descriptionEn: "Premium corner sofa with Ottoman",
    descriptionAr: "طقم كنب زاوية فاخر مع أوتومان",
    price: 22000,
    originalPrice: 26000,
    stock: 5,
    category: "Living Room",
    categoryId: "1",
    status: "active",
    featured: true,
    onSale: true,
    images: ["/l-shaped-corner-sofa-gray-modern.jpg"],
    sku: "SOF-002",
    createdDate: "2025-01-01",
    updatedAt: "2025-01-15",
  },
]
