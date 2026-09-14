'use client'

import React, { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Phone, Lock, Camera, CheckCircle2, Shield, Car, Plus, Trash2, Sparkles } from 'lucide-react'

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
  const [vehicles, setVehicles] = useState<any[]>([])
  const [newPlate, setNewPlate] = useState('')

  const [isUpdating, setIsUpdating] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('parkease_vehicles') || '[]')
      if (stored.length === 0) {
        const initial = [
          { id: 'v1', plateNumber: 'KA 01 AB 1234', type: '4W' },
        ]
        setVehicles(initial)
        localStorage.setItem('parkease_vehicles', JSON.stringify(initial))
      } else {
        setVehicles(stored)
      }
    } catch (e) {}
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccessMsg(null)

    const res = await updateProfileDetails(name, phone)
    if (res.success) {
      setSuccessMsg('Profile details updated successfully.')
    }
    setIsUpdating(false)
  }

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlate.trim()) return

    const newV = {
      id: `v-${Date.now()}`,
      plateNumber: newPlate.trim().toUpperCase(),
      type: '4W',
    }
    const updated = [...vehicles, newV]
    setVehicles(updated)
    localStorage.setItem('parkease_vehicles', JSON.stringify(updated))
    setNewPlate('')
  }

  const handleDeleteVehicle = (id: string) => {
    const updated = vehicles.filter((v) => v.id !== id)
    setVehicles(updated)
    localStorage.setItem('parkease_vehicles', JSON.stringify(updated))
  }

  const handlePasswordReset = async () => {
    if (user?.email) {
      const res = await resetPassword(user.email)
      setResetMsg(res.message || 'Password reset email sent to your inbox.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Customer Account
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Account & Vehicle Settings</h1>
          <p className="text-sm text-[#718096] mt-1">
            Manage your personal profile, vehicle license plates, and security credentials.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
          
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          {resetMsg && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-blue-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> {resetMsg}
            </div>
          )}

          {/* User Info Header */}
          <div className="flex items-center gap-5 border-b border-[#D4DDE2]/60 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#5C7E8F] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>

            <div>
              <h2 className="text-xl font-black text-[#2C3E50]">{user?.name}</h2>
              <p className="text-xs text-[#718096]">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#D4DDE2] text-[#5C7E8F] text-[10px] font-bold uppercase">
                {user?.role || 'CUSTOMER'} ACCOUNT
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 bg-[#D4DDE2]/20 border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#A2A2A2] cursor-not-allowed"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#D4DDE2]/60 pb-6">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-[#D4DDE2] text-[#5C7E8F] hover:bg-[#D4DDE2]/40 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="w-4 h-4" /> Send Password Reset Link
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                {isUpdating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

          {/* Manage Saved Vehicles */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-[#2C3E50] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#5C7E8F]" /> Manage Saved Vehicles
            </h3>

            <form onSubmit={handleAddVehicle} className="flex gap-2">
              <input
                type="text"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                placeholder="Enter Plate # (e.g. KA 01 AB 1234)"
                className="flex-1 px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-xs font-bold uppercase text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Vehicle
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-[#D4DDE2]/30 border border-[#D4DDE2] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-[#5C7E8F]" />
                    <span className="font-mono font-black text-[#2C3E50] text-sm">{v.plateNumber}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
