import axios from "axios"
import type { Product, ProductFormData } from "../types/product"

const API_BASE_URL = "https://dummyjson.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Local storage helpers
const STORAGE_KEY = "products_cache"
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

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
    // Try cache first
    const cached = loadFromCache()
    if (cached) {
      return cached
    }

    // Fetch from API
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
