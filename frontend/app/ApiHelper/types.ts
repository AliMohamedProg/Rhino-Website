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
  name?: string | null;
  imageUrl?: string | null;
}

export interface ProductDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  name?: string | null;
  description?: string | null;
  price?: number;
  oldPrice?: number;
  discountAmount?: number;
  originalPrice?: number;
  discount?: number;
  mainImage?: string | null;
  imageUrl?: string | null;
  images?: any[] | null;
  categoryId?: string;
  typeId?: string;
  styleId?: string;
  dimensions?: string | null;
  sku?: string | null;
  overallRating?: number;
  stockNumber?: number;
  colors?: string | null;
  material?: string | null;
  inStock?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewsCount?: number;
  specifications?: SpecificationDto[] | null;
  fabrics?: FabricDto[] | null;
}

export interface SpecificationDto {
  key?: string | null;
  value?: string | null;
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
  title?: string | null;
  imageUrl?: string | null;
  currentState?: number;
}

export interface UserMeDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface FabricDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  name?: string | null;
  imageUrl?: string | null;
  productId?: string;
}

export interface CollectionDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  mainImage?: string | null;
  name?: string | null;
  fabricId?: string | null;
  description?: string | null;
  oldPrice?: number;
  price?: number;
  styleId?: string | null;
  dimensions?: string | null;
  sku?: string | null;
  discountAmount?: number;
  itemsCount?: number;
  categoryId?: string | null;
  overallRating?: number;
  stockNumber?: number;
  colors?: string | null;
  material?: string | null;
  collectionImages?: CollectionImageDto[] | null;
  items?: ProductDto[] | null;
  collectionFabrics?: CollectionFabricDto[] | null;
  collectionItems?: CollectionItemDto[] | null;
  changes?: ChangeDto[] | null;
}

export interface ChangeDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  changeName?: string;
  newDimensions?: string;
  newSKU?: string;
  overPrice?: number;
  newName?: string;
  newDescription?: string;
  collectionId?: string;
  changeImages?: ChangeImageDto[] | null;
}

export interface ChangeImageDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  imageUrl?: string | null;
  changeId?: string | null;
  changes?: any;
}

export interface CollectionImageDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  imageUrl?: string | null;
  productId?: string | null;
}

export interface CollectionFabricDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  name?: string | null;
  imageUrl?: string | null;
  collectionId?: string | null;
}

export interface CollectionItemDto {
  itemId?: string;
  collectionId?: string;
  item?: ProductDto;
}

export interface TypeDto {
  id?: string;
  currentState?: number;
  createdDate?: string;
  name?: string | null;
}
