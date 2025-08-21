import { ShoppingCart, Menu, LogIn, LogOut, User } from "lucide-react"
import { Button } from "./ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "./ui/input"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

interface HeaderProps {
  onToggleSidebar: () => void
  onSearch?: (query: string) => void
}

export function Header({ onToggleSidebar, onSearch }: HeaderProps) {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/login")
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-30  bg-green-600 shadow-md backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto max-w-[1400px] px-3 py-2 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} aria-label="Toggle sidebar" className="sm:hidden">
          <Menu className="w-5 h-5" />
        </Button>

        <Link to="/" className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Shop Admin</Link>

        <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
          {onSearch && (
            <div className="hidden sm:flex items-center gap-2">
              <Input
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}

          <Link to="/cart" aria-label="Open cart" className="relative inline-flex">
            <Button variant="ghost" size="icon" className="hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cart?.totalQuantity ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                {cart.totalQuantity}
              </span>
            ) : null}
          </Link>

          {user?.id ? (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 text-sm"><User className="w-4 h-4" />{user.firstname}</div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="hover:shadow">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleLogin} className="hover:shadow">
                <LogIn className="w-4 h-4 mr-1" /> Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


