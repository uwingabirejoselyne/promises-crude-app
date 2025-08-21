export interface Product {
  discountedPrice: number
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

export interface ProductFormData {
  title: string
  description: string
  price: number
  brand: string
  category: string
  stock: number
}
