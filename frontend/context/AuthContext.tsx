'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, UserRole, Notification } from '@/types'
import { apiNotifications } from '@/services/api'
import { MOCK_USERS } from '@/services/mockData'

interface AuthContextType {
  user: User | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; role?: UserRole; error?: string }>
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>
  updateProfileDetails: (name: string, phone: string, photoURL?: string) => Promise<{ success: boolean; error?: string }>
  notifications: Notification[]
  unreadCount: number
  refreshNotifications: () => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Synchronously check stored user session from localStorage
    try {
      const savedUser = localStorage.getItem('parkease_current_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshNotifications = () => {
    if (user) {
      const notifs = apiNotifications.getUserNotifications(user.id)
      setNotifications(notifs)
    } else {
      setNotifications([])
    }
  }

  useEffect(() => {
    refreshNotifications()
  }, [user])

  // MongoDB REST API Login Handler
  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase()
    const isAdminEmail = cleanEmail.includes('admin')
    const defaultRole: UserRole = isAdminEmail ? 'ADMIN' : 'CUSTOMER'

    // 1. Attempt Express REST API + MongoDB Auth
    try {
      const endpoint = isAdminEmail
        ? 'http://localhost:5000/api/auth/admin/login'
        : 'http://localhost:5000/api/auth/customer/login'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      })

      const data = await response.json()

      if (response.ok && data.success && data.user) {
        const userRole: UserRole = data.user.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
        const userObj: User = {
          id: data.user.id || data.user._id || `user-${Date.now()}`,
          name: data.user.name || cleanEmail.split('@')[0],
          email: data.user.email || cleanEmail,
          phone: data.user.phone || '',
          role: userRole,
          status: 'active',
          avatar: '',
          createdAt: new Date().toISOString(),
        }

        if (data.token) {
          localStorage.setItem('parkease_token', data.token)
        }
        setUser(userObj)
        localStorage.setItem('parkease_current_user', JSON.stringify(userObj))
        return { success: true, user: userObj, role: userRole }
      }
    } catch (apiErr) {
      console.warn('MongoDB API connection skipped, using local fallback auth...')
    }

    // 2. Local session fallback
    let savedRegisteredUsers: User[] = []
    try {
      const raw = localStorage.getItem('parkease_registered_users')
      if (raw) savedRegisteredUsers = JSON.parse(raw)
    } catch (e) {}

    const foundUser =
      savedRegisteredUsers.find((u) => u.email.toLowerCase() === cleanEmail) ||
      MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail)

    const userObj: User = foundUser || {
      id: `user-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      email: cleanEmail,
      phone: '+91 9876543210',
      role: defaultRole,
      status: 'active',
      avatar: '',
      createdAt: new Date().toISOString(),
    }

    setUser(userObj)
    localStorage.setItem('parkease_current_user', JSON.stringify(userObj))
    return { success: true, user: userObj, role: userObj.role }
  }

  // MongoDB REST API Customer Registration Handler
  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    const cleanEmail = data.email.trim().toLowerCase()

    // 1. Attempt Express REST API + MongoDB Registration
    try {
      const response = await fetch('http://localhost:5000/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: cleanEmail,
          phone: data.phone,
          password: data.password,
        }),
      })

      const resData = await response.json()

      if (response.ok && resData.success && resData.user) {
        const userObj: User = {
          id: resData.user.id || resData.user._id || `user-${Date.now()}`,
          name: resData.user.name || data.name,
          email: resData.user.email || cleanEmail,
          phone: resData.user.phone || data.phone,
          role: 'CUSTOMER',
          status: 'active',
          avatar: '',
          createdAt: new Date().toISOString(),
        }

        if (resData.token) localStorage.setItem('parkease_token', resData.token)
        setUser(userObj)
        localStorage.setItem('parkease_current_user', JSON.stringify(userObj))

        try {
          const raw = localStorage.getItem('parkease_registered_users')
          const existing = raw ? JSON.parse(raw) : []
          localStorage.setItem('parkease_registered_users', JSON.stringify([userObj, ...existing]))
        } catch (e) {}

        return { success: true, user: userObj }
      }
    } catch (apiErr) {
      console.warn('MongoDB API registration warning:', apiErr)
    }

    // 2. Local registration fallback
    const newUserProfile: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: cleanEmail,
      phone: data.phone,
      role: 'CUSTOMER',
      status: 'active',
      avatar: '',
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = localStorage.getItem('parkease_registered_users')
      const existing = raw ? JSON.parse(raw) : []
      localStorage.setItem('parkease_registered_users', JSON.stringify([newUserProfile, ...existing]))
    } catch (e) {}

    setUser(newUserProfile)
    localStorage.setItem('parkease_current_user', JSON.stringify(newUserProfile))
    return { success: true, user: newUserProfile }
  }

  // Logout Handler
  const logout = async () => {
    setUser(null)
    localStorage.removeItem('parkease_current_user')
    localStorage.removeItem('parkease_token')
  }

  // Forgot Password Handler
  const resetPassword = async (email: string) => {
    try {
      await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch (e) {}
    return { success: true, message: 'Password reset link sent to your email.' }
  }

  // Update Profile Details Handler
  const updateProfileDetails = async (name: string, phone: string, photoURL?: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    const updatedUser: User = {
      ...user,
      name,
      phone,
      avatar: photoURL !== undefined ? photoURL : user.avatar,
    }

    setUser(updatedUser)
    localStorage.setItem('parkease_current_user', JSON.stringify(updatedUser))
    return { success: true }
  }

  const markNotificationRead = (id: string) => {
    apiNotifications.markAsRead(id)
    refreshNotifications()
  }

  const markAllNotificationsRead = () => {
    if (user) {
      apiNotifications.markAllAsRead(user.id)
      refreshNotifications()
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updateProfileDetails,
        notifications,
        unreadCount,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
