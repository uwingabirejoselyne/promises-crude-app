import { useEffect, useState } from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { cartApi } from "../services/api"
import type { CartProduct, CartResponse } from "../types/cart"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  userId: number | null
}

export function CartDrawer({ open, onClose, userId }: CartDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<CartResponse | null>(null)

  useEffect(() => {
    if (!open || !userId) return
    void loadCart(userId)
  }, [open, userId])

  const loadCart = async (uid: number) => {
    setLoading(true)
    try {
      const userCarts = await cartApi.getUserCarts(uid)
      const latest = userCarts.carts?.[0] || null
      setCart(latest)
    } catch (e) {
      console.error(e)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCart = async () => {
    if (!cart) return
    try {
      await cartApi.deleteCart(cart.id)
      setCart(null)
    } catch (e) {
      console.error(e)
    }
  }

  const totalAmount = cart?.total ?? 0

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] transform bg-background/80 backdrop-blur-xl p-4 shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Your Cart {userId ? `(User ${userId})` : ""}</div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!userId && (
          <div className="text-sm text-muted-foreground mb-4">Login with a user id to view the cart.</div>
        )}

        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : !cart ? (
          <div className="text-sm text-muted-foreground">No cart found.</div>
        ) : (
          <div className="space-y-3">
            {cart.products.map((p: CartProduct) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="text-base">{p.title ?? `Product #${p.id}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail || "/placeholder.svg?height=60&width=60"}
                      alt={p.title ?? "product"}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm">Qty: {p.quantity}</div>
                      <div className="text-sm">Price: ${p.price?.toFixed(2) ?? "-"}</div>
                      <div className="text-sm font-medium">Total: ${p.total?.toFixed(2) ?? "-"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-card/70 backdrop-blur">
              <CardContent className="flex items-center justify-between py-4">
                <div className="font-semibold">Grand Total</div>
                <div className="text-lg font-bold">${totalAmount.toFixed(2)}</div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="destructive" onClick={handleRemoveCart} className="hover:shadow">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete Cart
                </Button>
                <Button className="ml-auto hover:shadow">Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


