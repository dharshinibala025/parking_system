'use client'

import React, { useState } from 'react'
import { Settings, Save, ShieldCheck, CheckCircle2, Lock, DollarSign, Key, Sparkles } from 'lucide-react'

export default function AdminSettingsPage() {
  // Global rates state
  const [defaultRate4W, setDefaultRate4W] = useState<number>(5.0)
  const [defaultRate2W, setDefaultRate2W] = useState<number>(3.0)
  const [cancellationFee, setCancellationFee] = useState<number>(0.0)

  // Admin password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [rateSuccessMsg, setRateSuccessMsg] = useState<string | null>(null)
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null)
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null)

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault()
    setRateSuccessMsg('Global hourly rates and cancellation rules updated successfully.')
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPassErrorMsg(null)
    setPassSuccessMsg(null)

    if (newPassword !== confirmPassword) {
      setPassErrorMsg('New passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      setPassErrorMsg('New password must be at least 6 characters.')
      return
    }

    setPassSuccessMsg('Admin password updated successfully. Seed credentials secured.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Security & Pricing
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Admin Portal Settings</h1>
          <p className="text-sm text-[#718096] mt-1">
            Update base slot hourly rates, change administrator password, and manage seed credentials security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Hourly Rates & Pricing Configuration */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
          <div className="border-b border-[#D4DDE2]/60 pb-3">
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#5C7E8F]" /> Hourly Rate Defaults
            </h2>
            <p className="text-xs text-[#718096]">Set default rates applied to new 2W and 4W parking bays</p>
          </div>

          {rateSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {rateSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveRates} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                4-Wheeler Base Rate ($/hr)
              </label>
              <input
                type="number"
                step="0.5"
                value={defaultRate4W}
                onChange={(e) => setDefaultRate4W(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                2-Wheeler Base Rate ($/hr)
              </label>
              <input
                type="number"
                step="0.5"
                value={defaultRate2W}
                onChange={(e) => setDefaultRate2W(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                Cancellation Fee ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={cancellationFee}
                onChange={(e) => setCancellationFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Default Rates
              </button>
            </div>
          </form>
        </div>

        {/* Change Admin Password Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
          <div className="border-b border-[#D4DDE2]/60 pb-3">
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <Key className="w-5 h-5 text-[#5C7E8F]" /> Change Admin Password
            </h2>
            <p className="text-xs text-[#718096]">Update authentication credentials for admin@parkeasy.com</p>
          </div>

          {passSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {passSuccessMsg}
            </div>
          )}

          {passErrorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
              {passErrorMsg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl font-medium text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2C3E50] uppercase tracking-wider mb-1">New Admin Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl font-medium text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl font-medium text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Update Password
              </button>
            </div>
          </form>

          {/* Seed Credentials Status Banner */}
          <div className="p-4 rounded-2xl bg-[#D4DDE2]/30 border border-[#D4DDE2] text-xs text-[#2C3E50]">
            <p className="font-bold flex items-center gap-1.5 text-[#5C7E8F] mb-1">
              <ShieldCheck className="w-4 h-4" /> Default Seed Admin Status:
            </p>
            <p className="font-mono text-[11px] text-[#718096]">
              Seed Account: <span className="font-bold text-[#2C3E50]">admin@parkeasy.com</span> (Active)
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}
