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
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1769E0] text-[12px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Customer Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2747] tracking-tight">Account & Vehicle Settings</h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Manage your personal profile, vehicle license plates, and security credentials.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
          
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#86EFAC] flex items-center gap-2 text-[#16A34A] text-[13px] font-medium">
              <CheckCircle2 className="w-4 h-4" /> {successMsg}
            </div>
          )}

          {resetMsg && (
            <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#E2E8F0] flex items-center gap-2 text-[#1769E0] text-[13px] font-medium">
              <CheckCircle2 className="w-4 h-4" /> {resetMsg}
            </div>
          )}

          {/* User Info Header */}
          <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-5">
            <div className="w-14 h-14 rounded-xl bg-[#1769E0] text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0F2747]">{user?.name}</h2>
              <p className="text-[13px] text-[#64748B]">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1769E0] text-[10px] font-semibold uppercase border border-[#1769E0]/20">
                {user?.role || 'CUSTOMER'} ACCOUNT
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full h-11 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[14px] font-medium text-[#94A3B8] cursor-not-allowed"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E2E8F0] pb-6">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E2E8F0] text-[#1769E0] hover:bg-[#EFF6FF] font-semibold text-[13px] rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="w-4 h-4" /> Send Password Reset Link
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-5 py-2 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg shadow-xs transition"
              >
                {isUpdating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

          {/* Manage Saved Vehicles */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[16px] font-bold text-[#0F2747] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#1769E0]" /> Manage Saved Vehicles
            </h3>

            <form onSubmit={handleAddVehicle} className="flex gap-2">
              <input
                type="text"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                placeholder="Enter Plate # (e.g. KA 01 AB 1234)"
                className="flex-1 h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[13px] font-mono font-bold uppercase text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Vehicle
              </button>
            </form>

            <div className="space-y-2 pt-1">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Car className="w-4 h-4 text-[#1769E0]" />
                    <span className="font-mono font-bold text-[#0F2747]">{v.plateNumber}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="p-1 rounded-md hover:bg-[#FEF2F2] text-[#DC2626] transition"
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
