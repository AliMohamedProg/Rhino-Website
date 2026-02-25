// API Base URL
const API_BASE_URL = "https://localhost:7282/api/admin"

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
    const result = await ApiClient.get("api/admin/Sliders")
    return result || []
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
    const result = await ApiClient.post("api/admin/Sliders/add-slider", sliderData)
    return result
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
    const result = await ApiClient.post("api/admin/Sliders/edit-slider", sliderData)
    return result
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
}

export interface Order {
  id: string
  orderNumber: string
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

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    customer: {
      id: "1",
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+20 100 123 4567",
    },
    items: [
      { productId: "1", productName: "Modern L-Shaped Sofa", quantity: 1, price: 15999 },
      { productId: "3", productName: "Home Office Desk", quantity: 1, price: 4500 },
    ],
    subtotal: 20499,
    shipping: 150,
    tax: 2870,
    discount: 500,
    total: 23019,
    status: "delivered",
    paymentMethod: "Cash on Delivery",
    shippingAddress: {
      street: "123 El-Tahrir Street",
      city: "Cairo",
      state: "Cairo Governorate",
      country: "Egypt",
      postalCode: "11511",
    },
    createdDate: "2025-01-28",
    updatedAt: "2025-01-29",
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    customer: {
      id: "2",
      name: "Fatima Ali",
      email: "fatima@example.com",
      phone: "+20 101 234 5678",
    },
    items: [
      { productId: "2", productName: "King Size Bedroom Set", quantity: 1, price: 45000 },
    ],
    subtotal: 45000,
    shipping: 0,
    tax: 6300,
    discount: 2000,
    total: 49300,
    status: "processing",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "456 Corniche Road",
      city: "Alexandria",
      state: "Alexandria Governorate",
      country: "Egypt",
      postalCode: "21599",
    },
    createdDate: "2025-01-27",
    updatedAt: "2025-01-28",
  },
  {
    id: "3",
    orderNumber: "ORD-2025-003",
    customer: {
      id: "3",
      name: "Mohamed Saeed",
      email: "mohamed@example.com",
      phone: "+20 102 345 6789",
    },
    items: [
      { productId: "4", productName: "Kids Bedroom Furniture Set", quantity: 1, price: 18500 },
    ],
    subtotal: 18500,
    shipping: 200,
    tax: 2590,
    discount: 0,
    total: 21290,
    status: "shipped",
    paymentMethod: "Cash on Delivery",
    shippingAddress: {
      street: "789 Nile View Street",
      city: "Giza",
      state: "Giza Governorate",
      country: "Egypt",
      postalCode: "12655",
    },
    createdDate: "2025-01-26",
    updatedAt: "2025-01-27",
  },
  {
    id: "4",
    orderNumber: "ORD-2025-004",
    customer: {
      id: "4",
      name: "Sara Ahmed",
      email: "sara@example.com",
      phone: "+20 103 456 7890",
    },
    items: [
      { productId: "6", productName: "Corner Sofa Set", quantity: 1, price: 22000 },
    ],
    subtotal: 22000,
    shipping: 0,
    tax: 3080,
    discount: 1000,
    total: 24080,
    status: "pending",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "321 Garden City",
      city: "Cairo",
      state: "Cairo Governorate",
      country: "Egypt",
      postalCode: "11519",
    },
    createdDate: "2025-01-25",
    updatedAt: "2025-01-25",
  },
  {
    id: "5",
    orderNumber: "ORD-2025-005",
    customer: {
      id: "5",
      name: "Khaled Ibrahim",
      email: "khaled@example.com",
      phone: "+20 104 567 8901",
    },
    items: [
      { productId: "5", productName: "Modern Wardrobe", quantity: 2, price: 12000 },
    ],
    subtotal: 24000,
    shipping: 300,
    tax: 3360,
    discount: 500,
    total: 27160,
    status: "cancelled",
    paymentMethod: "Cash on Delivery",
    shippingAddress: {
      street: "555 Maadi Street",
      city: "Cairo",
      state: "Cairo Governorate",
      country: "Egypt",
      postalCode: "11728",
    },
    createdDate: "2025-01-24",
    updatedAt: "2025-01-26",
  },
]

// Mock Users
export const adminUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    phone: "+20 100 123 4567",
    role: "customer",
    status: "active",
    totalOrders: 5,
    totalSpent: 85000,
    lastLogin: "2025-01-29",
    joinDate: "2024-06-15",
  },
  {
    id: "2",
    name: "Fatima Ali",
    email: "fatima@example.com",
    phone: "+20 101 234 5678",
    role: "customer",
    status: "active",
    totalOrders: 3,
    totalSpent: 65000,
    lastLogin: "2025-01-28",
    joinDate: "2024-08-20",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@wooddecor.com",
    phone: "+20 102 000 0000",
    role: "admin",
    status: "active",
    totalOrders: 0,
    totalSpent: 0,
    lastLogin: "2025-01-29",
    joinDate: "2024-01-01",
  },
  {
    id: "4",
    name: "Sara Ahmed",
    email: "sara@example.com",
    phone: "+20 103 456 7890",
    role: "customer",
    status: "active",
    totalOrders: 8,
    totalSpent: 120000,
    lastLogin: "2025-01-27",
    joinDate: "2024-03-10",
  },
  {
    id: "5",
    name: "Manager Ali",
    email: "manager@wooddecor.com",
    phone: "+20 104 111 1111",
    role: "manager",
    status: "active",
    totalOrders: 0,
    totalSpent: 0,
    lastLogin: "2025-01-29",
    joinDate: "2024-02-15",
  },
  {
    id: "6",
    name: "Khaled Ibrahim",
    email: "khaled@example.com",
    phone: "+20 104 567 8901",
    role: "customer",
    status: "blocked",
    totalOrders: 2,
    totalSpent: 15000,
    lastLogin: "2025-01-20",
    joinDate: "2024-09-05",
  },
]

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    nameEn: "Living Room",
    nameAr: "غرفة المعيشة",
    slug: "living-room",
    descriptionEn: "Sofas, chairs, and living room furniture",
    descriptionAr: "كنب وكراسي وأثاث غرفة المعيشة",
    productsCount: 45,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2670&auto=format&fit=crop",
    createdDate: "2024-01-01",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    nameEn: "Bedroom",
    nameAr: "غرفة النوم",
    slug: "bedroom",
    descriptionEn: "Beds, wardrobes, and bedroom furniture",
    descriptionAr: "أسرة وخزائن وأثاث غرفة النوم",
    productsCount: 38,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=2670&auto=format&fit=crop",
    createdDate: "2024-01-01",
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    nameEn: "Office",
    nameAr: "المكتب",
    slug: "office",
    descriptionEn: "Desks, chairs, and office furniture",
    descriptionAr: "مكاتب وكراسي وأثاث المكتب",
    productsCount: 25,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop",
    createdDate: "2024-01-01",
  },
  {
    id: "4",
    nameEn: "Kids",
    nameAr: "الأطفال",
    slug: "kids",
    descriptionEn: "Kids bedroom and playroom furniture",
    descriptionAr: "أثاث غرف نوم الأطفال وغرف اللعب",
    productsCount: 20,
    status: "active",
    createdDate: "2024-01-15",
  },
  {
    id: "5",
    nameEn: "Dining Room",
    nameAr: "غرفة الطعام",
    slug: "dining-room",
    descriptionEn: "Dining tables, chairs, and dining sets",
    descriptionAr: "طاولات طعام وكراسي وأطقم سفرة",
    productsCount: 15,
    status: "active",
    createdDate: "2024-02-01",
  },
  {
    id: "6",
    nameEn: "Outdoor",
    nameAr: "الحديقة",
    slug: "outdoor",
    descriptionEn: "Garden and outdoor furniture",
    descriptionAr: "أثاث الحدائق والأماكن الخارجية",
    productsCount: 12,
    status: "inactive",
    createdDate: "2024-03-01",
  },
]

// Aliases for backward compatibility
export const mockUsers = adminUsers
