"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { initializeStore } from "../lib/store"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (user: User, role: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeStore()
    // Restore session from localStorage
    try {
      const saved = localStorage.getItem("auth_user")
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch {
      localStorage.removeItem("auth_user")
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User, role: string) => {
    const userWithRole = { ...userData, role }
    setUser(userWithRole)
    localStorage.setItem("auth_user", JSON.stringify(userWithRole))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  const isAuthenticated = !!user

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
