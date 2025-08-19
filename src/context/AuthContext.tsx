import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getLoggedInUserId, setLoggedInUserId } from "../libs/utils"

interface AuthContextValue {
  userId: number | null
  login: (userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<number | null>(getLoggedInUserId())

  useEffect(() => {
    setUserId(getLoggedInUserId())
  }, [])

  const login = useCallback((id: number) => {
    setLoggedInUserId(id)
    setUserId(id)
  }, [])

  const logout = useCallback(() => {
    setLoggedInUserId(null)
    setUserId(null)
  }, [])

  const value = useMemo(
    () => ({ userId, login, logout }),
    [userId, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}


