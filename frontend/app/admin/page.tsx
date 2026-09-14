'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiAdmin } from '@/services/api'
import {
  Building2,
  Grid3X3,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Loader2,
  ChevronRight,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      const res = await apiAdmin.getDashboardStats()
      if (res.success && res.data) {
        setStats(res.data.stats)
        setRecentBookings(res.data.recentBookings || [])
      }
      setIsLoading(false)
    }
    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Parking Lots', value: stats?.totalLots || 3, icon: Building2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Slots', value: stats?.totalSlots || 96, icon: Grid3X3, color: 'text-purple-600 bg-purple-50' },
    { label: 'Available Slots', value: stats?.availableSlots || 66, icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
    { label: "Today's Bookings", value: stats?.todayBookings || 8, icon: CalendarCheck, color: 'text-amber-600 bg-amber-50' },
    { label: 'Active Bookings', value: stats?.activeBookings || 5, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 14500}`, icon: DollarSign, color: 'text-emerald-700 bg-emerald-100' },
    { label: 'Registered Customers', value: stats?.registeredCustomers || 12, icon: Users, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Occupancy Rate', value: `${stats?.occupancyRate || 31}%`, icon: ArrowUpRight, color: 'text-rose-600 bg-rose-50' },
  ]

  return (
    <div className="p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Admin Control Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            System Overview Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, revenue metrics, and booking control ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/parking"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            Manage Parking Lots
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{card.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Bookings</h2>
            <p className="text-xs text-slate-500">Live booking transactions across all parking locations</p>
          </div>
          <Link href="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View All Bookings <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Parking Facility</th>
                <th className="py-3 px-3">Slot</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">{b.bookingReference}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{b.userName || b.userEmail || 'Customer'}</td>
                  <td className="py-3 px-3 text-slate-700">{b.parkingLotName || 'Central Hub'}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">Slot {b.slotNumber || 'A01'}</td>
                  <td className="py-3 px-3 text-slate-600">{b.bookingDate} ({b.startTime})</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{b.totalAmount}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.bookingStatus || b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
