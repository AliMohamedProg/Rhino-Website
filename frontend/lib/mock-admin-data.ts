
export interface Category {
  id: string
  name: string
  imageUrl?: string
}


export interface Alliance {
  id: string
  name: string
  logo: string
  description: string
  categories: string[]
}

