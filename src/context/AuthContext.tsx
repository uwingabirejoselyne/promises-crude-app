import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getLoggedInUserId, setLoggedInUserId } from "../libs/utils"
import type { AuthUser } from "../types/auth"

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const id = getLoggedInUserId()
    if (id) {
      const cached = localStorage.getItem("auth_user")
      if (cached) {
        try {
          const parsed: AuthUser = JSON.parse(cached)
          if (parsed && parsed.id === id) setUser(parsed)
        // eslint-disable-next-line no-empty
        } catch {}
      } else {
        setUser({ id, firstname: "", email: "" })
      }
    }
  }, [])

  const login = useCallback((userObj: AuthUser) => {
    setLoggedInUserId(userObj.id)
    localStorage.setItem("auth_user", JSON.stringify(userObj))
    setUser(userObj)
  }, [])

  const logout = useCallback(() => {
    setLoggedInUserId(null)
    localStorage.removeItem("auth_user")
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}


