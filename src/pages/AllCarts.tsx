// pages/AllCarts.tsx with localStorage integration
import { useEffect, useState } from "react"
import CartList from "../components/CartList"
import type { CartResponse } from "../types/cart"
import { cartApi } from "../services/api"
import { useCart } from "../context/CartContext"
import { Button } from "../components/ui/button"
import { RefreshCw, Loader2, Database, HardDrive } from "lucide-react"

export default function AllCarts() {
  const [apiCarts, setApiCarts] = useState<CartResponse[]>([])
  const [combinedCarts, setCombinedCarts] = useState<CartResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showMode, setShowMode] = useState<'all' | 'local' | 'api'>('all')
  
  // Get functions from cart context
  const { cart, getAllUserCarts } = useCart()

  const loadApiCarts = async () => {
    try {
      const res = await cartApi.getAllCarts()
      setApiCarts(res.carts)
      console.log("Loaded API carts:", res.carts.length)
      return res.carts
    } catch (error) {
      console.error("Failed to load API carts:", error)
      return []
    }
  }

  const loadAllCarts = async () => {
    setLoading(true)
    try {
      // Load both API carts and localStorage carts
      const apiCartList = await loadApiCarts()
      const localCarts = getAllUserCarts()
      
      // Combine and deduplicate carts (localStorage takes precedence)
      const allCarts = [...localCarts]
      
      // Add API carts that don't exist in localStorage
      apiCartList.forEach(apiCart => {
        const existsInLocal = localCarts.some(localCart => localCart.id === apiCart.id)
        if (!existsInLocal) {
          allCarts.push(apiCart)
        }
      })
      
      // Sort by ID (newest first)
      allCarts.sort((a, b) => b.id - a.id)
      
      setCombinedCarts(allCarts)
      console.log("Combined carts:", {
        total: allCarts.length,
        localStorage: localCarts.length,
        api: apiCartList.length
      })
      
    } catch (error) {
      console.error("Failed to load all carts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAllCarts()
    setRefreshing(false)
  }

  // Initial load
  useEffect(() => {
    loadAllCarts()
  }, [])

  // Auto-refresh when user's cart changes
  useEffect(() => {
    if (cart) {
      console.log("User cart changed, refreshing all carts...")
      loadAllCarts()
    }
  }, [cart?.id, cart?.totalProducts])

  // Enhanced delete handler
  const handleDelete = async (cartId: number) => {
    if (!confirm(`Are you sure you want to delete cart ${cartId}?`)) return
    
    try {
      setRefreshing(true)
      
      // Check if cart exists in localStorage
      const localCarts = getAllUserCarts()
      const isLocalCart = localCarts.some(c => c.id === cartId)
      
      if (isLocalCart) {
        // Remove from localStorage
        const updatedLocalCarts = localCarts.filter(c => c.id !== cartId)
        localStorage.setItem("user_carts", JSON.stringify(updatedLocalCarts))
        alert(`Local cart ${cartId} deleted successfully!`)
      } else {
        // Try to delete from API (may not work with DummyJSON)
        try {
          await cartApi.deleteCart(cartId)
          alert(`API cart ${cartId} deleted successfully!`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          alert(`Cannot delete API cart ${cartId} - DummyJSON is read-only`)
        }
      }
      
      // Remove from local state immediately
      setCombinedCarts(prev => prev.filter(c => c.id !== cartId))
      
      // Refresh to ensure consistency
      await loadAllCarts()
      
    } catch (error) {
      console.error("Failed to delete cart:", error)
      alert("Failed to delete cart. Please try again.")
    } finally {
      setRefreshing(false)
    }
  }

  // Filter carts based on display mode
  const getDisplayCarts = () => {
    const localCarts = getAllUserCarts()
    
    switch (showMode) {
      case 'local':
        return combinedCarts.filter(cart => 
          localCarts.some(local => local.id === cart.id)
        )
      case 'api':
        return combinedCarts.filter(cart => 
          !localCarts.some(local => local.id === cart.id)
        )
      default:
        return combinedCarts
    }
  }

  const displayCarts = getDisplayCarts()
  const localCarts = getAllUserCarts()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="text-lg">Loading all carts...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            All Carts
          </h1>
          <p className="text-muted-foreground">
            Showing {displayCarts.length} cart{displayCarts.length !== 1 ? 's' : ''} | 
            Local: {localCarts.length} | API: {apiCarts.length}
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Display mode toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              size="sm"
              variant={showMode === 'all' ? 'default' : 'ghost'}
              onClick={() => setShowMode('all')}
              className="rounded-none"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={showMode === 'local' ? 'default' : 'ghost'}
              onClick={() => setShowMode('local')}
              className="rounded-none"
            >
              <HardDrive className="w-4 h-4 mr-1" />
              Local
            </Button>
            <Button
              size="sm"
              variant={showMode === 'api' ? 'default' : 'ghost'}
              onClick={() => setShowMode('api')}
              className="rounded-none"
            >
              <Database className="w-4 h-4 mr-1" />
              API
            </Button>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      

      {displayCarts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            {showMode === 'local' 
              ? "No local carts found. Add some items to your cart to see them here!"
              : showMode === 'api'
              ? "No API carts available."
              : "No carts found."
            }
          </p>
        </div>
      ) : (
        <CartList
          carts={displayCarts}
          onEdit={(id) => alert(`Edit cart ${id} - Feature coming soon!`)}
          onAddToCart={(id) => alert(`Add cart ${id} items to your cart - Feature coming soon!`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}