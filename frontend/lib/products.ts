export interface Product {
  id: string
  name: { en: string; ar: string }
  description: { en: string; ar: string }
  price: number
  originalPrice?: number
  discount?: number
  image: string
  images: string[]
  category: string
  inStock: boolean
  isNew?: boolean
  rating: number
  reviews: number
  specifications: { key: string; value: { en: string; ar: string } }[]
}

export const products: Product[] = [
  {
    id: "1",
    name: {
      en: "Modern Bedroom Set with Wardrobe",
      ar: "طقم غرفة نوم حديثة مع دولاب",
    },
    description: {
      en: "Complete bedroom set including bed, wardrobe, and nightstands. Made from premium quality wood with elegant finish.",
      ar: "طقم غرفة نوم كامل يشمل السرير والدولاب والكومودينو. مصنوع من خشب عالي الجودة بتشطيب أنيق.",
    },
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    image: "/modern-bedroom-set.png",
    images: ["/modern-bedroom-furniture-set-front-view.jpg", "/modern-bedroom-wardrobe.jpg", "/modern-bedroom-nightstand.jpg"],
    category: "bedroom",
    inStock: true,
    isNew: false,
    rating: 4.5,
    reviews: 128,
    specifications: [
      { key: "Material", value: { en: "MDF Wood", ar: "خشب MDF" } },
      { key: "Bed Size", value: { en: "180x200 cm", ar: "180×200 سم" } },
      { key: "Color", value: { en: "White & Gray", ar: "أبيض ورمادي" } },
    ],
  },
  {
    id: "2",
    name: {
      en: "Kids Wardrobe with Desk Combo",
      ar: "دولاب أطفال مع مكتب",
    },
    description: {
      en: "Space-saving kids furniture set with wardrobe and integrated study desk. Perfect for small rooms.",
      ar: "طقم أثاث أطفال موفر للمساحة مع دولاب ومكتب دراسة مدمج. مثالي للغرف الصغيرة.",
    },
    price: 4535,
    originalPrice: 5999,
    discount: 24,
    image: "/kids-wardrobe-with-desk-colorful.jpg",
    images: ["/kids-wardrobe-colorful.jpg", "/kids-study-desk.jpg", "/kids-bedroom-furniture.jpg"],
    category: "bedroom",
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: 56,
    specifications: [
      { key: "Material", value: { en: "Laminated Particle Board", ar: "خشب حبيبي مغلف" } },
      { key: "Dimensions", value: { en: "120x180x50 cm", ar: "120×180×50 سم" } },
      { key: "Color", value: { en: "Multi-color", ar: "متعدد الألوان" } },
    ],
  },
  {
    id: "3",
    name: {
      en: "L-Shaped Corner Sofa Set",
      ar: "طقم كنب ركنة على شكل L",
    },
    description: {
      en: "Comfortable L-shaped corner sofa with premium fabric upholstery. Perfect for modern living rooms.",
      ar: "كنبة ركنة مريحة على شكل L مع تنجيد قماش فاخر. مثالية لغرف المعيشة الحديثة.",
    },
    price: 27700,
    originalPrice: 35000,
    discount: 21,
    image: "/l-shaped-corner-sofa-gray-modern.jpg",
    images: ["/l-shaped-sofa-living-room.jpg", "/modern-corner-sofa-detail.jpg", "/gray-sofa-cushions.jpg"],
    category: "living",
    inStock: true,
    isNew: false,
    rating: 4.7,
    reviews: 89,
    specifications: [
      { key: "Material", value: { en: "Premium Fabric", ar: "قماش فاخر" } },
      { key: "Dimensions", value: { en: "300x200x85 cm", ar: "300×200×85 سم" } },
      { key: "Seating", value: { en: "6-7 persons", ar: "6-7 أشخاص" } },
    ],
  },
  {
    id: "4",
    name: {
      en: "Premium Home Office Desk",
      ar: "مكتب منزلي فاخر",
    },
    description: {
      en: "Ergonomic home office desk with cable management and ample storage space.",
      ar: "مكتب منزلي مريح مع إدارة الكابلات ومساحة تخزين واسعة.",
    },
    price: 5388,
    originalPrice: 6999,
    discount: 23,
    image: "/modern-home-office-desk-wood.jpg",
    images: ["/home-office-desk-setup.jpg", "/office-desk-with-drawers.jpg", "/wooden-desk-detail.jpg"],
    category: "office",
    inStock: true,
    isNew: false,
    rating: 4.6,
    reviews: 45,
    specifications: [
      { key: "Material", value: { en: "Solid Wood", ar: "خشب صلب" } },
      { key: "Dimensions", value: { en: "140x70x75 cm", ar: "140×70×75 سم" } },
      { key: "Drawers", value: { en: "3 Drawers", ar: "3 أدراج" } },
    ],
  },
  {
    id: "5",
    name: {
      en: "Elegant Dining Table Set",
      ar: "طقم سفرة أنيق",
    },
    description: {
      en: "6-seater dining table set with elegant design and durable construction.",
      ar: "طقم سفرة 6 مقاعد بتصميم أنيق وبناء متين.",
    },
    price: 19999,
    originalPrice: 25999,
    discount: 23,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "dining",
    inStock: true,
    isNew: true,
    rating: 4.4,
    reviews: 67,
    specifications: [
      { key: "Material", value: { en: "Beech Wood", ar: "خشب زان" } },
      { key: "Table Size", value: { en: "180x90 cm", ar: "180×90 سم" } },
      { key: "Chairs", value: { en: "6 Chairs", ar: "6 كراسي" } },
    ],
  },
  {
    id: "6",
    name: {
      en: "Outdoor Garden Furniture Set",
      ar: "طقم أثاث حديقة خارجي",
    },
    description: {
      en: "Weather-resistant outdoor furniture set perfect for patios and gardens.",
      ar: "طقم أثاث خارجي مقاوم للعوامل الجوية مثالي للفناء والحدائق.",
    },
    price: 12999,
    originalPrice: 16999,
    discount: 24,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "outdoor",
    inStock: true,
    isNew: false,
    rating: 4.3,
    reviews: 34,
    specifications: [
      { key: "Material", value: { en: "Rattan & Aluminum", ar: "روطان وألمنيوم" } },
      { key: "Set Includes", value: { en: "Sofa, 2 Chairs, Table", ar: "كنبة، 2 كرسي، طاولة" } },
      { key: "Cushions", value: { en: "Included", ar: "مشمول" } },
    ],
  },
]

export const categories = [
  { id: "bedroom", name: { en: "Bedroom", ar: "غرف النوم" }, image: "/placeholder.svg?height=200&width=200" },
  { id: "living", name: { en: "Living Room", ar: "غرف المعيشة" }, image: "/placeholder.svg?height=200&width=200" },
  { id: "dining", name: { en: "Dining Room", ar: "غرف الطعام" }, image: "/placeholder.svg?height=200&width=200" },
  { id: "office", name: { en: "Office", ar: "المكتب" }, image: "/placeholder.svg?height=200&width=200" },
  { id: "outdoor", name: { en: "Outdoor", ar: "الأثاث الخارجي" }, image: "/placeholder.svg?height=200&width=200" },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function formatPrice(price: number): string {
  return price.toLocaleString()
}
