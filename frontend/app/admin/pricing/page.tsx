'use client'

import React, { useEffect, useState } from 'react'
import { apiAdmin } from '@/services/api'
import { PricingConfig } from '@/types'
import { DollarSign, CheckCircle2, Save, Loader2 } from 'lucide-react'

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadPricing() {
      setIsLoading(true)
      const data = await apiAdmin.getPricing()
      setPricing(data)
      setIsLoading(false)
    }
    loadPricing()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pricing) return
    setIsSaving(true)
    setSuccessMsg(null)

    await apiAdmin.updatePricing(pricing)
    setSuccessMsg('Pricing settings updated successfully.')
    setIsSaving(false)
  }

  if (isLoading || !pricing) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      <div>
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Admin Configuration</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Pricing & Rate Configurator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure base hourly rates, platform service fees, taxes, and vehicle category multipliers.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
        
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base Hourly Rate (₹)</label>
              <input
                type="number"
                value={pricing.baseHourlyRate}
                onChange={(e) => setPricing({ ...pricing, baseHourlyRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Platform Service Fee (₹)</label>
              <input
                type="number"
                value={pricing.serviceFee}
                onChange={(e) => setPricing({ ...pricing, serviceFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peak Hour Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={pricing.peakHourMultiplier}
                onChange={(e) => setPricing({ ...pricing, peakHourMultiplier: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weekend Rate Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={pricing.weekendMultiplier}
                onChange={(e) => setPricing({ ...pricing, weekendMultiplier: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving Changes...' : 'Save Pricing Rules'}
            </button>
          </div>
        </form>

      </div>

    </div>
  )
}
