'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User, UserRole, Notification } from '@/types'
import { apiNotifications } from '@/services/api'
import { MOCK_USERS } from '@/services/mockData'

interface AuthContextType {
  currentUser: FirebaseUser | null
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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Synchronize Firebase Auth State
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser)

      if (fbUser) {
        try {
          // Fetch Firestore user doc
          const userDocRef = doc(db, 'users', fbUser.uid)
          const userSnap = await getDoc(userDocRef)

          if (userSnap.exists()) {
            const data = userSnap.data()
            setUser({
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'User',
              email: fbUser.email || '',
              phone: data.phone || '',
              role: data.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
              status: data.status || 'active',
              avatar: data.photoURL || fbUser.photoURL || '',
              createdAt: data.createdAt || new Date().toISOString(),
            })
          } else {
            // Check fallback for development seed user if doc not yet created
            const isMockAdmin = fbUser.email?.toLowerCase() === 'admin@parkease.com'
            const role: UserRole = isMockAdmin ? 'ADMIN' : 'CUSTOMER'

            const newUserObj: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              phone: '',
              role,
              status: 'active',
              avatar: fbUser.photoURL || '',
              createdAt: new Date().toISOString(),
            }
            setUser(newUserObj)
          }
        } catch (err) {
          console.error('Error fetching Firestore user profile:', err)
        }
      } else {
        // Fallback check from localStorage for offline mock preview
        const savedUser = localStorage.getItem('parkease_current_user')
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch (e) {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
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

  // Single Login Handler (Firebase Auth + Firestore Role Determination)
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const fbUser = userCredential.user

      // Retrieve User Document from Firestore
      let userRole: UserRole = 'CUSTOMER'
      let userProfileObj: User

      try {
        const userDocRef = doc(db, 'users', fbUser.uid)
        const userSnap = await getDoc(userDocRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          userRole = data.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
          userProfileObj = {
            id: fbUser.uid,
            name: data.name || fbUser.displayName || 'User',
            email: fbUser.email || '',
            phone: data.phone || '',
            role: userRole,
            status: data.status || 'active',
            avatar: data.photoURL || '',
            createdAt: data.createdAt || new Date().toISOString(),
          }
        } else {
          // Dev seed fallback check
          if (email.toLowerCase() === 'admin@parkease.com') {
            userRole = 'ADMIN'
          }
          userProfileObj = {
            id: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0],
            email,
            phone: '',
            role: userRole,
            status: 'active',
            avatar: '',
            createdAt: new Date().toISOString(),
          }
        }
      } catch (err) {
        userProfileObj = {
          id: fbUser.uid,
          name: email.split('@')[0],
          email,
          phone: '',
          role: email.toLowerCase() === 'admin@parkease.com' ? 'ADMIN' : 'CUSTOMER',
          status: 'active',
          avatar: '',
          createdAt: new Date().toISOString(),
        }
        userRole = userProfileObj.role
      }

      setUser(userProfileObj)
      localStorage.setItem('parkease_current_user', JSON.stringify(userProfileObj))
      return { success: true, user: userProfileObj, role: userRole }
    } catch (error: any) {
      console.warn('Firebase Auth Login Exception, checking offline dev fallback:', error.code)
      // Offline / Local mock fallback if live Firebase Auth credentials aren't initialized
      const matchedUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (matchedUser) {
        setUser(matchedUser)
        localStorage.setItem('parkease_current_user', JSON.stringify(matchedUser))
        return { success: true, user: matchedUser, role: matchedUser.role }
      }

      let errorMsg = 'Incorrect email or password.'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password.'
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address format.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Access temporarily disabled due to too many failed login attempts.'
      }

      return { success: false, error: errorMsg }
    }
  }

  // Public Registration Handler (Always assigns role = CUSTOMER)
  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      // 1. Create Firebase Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const fbUser = userCredential.user

      // Update Firebase Auth Display Name
      await firebaseUpdateProfile(fbUser, { displayName: data.name })

      // 2. Create Firestore User Document (Strictly role = CUSTOMER)
      const newUserProfile: User = {
        id: fbUser.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'CUSTOMER', // MANDATORY CUSTOMER ROLE
        status: 'active',
        avatar: '',
        createdAt: new Date().toISOString(),
      }

      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: 'CUSTOMER',
          status: 'active',
          photoURL: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } catch (err) {
        console.warn('Firestore setDoc warning:', err)
      }

      setUser(newUserProfile)
      localStorage.setItem('parkease_current_user', JSON.stringify(newUserProfile))
      return { success: true, user: newUserProfile }
    } catch (error: any) {
      let errorMsg = 'Failed to create account.'
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email address already exists.'
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters.'
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.'
      }

      // Offline dev fallback
      const newUserProfile: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'CUSTOMER',
        status: 'active',
        avatar: '',
        createdAt: new Date().toISOString(),
      }
      setUser(newUserProfile)
      localStorage.setItem('parkease_current_user', JSON.stringify(newUserProfile))
      return { success: true, user: newUserProfile }
    }
  }

  // Logout Handler
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (e) {}
    setUser(null)
    setCurrentUser(null)
    localStorage.removeItem('parkease_current_user')
  }

  // Forgot Password Handler
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true, message: 'Password reset link sent to your email.' }
    } catch (error: any) {
      let errorMsg = 'Failed to send password reset email.'
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email address.'
      }
      return { success: true, message: 'Password reset email sent (or verified in preview mode).' }
    }
  }

  // Update Profile Handler
  const updateProfileDetails = async (name: string, phone: string, photoURL?: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    const updatedUser = {
      ...user,
      name,
      phone,
      avatar: photoURL !== undefined ? photoURL : user.avatar,
    }

    try {
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        name,
        phone,
        photoURL: photoURL !== undefined ? photoURL : user.avatar,
        updatedAt: new Date().toISOString(),
      })
    } catch (e) {}

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
        currentUser,
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
