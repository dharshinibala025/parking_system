'use client'

import React, { useState } from 'react'
import { BarChart3, TrendingUp, Calendar, DollarSign, Download, FileText, Sparkles } from 'lucide-react'

export default function AdminReportsPage() {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly')

  const reportData = {
    daily: {
      totalRevenue: '$1,250.00',
      totalBookings: 42,
      averageValue: '$29.76',
      occupancyRate: '75%',
      rows: [
        { date: '2026-09-14 (Today)', bookings: 42, revenue: 1250, occupancy: '75%' },
      ],
    },
    weekly: {
      totalRevenue: '$6,690.00',
      totalBookings: 248,
      averageValue: '$26.97',
      occupancyRate: '68%',
      rows: [
        { date: 'Mon, Sep 08', bookings: 28, revenue: 840, occupancy: '58%' },
        { date: 'Tue, Sep 09', bookings: 32, revenue: 960, occupancy: '66%' },
        { date: 'Wed, Sep 10', bookings: 35, revenue: 1050, occupancy: '72%' },
        { date: 'Thu, Sep 11', bookings: 30, revenue: 900, occupancy: '62%' },
        { date: 'Fri, Sep 12', bookings: 40, revenue: 1200, occupancy: '83%' },
        { date: 'Sat, Sep 13', bookings: 43, revenue: 1290, occupancy: '89%' },
        { date: 'Sun, Sep 14', bookings: 40, revenue: 450, occupancy: '65%' },
      ],
    },
    monthly: {
      totalRevenue: '$28,450.00',
      totalBookings: 1020,
      averageValue: '$27.89',
      occupancyRate: '72%',
      rows: [
        { date: 'Week 1', bookings: 220, revenue: 6160, occupancy: '65%' },
        { date: 'Week 2', bookings: 260, revenue: 7280, occupancy: '70%' },
        { date: 'Week 3', bookings: 280, revenue: 7840, occupancy: '75%' },
        { date: 'Week 4', bookings: 260, revenue: 7170, occupancy: '78%' },
      ],
    },
  }

  const current = reportData[range]

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Date/Period,Bookings Count,Revenue ($),Occupancy Rate\n'
    current.rows.forEach((row) => {
      csvContent += `${row.date},${row.bookings},${row.revenue},${row.occupancy}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ParkEase_Report_${range}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    alert(`PDF Report for ParkEase (${range.toUpperCase()}) generated and downloaded successfully.`)
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Intelligence & Exports
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Revenue & Occupancy Reports</h1>
          <p className="text-sm text-[#718096] mt-1">
            Analyze daily, weekly, and monthly system yield, occupancy rates, and export CSV/PDF reports.
          </p>
        </div>

        {/* View Filter & Export Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-[#D4DDE2] p-1 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  range === r ? 'bg-[#5C7E8F] text-white' : 'text-[#718096] hover:text-[#2C3E50]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-white border border-[#D4DDE2] text-[#2C3E50] hover:bg-[#D4DDE2]/40 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase text-[#718096]">Gross Revenue</p>
          <p className="text-3xl font-black text-[#5C7E8F]">{current.totalRevenue}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase text-[#718096]">Total Bookings</p>
          <p className="text-3xl font-black text-[#2C3E50]">{current.totalBookings}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase text-[#718096]">Average Booking Yield</p>
          <p className="text-3xl font-black text-[#2C3E50]">{current.averageValue}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase text-[#718096]">Average Occupancy Rate</p>
          <p className="text-3xl font-black text-emerald-600">{current.occupancyRate}</p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="glass-card rounded-3xl border border-[#D4DDE2] shadow-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#2C3E50]">Report Breakdown Table</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D4DDE2] text-[#718096] font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Time Period</th>
                <th className="py-3 px-3">Completed Bookings</th>
                <th className="py-3 px-3">Revenue ($)</th>
                <th className="py-3 px-3">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4DDE2]/60">
              {current.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#D4DDE2]/20 transition">
                  <td className="py-3.5 px-3 font-bold text-[#2C3E50]">{row.date}</td>
                  <td className="py-3.5 px-3 font-medium text-[#718096]">{row.bookings} Bookings</td>
                  <td className="py-3.5 px-3 font-bold text-[#5C7E8F]">${row.revenue.toFixed(2)}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-700">{row.occupancy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
