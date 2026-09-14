'use client'

import React from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-slate-100 flex font-sans">
        <AdminSidebar />
        <div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
      </div>
    </ProtectedRoute>
  )
}
