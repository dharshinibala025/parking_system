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
      // 1. Unauthenticated Route Redirection
      if (!isAuthenticated || !user) {
        if (requireAdmin || pathname.startsWith('/admin')) {
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
        } else {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        }
        return
      }

      // 2. Admin Security Check: Customer attempting to access /admin routes
      if (requireAdmin && role !== 'ADMIN') {
        console.warn(`Unauthorized Access Attempt to ${pathname} by user ${user.email}`)
      }
    }
  }, [isLoading, isAuthenticated, user, role, requireAdmin, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAFC]">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4DDE2] border-t-[#5C7E8F] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#5C7E8F]">Verifying credentials & security clearance...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (requireAdmin && role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAFC] px-4 py-12">
        <div className="glass-card p-8 rounded-2xl border border-red-200 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Admin Access Required</h2>
          <p className="text-sm text-[#718096] mb-6 leading-relaxed">
            This area is strictly restricted to system administrators. Customer accounts do not have clearance to view administrative portals.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold py-3 px-4 rounded-xl transition shadow-sm"
            >
              Return to Customer Dashboard
            </button>
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-white hover:bg-[#D4DDE2]/40 text-[#5C7E8F] border border-[#D4DDE2] font-semibold py-2.5 px-4 rounded-xl transition text-xs"
            >
              Switch to Admin Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
