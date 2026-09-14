'use client'

import React, { useEffect, useState } from 'react'
import { apiAdmin } from '@/services/api'
import { BarChart3, TrendingUp, Calendar, DollarSign, Loader2 } from 'lucide-react'

export default function AdminReportsPage() {
  const [reportsData, setReportsData] = useState<any>(null)
  const [range, setRange] = useState('month')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true)
      const res = await apiAdmin.getReports(range)
      if (res.success && res.data) {
        setReportsData(res.data)
      }
      setIsLoading(false)
    }
    loadReports()
  }, [range])

  if (isLoading || !reportsData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Analytics & Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            System Revenue & Usage Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated revenue metrics, booking volume, and average reservation yield.
          </p>
        </div>

        {/* Date Filter */}
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-xs"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-500">Gross Total Revenue</p>
          <p className="text-3xl font-extrabold text-slate-900">₹{reportsData.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-500">Total Completed Bookings</p>
          <p className="text-3xl font-extrabold text-slate-900">{reportsData.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-500">Average Yield Per Booking</p>
          <p className="text-3xl font-extrabold text-slate-900">₹{reportsData.averageBookingValue}</p>
        </div>
      </div>

      {/* Visual Chart Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Revenue & Booking Trends</h3>
        
        <div className="space-y-3 pt-2">
          {reportsData.chartData?.map((item: any, idx: number) => {
            const maxRev = 5000
            const pct = Math.min(100, Math.round((item.revenue / maxRev) * 100))
            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.date}</span>
                  <span>₹{item.revenue} ({item.bookings} Bookings)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
