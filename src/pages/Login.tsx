import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { AuthUser } from "../types/auth"
import { User, Mail, Lock } from "lucide-react"

export default function Login() {
  const [firstname, setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstname.trim() || !email.trim() || !password.trim()) return
    const pseudoId = (Math.floor(Math.random() * 100000) + 1) % 30 || 30
    localStorage.setItem("userId", String(pseudoId))
    const user: AuthUser = { id: pseudoId, firstname, email }
    localStorage.setItem("auth_user", JSON.stringify(user))
    login(user)
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <form
        onSubmit={handleLogin}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 border border-gray-100"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        {/* Firstname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-11 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your first name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-11 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-11 pr-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:from-blue-600 hover:to-purple-700 transition-transform transform hover:scale-[1.01] active:scale-[0.98]"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}
