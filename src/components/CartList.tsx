import type { CartResponse } from "../types/cart"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface CartListProps {
  carts: CartResponse[]
  onEdit?: (cartId: number) => void
  onAddToCart?: (cartId: number) => void
  onDelete?: (cartId: number) => void
}

export default function CartList({ carts, onEdit, onAddToCart, onDelete }: CartListProps) {
  return (
    <div className="mx-auto max-w-5xl py-6">
      <div className="grid grid-cols-1 gap-4">
        {carts.map((cart) => (
          <Card key={cart.id} className="bg-card/70 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>Cart #{cart.id}</span>
                <Badge variant="secondary">User {cart.userId}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 text-sm">
                <span className="font-medium">Total:</span> ${cart.total.toFixed(2)}
                {cart.discountedTotal !== undefined && (
                  <span className="ml-4 text-green-600">Discounted: ${cart.discountedTotal.toFixed(2)}</span>
                )}
              </div>
              <div className="text-sm">
                <div className="font-medium mb-1">Products:</div>
                <ul className="space-y-2">
                  {cart.products.map((p) => (
                    <li key={p.id} className="flex items-center gap-3">
                      {p.thumbnail && (
                        <img
                          src={p.thumbnail}
                          alt={p.title ?? "Product"}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="font-medium">{p.title ?? "Product"}</span>
                      <span className="text-muted-foreground">Qty: {p.quantity}</span>
                      {p.price !== undefined && (
                        <span className="text-muted-foreground">| Price: ${p.price.toFixed(2)}</span>
                      )}
                      {p.total !== undefined && (
                        <span className="text-muted-foreground">| Total: ${p.total.toFixed(2)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" onClick={() => onEdit?.(cart.id)}>Edit</Button>
              <Button onClick={() => onAddToCart?.(cart.id)}>Add to Cart</Button>
              <Button variant="destructive" onClick={() => onDelete?.(cart.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


