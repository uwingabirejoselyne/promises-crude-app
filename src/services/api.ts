import axios from "axios"
import type { Product, ProductFormData } from "../types/product"
import type { CartResponse, UserCartsResponse } from "../types/cart"

const API_BASE_URL = "https://dummyjson.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

const STORAGE_KEY = "products_cache"
const CACHE_EXPIRY = 5 * 60 * 1000 

interface CachedData {
  products: Product[]
  timestamp: number
}

const saveToCache = (products: Product[]) => {
  const data: CachedData = {
    products,
    timestamp: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const loadFromCache = (): Product[] | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return null

    const data: CachedData = JSON.parse(cached)
    const isExpired = Date.now() - data.timestamp > CACHE_EXPIRY

    if (isExpired) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return data.products
  } catch {
    return null
  }
}

const updateProductInCache = (updatedProduct: Product) => {
  const cached = loadFromCache()
  if (cached) {
    const updated = cached.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    saveToCache(updated)
  }
}

const removeProductFromCache = (productId: number) => {
  const cached = loadFromCache()
  if (cached) {
    const filtered = cached.filter((p) => p.id !== productId)
    saveToCache(filtered)
  }
}

const addProductToCache = (newProduct: Product) => {
  const cached = loadFromCache()
  if (cached) {
    saveToCache([newProduct, ...cached])
  }
}

export const productApi = {
  async getAllProducts(): Promise<Product[]> {
    const cached = loadFromCache()
    if (cached) {
      return cached
    }

    const response = await api.get("/products")
    const products = response.data.products
    saveToCache(products)
    return products
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`)
    return response.data.products
  },

  async addProduct(productData: ProductFormData): Promise<Product> {
    const response = await api.post("/products/add", productData)
    const newProduct = response.data
    addProductToCache(newProduct)
    return newProduct
  },

  async updateProduct(id: number, productData: Partial<ProductFormData>): Promise<Product> {
    const response = await api.put(`/products/${id}`, productData)
    const updatedProduct = response.data
    updateProductInCache(updatedProduct)
    return updatedProduct
  },

  async deleteProduct(id: number): Promise<boolean> {
    await api.delete(`/products/${id}`)
    removeProductFromCache(id)
    return true
  },
}

export const cartApi = {
  async getAllCarts(): Promise<UserCartsResponse> {
    const response = await api.get(`/carts`)
    return response.data
  },

  async getCart(cartId: number): Promise<CartResponse> {
    const response = await api.get(`/carts/${cartId}`)
    return response.data
  },

  async getUserCarts(userId: number): Promise<UserCartsResponse> {
    const response = await api.get(`/carts/user/${userId}`)
    return response.data
  },

  async addToCart(userId: number, products: { id: number; quantity: number }[]): Promise<CartResponse> {
    const response = await api.post(`/carts/add`, {
      userId,
      products,
    })
    return response.data
  },

  async updateCart(cartId: number, products: { id: number; quantity: number }[], merge = true): Promise<CartResponse> {
    const response = await api.put(`/carts/${cartId}`, {
      merge,
      products,
    })
    return response.data
  },

  async deleteCart(cartId: number): Promise<{ isDeleted: boolean; deletedOn: string } | CartResponse> {
    const response = await api.delete(`/carts/${cartId}`)
    return response.data
  },
}
