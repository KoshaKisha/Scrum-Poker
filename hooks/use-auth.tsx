"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser } from "@/lib/auth"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
  refreshUser()
}, [])

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      refreshUser()
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange)
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}, [])

  return <AuthContext.Provider value={{ user, isLoading, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
