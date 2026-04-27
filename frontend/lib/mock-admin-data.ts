
export interface Category {
  id: string
  nameEn: string
  nameAr: string
  imageUrl?: string
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", nameEn: "Living Room", nameAr: "غرف المعيشة", imageUrl: "/art-living-1.png" },
  { id: "cat-2", nameEn: "Bedroom", nameAr: "غرف النوم", imageUrl: "/art-living-3.png" },
  { id: "cat-3", nameEn: "Dining Room", nameAr: "غرف الطعام", imageUrl: "/art-living-2.png" },
  { id: "cat-4", nameEn: "Office", nameAr: "المكتب", imageUrl: "/art-living-3.png" },
  { id: "cat-5", nameEn: "Outdoor", nameAr: "الأثاث الخارجي", imageUrl: "/green-sofa.png" },
]

export interface Brand {
  id: string
  name: string
  logo: string
  description: string
  categories: string[]
}

export const MOCK_BRANDS: Brand[] = [
  {
    id: "brand-1",
    name: "Rhino Design",
    logo: "/rhino-logo.png",
    description: "Premium handcrafted furniture with a focus on sustainable materials and timeless design.",
    categories: ["Living Room", "Bedroom"]
  },
  {
    id: "brand-2",
    name: "Lignum",
    logo: "/lignum-logo.png",
    description: "Contemporary wooden furniture that blends traditional craftsmanship with modern aesthetics.",
    categories: ["Dining Room", "Office"]
  }
]
