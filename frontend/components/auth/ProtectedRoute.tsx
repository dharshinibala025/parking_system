'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ShieldAlert, Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, role, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      // 1. Unauthenticated User Protection
      if (!isAuthenticated || !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // 2. Admin Security Check: Non-admins trying to access /admin routes
      if (requireAdmin && role !== 'ADMIN') {
        console.warn(`Unauthorized Access Attempt to ${pathname} by non-admin user ${user.email}`)
        router.push('/dashboard?error=unauthorized')
      }
    }
  }, [isLoading, isAuthenticated, user, role, requireAdmin, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-600">Verifying session & security permissions...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (requireAdmin && role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-600 mb-6">
            You don't have permission to access the ParkEase Administrator portal.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition"
          >
            Return to Customer Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
