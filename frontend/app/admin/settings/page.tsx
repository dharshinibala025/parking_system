'use client'

import React, { useState } from 'react'
import { Settings, Save, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [cancellationFee, setCancellationFee] = useState(0)
  const [allowInstantRefunds, setAllowInstantRefunds] = useState(true)
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(30)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('System settings saved successfully.')
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Control</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          System & Cancellation Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure platform cancellation rules, booking advance windows, and notification triggers.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
        
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cancellation Charge (₹)</label>
            <input
              type="number"
              value={cancellationFee}
              onChange={(e) => setCancellationFee(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Max Advance Reservation Window (Days)</label>
            <input
              type="number"
              value={maxAdvanceDays}
              onChange={(e) => setMaxAdvanceDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="refunds"
              checked={allowInstantRefunds}
              onChange={(e) => setAllowInstantRefunds(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
            <label htmlFor="refunds" className="font-semibold text-slate-700">Enable Instant Automated Wallet Refunds on Cancellation</label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        </form>

      </div>

    </div>
  )
}
