// pages/CartPage.tsx - Responsive Version
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
  const { cart, loading, refresh, clearCart, addItem, removeItem, updateItemQuantity } = useCart()

  useEffect(() => {
    void refresh()
  }, [refresh])

  if (!user?.id) return <Navigate to="/login" replace />

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(productId)
    } else {
      await updateItemQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    if (confirm("Remove this item from your cart?")) {
      await removeItem(productId)
    }
  }

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your entire cart?")) {
      await clearCart()
    }
  }

  const handleAddOneMore = async (productId: number) => {
    await addItem(productId, 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Responsive header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2 sm:p-3"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Your Cart
            </h1>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            <span className="ml-3 text-base sm:text-lg">Loading cart...</span>
          </div>
        ) : !cart || !cart.products?.length ? (
          /* Empty cart state - responsive */
          <div className="text-center py-8 sm:py-12 px-4">
            <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 text-muted-foreground" />
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Button 
              onClick={() => navigate("/")} 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Cart items - responsive layout */}
            <div className="space-y-3 sm:space-y-4">
              {cart.products.map((product) => (
                <Card key={product.id} className="bg-card/70 backdrop-blur border-border/60 hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    {/* Mobile layout (stacked) */}
                    <div className="flex flex-col sm:hidden gap-4">
                      {/* Product image and basic info */}
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={product.thumbnail || "/placeholder.svg?height=64&width=64"}
                            alt={product.title ?? "Product"}
                            className="w-full h-full rounded-lg object-cover border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=64&width=64"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base line-clamp-2 mb-1">
                            {product.title ?? `Product #${product.id}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ${(product.price ?? 0).toFixed(2)} each
                          </p>
                          {product.discountPercentage && product.discountPercentage > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              {product.discountPercentage}% off
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="font-bold text-lg">
                            ${(product.total ?? 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Mobile quantity controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                            disabled={loading || product.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 1
                              handleQuantityChange(product.id, newQty)
                            }}
                            className="w-14 text-center h-8 text-sm"
                            disabled={loading}
                          />
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddOneMore(product.id)}
                            disabled={loading}
                            className="text-xs px-3"
                          >
                            +1 More
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveItem(product.id)}
                            disabled={loading}
                            className="px-3"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout (horizontal) */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-6">
                      {/* Product Image */}
                      <div className="w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0">
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
                        <h3 className="font-semibold text-lg lg:text-xl mb-2 line-clamp-2">
                          {product.title ?? `Product #${product.id}`}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-base lg:text-lg font-medium">
                            ${(product.price ?? 0).toFixed(2)} each
                          </p>
                          {product.discountPercentage && product.discountPercentage > 0 && (
                            <p className="text-sm text-green-600 font-medium">
                              {product.discountPercentage}% off applied
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Desktop quantity controls */}
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
                          <p className="font-bold text-xl lg:text-2xl">
                            ${(product.total ?? 0).toFixed(2)}
                          </p>
                        </div>
                        
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

            {/* Responsive cart summary */}
            <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur border-border/60 shadow-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-lg sm:text-xl">Order Summary</span>
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ${(cart.total ?? 0).toFixed(2)}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3 p-4 sm:p-6">
                {/* Responsive summary grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
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
                
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Grand Total:</span>
                  <span>${((cart.total ?? 0) * 1.08).toFixed(2)}</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 p-4 sm:p-6">
                <Button 
                  variant="destructive" 
                  onClick={handleClearCart}
                  disabled={loading}
                  className="w-full sm:w-auto hover:shadow-lg order-2 sm:order-1"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Clear Cart
                </Button>
                
                <Button 
                  className="w-full sm:flex-1 hover:shadow-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 order-1 sm:order-2"
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
    </div>
  )
}