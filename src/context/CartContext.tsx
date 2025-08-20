import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { CartResponse } from "../types/cart"
import { cartApi } from "../services/api"
import { useAuth } from "./AuthContext"

interface CartContextValue {
  cart: CartResponse | null
  loading: boolean
  refresh: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!userId) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const userCarts = await cartApi.getUserCarts(userId)
      setCart(userCarts.carts?.[0] ?? null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      if (!userId) return
      await cartApi.addToCart(userId, [{ id: productId, quantity }])
      await refresh()
    },
    [userId, refresh],
  )

  const clearCart = useCallback(async () => {
    if (!cart) return
    await cartApi.deleteCart(cart.id)
    await refresh()
  }, [cart, refresh])

  const value = useMemo(
    () => ({ cart, loading, refresh, addItem, clearCart }),
    [cart, loading, refresh, addItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}


