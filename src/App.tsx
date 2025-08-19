import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import { ProductList } from "./pages/ProductList"
import Login from "./pages/Login"
import CartPage from "./pages/CartPage"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import AllCarts from "./pages/AllCarts"

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        { path: "/", element: <ProductList /> },
        { path: "/cart", element: <CartPage /> },
        { path: "/carts", element: <AllCarts /> },
      ],
    },
    { path: "/login", element: <Login /> },
  ])

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
