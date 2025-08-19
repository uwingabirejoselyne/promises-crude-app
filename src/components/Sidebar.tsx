import { Button } from "./ui/button"
import { Plus, Layers, Package, LayoutDashboard, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

interface SidebarProps {
  open: boolean
  onClose: () => void
  onAddProduct: () => void
}

export function Sidebar({ open, onClose, onAddProduct }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 z-30 w-40 transform border-r bg-background/60 backdrop-blur-xl p-2.5 transition-transform duration-200 ease-in-out pt-14 ${
        open ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 sm:static sm:w-40 sm:pt-14 sm:fixed sm:inset-y-0`}
      style={{ top: 0, bottom: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Navigation</div>
        <Button variant="ghost" size="sm" className="sm:hidden" onClick={onClose}>
          Close
        </Button>
      </div>

      <nav className="space-y-1.5 text-sm">
        <Link to="/" className="block">
          <Button variant="ghost" className="w-full justify-start hover:translate-x-1 transition-transform text-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </Link>
        <Link to="/" className="block">
          <Button variant="ghost" className="w-full justify-start hover:translate-x-1 transition-transform text-sm">
            <Package className="w-4 h-4 mr-2" /> Products
          </Button>
        </Link>
        <Link to="/cart" className="block">
          <Button variant="ghost" className="w-full justify-start hover:translate-x-1 transition-transform text-sm">
            <ShoppingCart className="w-4 h-4 mr-2" /> Cart
          </Button>
        </Link>
        <Link to="/carts" className="block">
          <Button variant="ghost" className="w-full justify-start hover:translate-x-1 transition-transform text-sm">
            <ShoppingCart className="w-4 h-4 mr-2" /> All Carts
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start hover:translate-x-1 transition-transform text-sm">
          <Layers className="w-4 h-4 mr-2" /> Categories
        </Button>
      </nav>

      <div className="mt-4">
        <Button className="w-full hover:shadow-lg" onClick={onAddProduct}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>
    </aside>
  )
}


