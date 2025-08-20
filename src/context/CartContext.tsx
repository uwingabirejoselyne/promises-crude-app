// context/CartContext.tsx with localStorage persistence
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { CartResponse } from "../types/cart"
import { cartApi } from "../services/api"
import { useAuth } from "./AuthContext"

interface CartContextValue {
  cart: CartResponse | null
  loading: boolean
  refresh: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getAllUserCarts: () => CartResponse[]
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

// Helper functions for localStorage
const CARTS_STORAGE_KEY = "user_carts"

const saveCartsToStorage = (carts: CartResponse[]) => {
  try {
    localStorage.setItem(CARTS_STORAGE_KEY, JSON.stringify(carts))
  } catch (e) {
    console.error("Failed to save carts to localStorage:", e)
  }
}

const loadCartsFromStorage = (): CartResponse[] => {
  try {
    const stored = localStorage.getItem(CARTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error("Failed to load carts from localStorage:", e)
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const rawUserId = user?.id ?? null
  const userId = rawUserId ? (((rawUserId % 30) || 30)) : null
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(false)

  // Load user's cart from localStorage or API
  const refresh = useCallback(async () => {
    if (!userId) {
      setCart(null)
      return
    }
    
    setLoading(true)
    try {
      // First check localStorage for user's carts
      const localCarts = loadCartsFromStorage()
      const userLocalCart = localCarts.find(c => c.userId === userId)
      
      if (userLocalCart) {
        setCart(userLocalCart)
        console.log("Loaded cart from localStorage:", userLocalCart.id)
      } else {
        // Fallback to API if no local cart exists
        const userCarts = await cartApi.getUserCarts(userId)
        const list = userCarts.carts || []
        const latest = list.length ? [...list].sort((a, b) => b.id - a.id)[0] : null
        setCart(latest)
        
        // Save API cart to localStorage for future use
        if (latest) {
          const allCarts = loadCartsFromStorage()
          const updatedCarts = [...allCarts.filter(c => c.userId !== userId), latest]
          saveCartsToStorage(updatedCarts)
        }
      }
    } catch (e) {
      console.error("Error refreshing cart:", e)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // Save cart changes to localStorage
  const saveCartToStorage = useCallback((updatedCart: CartResponse) => {
    const allCarts = loadCartsFromStorage()
    const otherCarts = allCarts.filter(c => c.id !== updatedCart.id)
    const updatedCarts = [...otherCarts, updatedCart]
    saveCartsToStorage(updatedCarts)
  }, [])

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      if (!userId) {
        alert("Please log in to add items to cart")
        return
      }
      
      setLoading(true)
      try {
        let updatedCart: CartResponse

        if (cart) {
          // Update existing cart
          const existingItem = cart.products.find(p => p.id === productId)
          
          if (existingItem) {
            // Update quantity of existing item
            const updatedProducts = cart.products.map(p => 
              p.id === productId 
                ? { 
                    ...p, 
                    quantity: p.quantity + quantity,
                    total: (p.price || 0) * (p.quantity + quantity)
                  }
                : p
            )
            
            updatedCart = {
              ...cart,
              products: updatedProducts,
              total: updatedProducts.reduce((sum, p) => sum + (p.total || 0), 0),
              totalProducts: updatedProducts.length,
              totalQuantity: updatedProducts.reduce((sum, p) => sum + p.quantity, 0)
            }
          } else {
            // Add new item to existing cart
            const newProduct = {
              id: productId,
              quantity,
              title: `Product ${productId}`,
              price: 10, // Default price - you'd get this from your product data
              total: 10 * quantity,
              thumbnail: "/placeholder.svg"
            }
            
            updatedCart = {
              ...cart,
              products: [...cart.products, newProduct],
              total: cart.total + newProduct.total,
              totalProducts: cart.products.length + 1,
              totalQuantity: (cart.totalQuantity ?? 0) + quantity
            }
          }
        } else {
          // Create new cart
          const newProduct = {
            id: productId,
            quantity,
            title: `Product ${productId}`,
            price: 10,
            total: 10 * quantity,
            thumbnail: "/placeholder.svg"
          }
          
          updatedCart = {
            id: Date.now(), // Simple ID generation
            userId: userId,
            products: [newProduct],
            total: newProduct.total,
            totalProducts: 1,
            totalQuantity: quantity
          }
        }
        
        setCart(updatedCart)
        saveCartToStorage(updatedCart)
        
        alert(`Successfully added ${quantity} item(s) to cart!`)
        
      } catch (e) {
        console.error("Error adding item to cart:", e)
        alert("Failed to add item to cart. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [userId, cart, saveCartToStorage]
  )

  const removeItem = useCallback(
    async (productId: number) => {
      if (!cart || !userId) return
      
      setLoading(true)
      try {
        const updatedProducts = cart.products.filter(p => p.id !== productId)
        const updatedCart = {
          ...cart,
          products: updatedProducts,
          total: updatedProducts.reduce((sum, p) => sum + (p.total || 0), 0),
          totalProducts: updatedProducts.length,
          totalQuantity: updatedProducts.reduce((sum, p) => sum + p.quantity, 0)
        }
        
        setCart(updatedCart)
        saveCartToStorage(updatedCart)
        
        console.log(`Removed product ${productId} from cart`)
      } catch (e) {
        console.error("Error removing item from cart:", e)
      } finally {
        setLoading(false)
      }
    },
    [cart, userId, saveCartToStorage]
  )

  const updateItemQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!cart || !userId || quantity < 1) return
      
      setLoading(true)
      try {
        const updatedProducts = cart.products.map(p => 
          p.id === productId 
            ? { 
                ...p, 
                quantity, 
                total: (p.price || 0) * quantity
              }
            : p
        )
        
        const updatedCart = {
          ...cart,
          products: updatedProducts,
          total: updatedProducts.reduce((sum, p) => sum + (p.total || 0), 0),
          totalQuantity: updatedProducts.reduce((sum, p) => sum + p.quantity, 0)
        }
        
        setCart(updatedCart)
        saveCartToStorage(updatedCart)
        
      } catch (e) {
        console.error("Error updating item quantity:", e)
      } finally {
        setLoading(false)
      }
    },
    [cart, userId, saveCartToStorage]
  )

  const clearCart = useCallback(async () => {
    if (!cart) return
    
    setLoading(true)
    try {
      // Remove from localStorage
      const allCarts = loadCartsFromStorage()
      const updatedCarts = allCarts.filter(c => c.id !== cart.id)
      saveCartsToStorage(updatedCarts)
      
      setCart(null)
      alert("Cart cleared successfully!")
    } catch (e) {
      console.error("Error clearing cart:", e)
    } finally {
      setLoading(false)
    }
  }, [cart])

  // New function to get all user carts for AllCarts page
  const getAllUserCarts = useCallback(() => {
    return loadCartsFromStorage()
  }, [])

  const value = useMemo(
    () => ({ 
      cart, 
      loading, 
      refresh, 
      addItem, 
      removeItem,
      updateItemQuantity,
      clearCart,
      getAllUserCarts
    }),
    [cart, loading, refresh, addItem, removeItem, updateItemQuantity, clearCart, getAllUserCarts]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}