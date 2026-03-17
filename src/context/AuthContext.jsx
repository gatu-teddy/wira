import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password, type) => {
    // Mock login - in production, call your API
    const mockUser = {
      id: '1',
      email,
      name: type === 'employer' ? 'Acme Corp' : 'Alex Johnson',
      type, // 'seeker' | 'employer' | 'admin'
      avatar: null,
      profileComplete: 72,
    }
    setUser(mockUser)
    return mockUser
  }

  const register = (data) => {
    const mockUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name || data.companyName,
      type: data.type,
      avatar: null,
      profileComplete: 20,
    }
    setUser(mockUser)
    return mockUser
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
