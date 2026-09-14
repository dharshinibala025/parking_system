'use client'

import React from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminSidebar } from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-[calc(100vh-5rem)] bg-background flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto">{children}</div>
      </div>
    </ProtectedRoute>
  )
}
