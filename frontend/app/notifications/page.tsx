'use client'

import React from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { Bell, CheckCheck, Calendar, ShieldCheck, XCircle, Clock } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  )
}

function NotificationsContent() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAuth()

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Updates on your parking bookings, reminders, and payment receipts.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              <CheckCheck className="w-4 h-4 text-blue-600" /> Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 max-w-md mx-auto space-y-3">
            <Bell className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">You're all caught up!</h3>
            <p className="text-xs text-slate-500">You have no new notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                  n.isRead
                    ? 'bg-white border-slate-200/80 opacity-75'
                    : 'bg-blue-50/40 border-blue-200 shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'booking'
                      ? 'bg-blue-100 text-blue-600'
                      : n.type === 'cancellation'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{n.title}</h3>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
