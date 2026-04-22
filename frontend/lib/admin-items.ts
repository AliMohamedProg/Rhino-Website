import type { Product } from "@/lib/admin-data"

export interface AdminImageDto {
  imageUrl: string
  productId?: string
}

export interface AdminItemDto {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  price: number
  oldPrice?: number | null
  discountAmount?: number | null
  categoryId: string
  stockNumber: number
  mainImage?: string | null
  images?: AdminImageDto[]
  currentState?: number
  colors?: string | null
  colorsEn?: string | null
  colorsAr?: string | null
  material?: string | null
  materialEn?: string | null
  materialAr?: string | null
  createdDate?: string | null
  isSeller?: boolean
}

export interface AdminCategoryDto {
  id: string
  nameEn: string
  nameAr: string
  imageUrl?: string | null
}

const unique = (values: string[]) => Array.from(new Set(values))

export const buildImageList = (
  mainImage?: string | null,
  imageUrls?: Array<string | null | undefined>
) => {
  const list = [mainImage ?? "", ...(imageUrls ?? [])]
    .map((value) => (value ?? "").trim())
    .filter((value) => value.length > 0)
  return unique(list)
}

export const mapAdminItemToProduct = (
  item: AdminItemDto,
  categories?: AdminCategoryDto[]
): Product => {
  const discount = item.discountAmount ?? 0
  const hasBackendOldPrice = item.oldPrice != null && item.oldPrice > item.price
  
  const salePrice = item.price
  const originalPriceVal = hasBackendOldPrice 
    ? item.oldPrice 
    : (discount > 0 && item.price > 0 ? Math.round(item.price / (1 - discount / 100)) : undefined)

  const imageUrls = buildImageList(
    item.mainImage,
    item.images?.map((img) => img.imageUrl) ?? []
  )
  const category = categories?.find((cat) => cat.id === item.categoryId)

  return {
    id: item.id,
    nameEn: item.nameEn ?? "",
    nameAr: item.nameAr ?? "",
    descriptionEn: item.descriptionEn ?? "",
    descriptionAr: item.descriptionAr ?? "",
    price: salePrice,
    originalPrice: originalPriceVal ?? undefined,
    stock: item.stockNumber ?? 0,
    category: category ? category.nameEn : item.categoryId ?? "",
    categoryId: item.categoryId ?? "",
    status: item.currentState && item.currentState > 0 ? "active" : "inactive",
    featured: false,
    onSale: discount > 0,
    images: imageUrls,
    colorsEn: item.colorsEn ?? item.colors ?? "",
    colorsAr: item.colorsAr ?? "",
    materialEn: item.materialEn ?? item.material ?? "",
    materialAr: item.materialAr ?? "",
    sku: "",
    createdDate: item.createdDate ?? new Date().toISOString(),
    updatedAt: item.createdDate ?? new Date().toISOString(),
    mainImage: item.mainImage ?? imageUrls[0] ?? "",
    discountAmount: discount,
    isSeller: item.isSeller ?? false,
  }
}
