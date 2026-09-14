'use client'

import React, { useEffect, useState } from 'react'
import { apiBookings } from '@/services/api'
import { Booking } from '@/types'
import { CalendarCheck, Search, Filter, Loader2, XCircle, CheckCircle2 } from 'lucide-react'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchBookings = async () => {
    setIsLoading(true)
    const res = await apiBookings.getAllBookingsAdmin()
    if (res.success && res.data) {
      setBookings(res.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id: string) => {
    if (confirm('Admin Override: Cancel this booking?')) {
      await apiBookings.cancelBooking(id)
      fetchBookings()
    }
  }

  const filtered = bookings.filter((b) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      b.bookingReference.toLowerCase().includes(term) ||
      (b.userName && b.userName.toLowerCase().includes(term)) ||
      (b.parkingLotName && b.parkingLotName.toLowerCase().includes(term))
    const matchesStatus = !statusFilter || b.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Admin Control</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Bookings Ledger & Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, inspect, and manage active and historical customer reservations.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking reference or customer name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
        >
          <option value="">All Booking Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Parking Location</th>
                <th className="py-3 px-3">Slot</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">{b.bookingReference}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{b.userName || b.userEmail || 'Customer'}</td>
                  <td className="py-3 px-3 text-slate-700">{b.parkingLotName}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">Slot {b.slotNumber || 'A01'}</td>
                  <td className="py-3 px-3 text-slate-600">{b.bookingDate} ({b.startTime} - {b.endTime})</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{b.totalAmount}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {b.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
