import { useEffect, useState } from "react"
import CartList from "../components/CartList"
import type { CartResponse } from "../types/cart"
import { cartApi } from "../services/api"

export default function AllCarts() {
  const [carts, setCarts] = useState<CartResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    cartApi
      .getAllCarts()
      .then((res) => setCarts(res.carts))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading carts...</div>

  return (
    <CartList
      carts={carts}
      onEdit={(id) => alert(`Edit cart ${id}`)}
      onAddToCart={(id) => alert(`Add cart ${id} to cart`)}
      onDelete={(id) => alert(`Delete cart ${id}`)}
    />
  )
}


