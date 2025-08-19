export interface CartProduct {
  id: number
  title?: string
  price?: number
  quantity: number
  total?: number
  discountPercentage?: number
  discountedTotal?: number
  thumbnail?: string
}

export interface CartResponse {
  id: number
  userId: number
  products: CartProduct[]
  total: number
  discountedTotal?: number
  totalProducts?: number
  totalQuantity?: number
}

export interface UserCartsResponse {
  carts: CartResponse[]
  total: number
  skip?: number
  limit?: number
}


