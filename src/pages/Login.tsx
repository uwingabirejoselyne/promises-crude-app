import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [userId, setUserId] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (userId.trim()) {
      localStorage.setItem("userId", userId)
      const parsed = Number.parseInt(userId)
      if (Number.isFinite(parsed) && parsed > 0) {
        login(parsed)
      }
      navigate("/cart")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <label className="block mb-2 font-medium">User ID</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  )
}


