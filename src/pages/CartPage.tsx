import { useEffect } from "react"
import { useCart } from "../context/CartContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Trash2 } from "lucide-react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function CartPage() {
  const { userId } = useAuth()
  const { cart, loading, refresh, clearCart, addItem } = useCart()

  useEffect(() => {
    void refresh()
  }, [refresh])

  if (!userId) return <Navigate to="/login" replace />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Your Cart</h1>
      {loading ? (
        <div>Loading...</div>
      ) : !cart ? (
        <div className="text-muted-foreground">No cart found.</div>
      ) : (
        <div className="space-y-3">
          {cart.products.map((p) => (
            <Card key={p.id} className="bg-card/70 backdrop-blur">
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
                  <Button size="sm" onClick={() => addItem(p.id, 1)}>Add 1 more</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-card/70 backdrop-blur">
            <CardContent className="flex items-center justify-between py-4">
              <div className="font-semibold">Grand Total</div>
              <div className="text-lg font-bold">${(cart.total ?? 0).toFixed(2)}</div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="destructive" onClick={clearCart} className="hover:shadow">
                <Trash2 className="w-4 h-4 mr-1" /> Delete Cart
              </Button>
              <Button className="ml-auto hover:shadow">Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}


