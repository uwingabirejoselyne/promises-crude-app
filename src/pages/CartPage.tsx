// pages/CartPage.tsx
import { useEffect } from "react"
import { useCart } from "../context/CartContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function CartPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  // FIXED: Added removeItem and updateItemQuantity from context
  const { cart, loading, refresh, clearCart, addItem, removeItem, updateItemQuantity } = useCart()

  useEffect(() => {
    void refresh()
  }, [refresh])

  if (!user?.id) return <Navigate to="/login" replace />

  // NEW: Added quantity change handler with validation
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // If quantity is 0 or negative, remove the item
      await removeItem(productId)
    } else {
      await updateItemQuantity(productId, newQuantity)
    }
  }

  // NEW: Added individual item removal with confirmation
  const handleRemoveItem = async (productId: number) => {
    if (confirm("Remove this item from your cart?")) {
      await removeItem(productId)
    }
  }

  // FIXED: Added confirmation dialog for clear cart
  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your entire cart?")) {
      await clearCart()
    }
  }

  // NEW: Added quick add one more functionality
  const handleAddOneMore = async (productId: number) => {
    await addItem(productId, 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* FIXED: Enhanced header with navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Your Cart
          </h1>
        </div>
      </div>

      {/* FIXED: Better loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading cart...</span>
        </div>
      ) : !cart || !cart.products?.length ? (
        // FIXED: Enhanced empty cart state
        <div className="text-center py-12">
          <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. 
            Start shopping to fill it up!
          </p>
          <Button 
            onClick={() => navigate("/")} 
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* FIXED: Enhanced cart items with better controls */}
          <div className="space-y-4">
            {cart.products.map((product) => (
              <Card key={product.id} className="bg-card/70 backdrop-blur border-border/60 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={product.thumbnail || "/placeholder.svg?height=96&width=96"}
                        alt={product.title ?? "Product"}
                        className="w-full h-full rounded-lg object-cover border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=96&width=96"
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                        {product.title ?? `Product #${product.id}`}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-lg font-medium">
                          ${(product.price ?? 0).toFixed(2)} each
                        </p>
                        {product.discountPercentage && product.discountPercentage > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            {product.discountPercentage}% off applied
                          </p>
                        )}
                      </div>
                    </div>

                    {/* NEW: Enhanced quantity controls */}
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                          disabled={loading || product.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1
                            handleQuantityChange(product.id, newQty)
                          }}
                          className="w-16 text-center h-8"
                          disabled={loading}
                        />
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* NEW: Quick add one more button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddOneMore(product.id)}
                        disabled={loading}
                        className="text-xs"
                      >
                        Add 1 more
                      </Button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right min-w-0 flex flex-col items-end gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-2xl">
                          ${(product.total ?? 0).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* NEW: Enhanced remove button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveItem(product.id)}
                        disabled={loading}
                        className="hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FIXED: Enhanced cart summary */}
          <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur border-border/60 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Order Summary</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ${(cart.total ?? 0).toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Items:</span>
                    <span>{cart.totalProducts ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Quantity:</span>
                    <span>{cart.totalQuantity ?? 0}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>${(cart.total ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Estimated Tax:</span>
                    <span>${((cart.total ?? 0) * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <hr className="border-border/60" />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>${((cart.total ?? 0) * 1.08).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 pt-6">
              <Button 
                variant="destructive" 
                onClick={handleClearCart}
                disabled={loading}
                className="hover:shadow-lg"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Clear Cart
              </Button>
              
              <Button 
                className="flex-1 hover:shadow-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3"
                disabled={loading}
                onClick={() => alert("Checkout functionality coming soon!")}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}