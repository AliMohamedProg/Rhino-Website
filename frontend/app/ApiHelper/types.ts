export interface LoginDto {
  email?: string | null;
  password?: string | null;
}

export interface RegisterDto {
  fullName?: string | null;
  email?: string | null;
  password?: string | null;
  phoneNumber?: string | null;
}

export interface CategoryDto {
  id?: string;
  nameAr?: string | null;
  nameEn?: string | null;
  imageUrl?: string | null;
}

export interface ProductDto {
  id?: string;
  nameAr?: string | null;
  nameEn?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  price?: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string | null;
  images?: string[] | null;
  categoryId?: string;
  inStock?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewsCount?: number;
  specifications?: SpecificationDto[] | null;
}

export interface SpecificationDto {
  keyAr?: string | null;
  keyEn?: string | null;
  valueAr?: string | null;
  valueEn?: string | null;
}

export interface OrderDto {
  id?: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  address?: string | null;
  totalAmount?: number;
  status?: string | null;
  items?: OrderItemDto[] | null;
  createdDate?: string;
}

export interface OrderItemDto {
  productId?: string;
  productName?: string | null;
  quantity?: number;
  price?: number;
}

export interface SliderDto {
  id?: string;
  titleAr?: string | null;
  titleEn?: string | null;
  imageUrl?: string | null;
  currentState?: number;
}

export interface UserMeDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
}
