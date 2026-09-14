'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { apiBookings } from '@/services/api'
import { Booking } from '@/types'
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  ChevronRight,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  )
}

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'Upcoming' | 'Completed' | 'Cancelled'>('all')
  const [isLoading, setIsLoading] = useState(true)

  const fetchBookings = async () => {
    setIsLoading(true)
    const data = await apiBookings.getUserBookings()
    setBookings(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? A refund will be initiated.')) {
      const res = await apiBookings.cancelBooking(id)
      if (res.success) {
        fetchBookings()
      } else {
        alert(res.message || 'Failed to cancel booking.')
      }
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Upcoming') return b.status === 'Booked' || b.status === 'Confirmed'
    if (activeTab === 'Completed') return b.status === 'Completed'
    if (activeTab === 'Cancelled') return b.status === 'Cancelled'
    return true
  })

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Parking Bookings
          </h1>
          <p className="text-xs text-slate-500">
            View your upcoming, active, completed, and cancelled parking reservations.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'Upcoming', label: 'Upcoming / Active' },
              { id: 'Completed', label: 'Completed' },
              { id: 'Cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">You don't have any bookings yet.</h3>
            <p className="text-xs text-slate-500">
              Find available parking slots near your destination and make a reservation in seconds.
            </p>
            <Link
              href="/find-parking"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20"
            >
              Find Parking Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((b) => {
              const isCancelled = b.status === 'Cancelled'
              const isCompleted = b.status === 'Completed'
              let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
              if (isCancelled) badgeColor = 'bg-red-50 text-red-700 border-red-200'
              if (isCompleted) badgeColor = 'bg-blue-50 text-blue-700 border-blue-200'

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-mono font-bold text-slate-500">{b.bookingReference}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badgeColor}`}>
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{b.parkingLotName || 'ParkEase Location'}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {b.bookingDate} ({b.startTime} - {b.endTime})
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Reserved Slot</span>
                        <span className="font-extrabold text-blue-600">Slot {b.slotNumber || 'A01'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Amount Paid</span>
                        <span className="font-extrabold text-slate-900">₹{b.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {!isCancelled && !isCompleted && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}

                    <Link
                      href={`/my-bookings/${b.id}`}
                      className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      View Ticket <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
