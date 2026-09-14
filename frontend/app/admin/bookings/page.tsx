'use client'

import React, { useState } from 'react'
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  LogIn,
  LogOut,
  RefreshCw,
} from 'lucide-react'

interface BookingRecord {
  id: string
  customerName: string
  customerEmail: string
  slotNumber: string
  zone: string
  vehicleNumber: string
  date: string
  timeIn: string
  durationHours: number
  amount: number
  status: 'active' | 'completed' | 'cancelled' | 'checked_in'
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'BK-894210',
      customerName: 'Arun Kumar',
      customerEmail: 'arun@example.com',
      slotNumber: 'A101',
      zone: 'Zone A',
      vehicleNumber: 'KA 01 AB 1234',
      date: '2026-09-15',
      timeIn: '10:00',
      durationHours: 2,
      amount: 10.0,
      status: 'checked_in',
    },
    {
      id: 'BK-552199',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@example.com',
      slotNumber: 'B201',
      zone: 'Zone B',
      vehicleNumber: 'KA 05 CD 5678',
      date: '2026-09-15',
      timeIn: '11:30',
      durationHours: 4,
      amount: 24.0,
      status: 'active',
    },
    {
      id: 'BK-339102',
      customerName: 'Rahul Verma',
      customerEmail: 'rahul@example.com',
      slotNumber: 'C302',
      zone: 'Zone C',
      vehicleNumber: 'MH 12 EF 9012',
      date: '2026-09-14',
      timeIn: '14:00',
      durationHours: 2,
      amount: 9.0,
      status: 'completed',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const handleManualCheckIn = (id: string) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: 'checked_in' } : b))
    )
  }

  const handleManualCheckOut = (id: string) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: 'completed' } : b))
    )
  }

  const handleCancelAndRefund = (id: string) => {
    if (confirm('Admin Override: Cancel and refund this customer booking?')) {
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      )
    }
  }

  const filtered = bookings.filter((b) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      b.id.toLowerCase().includes(term) ||
      b.customerName.toLowerCase().includes(term) ||
      b.customerEmail.toLowerCase().includes(term) ||
      b.vehicleNumber.toLowerCase().includes(term)
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Customer Bookings Audit
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Booking Management & Check-In</h1>
          <p className="text-sm text-[#718096] mt-1">
            Audit all customer slot reservations, perform manual check-in/check-out, and issue refunds.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-[#D4DDE2] shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A2A2A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ID, customer name, email or plate #..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-xs font-semibold text-[#2C3E50]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-xs font-bold text-[#2C3E50]"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active / Upcoming</option>
          <option value="Checked_In">Checked In</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Ledger Table */}
      <div className="glass-card rounded-3xl border border-[#D4DDE2] shadow-xl p-6 sm:p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#D4DDE2] text-[#718096] font-bold uppercase tracking-wider">
              <th className="py-3 px-3">Booking ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Slot & Zone</th>
              <th className="py-3 px-3">Vehicle Plate</th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Admin Control Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4DDE2]/60">
            {filtered.map((b) => {
              let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300'
              if (b.status === 'checked_in') badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200'
              if (b.status === 'completed') badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300'
              if (b.status === 'cancelled') badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200'

              return (
                <tr key={b.id} className="hover:bg-[#D4DDE2]/20 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#5C7E8F]">{b.id}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-[#2C3E50]">{b.customerName}</p>
                    <p className="text-[10px] text-[#718096]">{b.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#2C3E50]">Slot {b.slotNumber} ({b.zone})</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#2C3E50]">{b.vehicleNumber}</td>
                  <td className="py-3.5 px-3 text-[#718096] font-medium">{b.date} @ {b.timeIn}</td>
                  <td className="py-3.5 px-3 font-bold text-[#5C7E8F]">${b.amount.toFixed(2)}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeStyle}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.status === 'active' && (
                        <button
                          onClick={() => handleManualCheckIn(b.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl shadow-xs transition flex items-center gap-1"
                        >
                          <LogIn className="w-3 h-3" /> Check-In
                        </button>
                      )}

                      {b.status === 'checked_in' && (
                        <button
                          onClick={() => handleManualCheckOut(b.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-xs transition flex items-center gap-1"
                        >
                          <LogOut className="w-3 h-3" /> Check-Out
                        </button>
                      )}

                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          onClick={() => handleCancelAndRefund(b.id)}
                          className="px-3 py-1 border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-xl transition"
                        >
                          Cancel / Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
