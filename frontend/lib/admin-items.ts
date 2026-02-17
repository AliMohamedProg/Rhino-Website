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
  discountAmount?: number | null
  categoryId: string
  stockNumber: number
  mainImage?: string | null
  images?: AdminImageDto[]
  currentState?: number
  colors?: string | null
  createdDate?: string | null
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
  const salePrice = discount > 0 ? Math.round(item.price * (1 - discount / 100)) : item.price
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
    originalPrice: discount > 0 ? item.price : undefined,
    stock: item.stockNumber ?? 0,
    category: category ? category.nameEn : item.categoryId ?? "",
    categoryId: item.categoryId ?? "",
    status: item.currentState && item.currentState > 0 ? "active" : "inactive",
    featured: false,
    onSale: discount > 0,
    images: imageUrls,
    colors: item.colors ?? "",
    sku: "",
    createdDate: item.createdDate ?? new Date().toISOString(),
    updatedAt: item.createdDate ?? new Date().toISOString(),
    mainImage: item.mainImage ?? imageUrls[0] ?? "",
    discountAmount: discount,
  }
}
