export interface Product {
  id: string
  name: string
  description: string
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
  specifications: { key: string; value: string }[]
}

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Bedroom Set with Wardrobe",
    description: "Complete bedroom set including bed, wardrobe, and nightstands. Made from premium quality wood with elegant finish.",
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
      { key: "Material", value: "MDF Wood" },
      { key: "Bed Size", value: "180x200 cm" },
      { key: "Color", value: "White & Gray" },
    ],
  },
]

export const categories = [
  { id: "bedroom", name: "Bedroom", image: "/placeholder.svg?height=200&width=200" },
  { id: "living", name: "Living Room", image: "/placeholder.svg?height=200&width=200" },
  { id: "dining", name: "Dining Room", image: "/placeholder.svg?height=200&width=200" },
  { id: "office", name: "Office", image: "/placeholder.svg?height=200&width=200" },
  { id: "outdoor", name: "Outdoor", image: "/placeholder.svg?height=200&width=200" },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function formatPrice(price: number | string): string {
  if (typeof price === 'string') {
    // Remove commas, currency symbols, and spaces before parsing
    price = price.replace(/[^\d.-]/g, '')
  }
  const n = typeof price === 'string' ? parseFloat(price) : price
  return Math.round(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// Public Slider API
const API_BASE_URL = ((process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "")) + "/api"

export interface PublicSlider {
  id: string
  title: string
  imageUrl: string
  currentState: number
  createdDate: string
}

export interface PublicCategory {
  id: string
  name: string
  imageUrl: string
  productsCount: number
}

export interface PublicProduct {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  discountAmount?: number
  mainImage: string
  images: { imageUrl: string }[]
  categoryId: string
  stockNumber: number
  colors?: string
  material?: string
  currentState: number
  createdDate?: string
}

async function fetchFromApi(endpoint: string) {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    const isServer = typeof window === "undefined";

    if (isServer && url.includes("localhost")) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error(`[fetchFromApi] ${endpoint} failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[fetchFromApi] ${endpoint} error:`, error);
    return null;
  }
}

export async function getPublicSliders(): Promise<PublicSlider[]> {
  const rawData = await fetchFromApi("Slider");
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item: any) => ({
    id: item.id ?? item.Id ?? "",
    title: item.title ?? "",
    imageUrl: item.imageUrl ?? item.ImageUrl ?? "",
    currentState: item.currentState ?? item.CurrentState ?? 0,
    createdDate: item.createdDate ?? item.CreatedDate ?? "",
  })).filter(s => s.currentState > 0);
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const rawData = await fetchFromApi("Category");
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item: any) => ({
    id: item.id ?? item.Id ?? "",
    name: item.name ?? "",
    imageUrl: item.imageUrl ?? item.ImageUrl ?? "",
    productsCount: item.productsCount ?? item.ProductsCount ?? 0,
  }));
}

export async function getPublicStyles(): Promise<PublicCategory[]> {
  const rawData = await fetchFromApi("Styles");
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item: any) => ({
    id: item.id ?? item.Id ?? "",
    name: item.name ?? "",
    imageUrl: item.imageUrl ?? item.ImageUrl ?? "",
    productsCount: item.productsCount ?? item.ProductsCount ?? 0,
  }));
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const rawData = await fetchFromApi("Items");
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item: any) => ({
    id: item.id ?? item.Id ?? "",
    name: item.name ?? "",
    description: item.description ?? "",
    price: item.price ?? item.Price ?? 0,
    oldPrice: item.oldPrice ?? item.OldPrice ?? 0,
    discountAmount: item.discountAmount ?? item.DiscountAmount ?? 0,
    mainImage: item.mainImage ?? item.MainImage ?? "",
    images: item.images ?? item.Images ?? [],
    categoryId: item.categoryId ?? item.CategoryId ?? "",
    stockNumber: item.stockNumber ?? item.StockNumber ?? 0,
    colors: item.colors ?? "",
    material: item.material ?? "",
    currentState: item.currentState ?? item.CurrentState ?? 1,
    createdDate: item.createdDate ?? item.CreatedDate ?? "",
  })).filter(p => p.currentState > 0);
}

export async function getPublicBestSellers(): Promise<PublicProduct[]> {
  const rawData = await fetchFromApi("Items/best-discounts");
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item: any) => ({
    id: item.id ?? item.Id ?? "",
    name: item.name ?? "",
    description: item.description ?? "",
    price: item.price ?? item.Price ?? 0,
    oldPrice: item.oldPrice ?? item.OldPrice ?? 0,
    discountAmount: item.discountAmount ?? item.DiscountAmount ?? 0,
    mainImage: item.mainImage ?? item.MainImage ?? "",
    images: item.images ?? item.Images ?? [],
    categoryId: item.categoryId ?? item.CategoryId ?? "",
    stockNumber: item.stockNumber ?? item.StockNumber ?? 0,
    colors: item.colors ?? "",
    material: item.material ?? "",
    currentState: item.currentState ?? item.CurrentState ?? 1,
    createdDate: item.createdDate ?? item.CreatedDate ?? "",
  })).filter(p => p.currentState > 0);
}
export async function getPublicCollections(): Promise<PublicProduct[]> {
  const rawData = await fetchFromApi("Collections");
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item: any) => ({
    id: item.id ?? item.Id ?? "",
    name: item.name ?? "",
    description: item.description ?? "",
    price: item.price ?? 0,
    oldPrice: item.oldPrice ?? 0,
    discountAmount: item.discountAmount ?? 0,
    mainImage: item.mainImage ?? "",
    images: item.collectionImages ?? [],
    categoryId: item.categoryId ?? "",
    stockNumber: item.stockNumber ?? 0,
    colors: item.colors ?? "",
    material: item.material ?? "",
    currentState: item.currentState ?? 1,
    createdDate: item.createdDate ?? "",
  })).filter(p => p.currentState > 0);
}
