import { Button } from "./ui/button"
import { Plus, Layers, Package, LayoutDashboard, ShoppingCart, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface SidebarProps {
  open: boolean
  onClose: () => void
  onAddProduct: () => void
}

export function Sidebar({ open, onClose, onAddProduct }: SidebarProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-background/95 backdrop-blur-xl 
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-64
        `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Product UI
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            <Link to="/" className="block">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                className="w-full justify-start hover:translate-x-1 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button 
                variant={isActive("/products") ? "default" : "ghost"} 
                className="w-full justify-start hover:translate-x-1 transition-all"
              >
                <Package className="w-4 h-4 mr-3" />
                Products
              </Button>
            </Link>
            
            <Link to="/cart" className="block">
              <Button 
                variant={isActive("/cart") ? "default" : "ghost"} 
                className="w-full justify-start hover:translate-x-1 transition-all"
              >
                <ShoppingCart className="w-4 h-4 mr-3" />
                My Cart
              </Button>
            </Link>
            
            <Link to="/carts" className="block">
              <Button 
                variant={isActive("/carts") ? "default" : "ghost"} 
                className="w-full justify-start hover:translate-x-1 transition-all"
              >
                <Layers className="w-4 h-4 mr-3" />
                All Carts
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start hover:translate-x-1 transition-all"
            >
              <Layers className="w-4 h-4 mr-3" />
              Categories
            </Button>
          </nav>

          {/* Bottom Action */}
          <div className="border-t p-4">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all" 
              onClick={onAddProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}