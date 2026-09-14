'use client'

import React, { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Phone, Lock, Camera, CheckCircle2, Shield } from 'lucide-react'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, updateProfileDetails, resetPassword } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [photoURL, setPhotoURL] = useState(user?.avatar || '')

  const [isUpdating, setIsUpdating] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccessMsg(null)

    const res = await updateProfileDetails(name, phone, photoURL)
    if (res.success) {
      setSuccessMsg('Profile updated successfully.')
    }
    setIsUpdating(false)
  }

  const handlePasswordReset = async () => {
    if (user?.email) {
      const res = await resetPassword(user.email)
      setResetMsg(res.message || 'Password reset email sent.')
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Profile Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal contact details and security configuration.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          {resetMsg && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-2 text-blue-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> {resetMsg}
            </div>
          )}

          {/* User Avatar Section */}
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
            <div className="relative">
              {photoURL ? (
                <img src={photoURL} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-2xl flex items-center justify-center border-2 border-blue-200">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                {user?.role} ACCOUNT
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400 mt-1">Email is managed by Firebase Authentication.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Image URL</label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4 text-slate-500" /> Send Password Reset Email
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                {isUpdating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
