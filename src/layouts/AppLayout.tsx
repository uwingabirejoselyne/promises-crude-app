import { Outlet } from "react-router-dom"
import { Header } from "../components/Header"
import { Sidebar } from "../components/Sidebar"
import { CartDrawer } from "../components/CartDrawer"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const auth = useAuth()
  const userId = (auth as any).userId

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_50%),radial-gradient(ellipse_at_bottom,theme(colors.secondary/10),transparent_50%)]" />

      <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />

      <div className="mx-auto max-w-[1400px] px-3">
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onAddProduct={() => {}} />
          <main className="flex-1 p-3 sm:p-4">
            <Outlet />
          </main>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} userId={userId} />
    </div>
  )
}


