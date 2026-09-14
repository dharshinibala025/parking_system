'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { QRTicket } from '@/components/QRTicket'
import {
  Calendar,
  Clock,
  Car,
  ChevronRight,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  QrCode,
  X,
} from 'lucide-react'

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  )
}

function MyBookingsContent() {
  const [bookings, setBookings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all')
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)

  const loadBookings = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('parkease_bookings') || '[]')
      if (stored.length === 0) {
        // Seed initial sample booking for testing
        const sample = [
          {
            id: 'BK-894210',
            slotNumber: 'A101',
            zone: 'Zone A',
            floor: 'Floor 1',
            vehicleType: '4W',
            vehicleNumber: 'KA 01 AB 1234',
            date: '2026-09-15',
            timeIn: '10:00',
            durationHours: 2,
            hourlyRate: 5.0,
            amount: 10.0,
            status: 'active',
            createdAt: new Date().toISOString(),
          },
        ]
        localStorage.setItem('parkease_bookings', JSON.stringify(sample))
        setBookings(sample)
      } else {
        setBookings(stored)
      }
    } catch (e) {}
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking reservation?')) {
      const updated = bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      setBookings(updated)
      localStorage.setItem('parkease_bookings', JSON.stringify(updated))
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'active' || b.status === 'upcoming'
    if (activeTab === 'completed') return b.status === 'completed'
    if (activeTab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Reservations
            </span>
            <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">My Parking Bookings</h1>
            <p className="text-sm text-[#718096] mt-1">
              View digital QR tickets, cancel upcoming reservations, or review past sessions.
            </p>
          </div>

          <Link
            href="/book"
            className="px-6 py-3 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            + Book New Slot
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#D4DDE2] pb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'active', label: 'Active & Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#5C7E8F] text-white shadow-md'
                  : 'bg-[#D4DDE2]/40 text-[#2C3E50] hover:bg-[#D4DDE2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-[#D4DDE2] space-y-4 max-w-md mx-auto">
            <Calendar className="w-10 h-10 text-[#A2A2A2] mx-auto" />
            <h3 className="text-base font-bold text-[#2C3E50]">No Bookings Found</h3>
            <p className="text-xs text-[#718096]">
              There are no parking bookings under this filter category.
            </p>
            <Link
              href="/book"
              className="inline-block px-5 py-2.5 bg-[#5C7E8F] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Book a Slot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((b) => {
              const isCancelled = b.status === 'cancelled'
              const isCompleted = b.status === 'completed'
              let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'

              if (isCancelled) badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200'
              if (isCompleted) badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300'

              return (
                <div
                  key={b.id}
                  className="glass-card rounded-3xl p-6 border border-[#D4DDE2] shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#D4DDE2]/60 pb-3">
                      <span className="text-xs font-mono font-bold text-[#5C7E8F]">{b.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badgeStyle}`}>
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#2C3E50]">Slot {b.slotNumber} ({b.zone || 'Zone A'})</h3>
                      <p className="text-xs font-semibold text-[#718096] mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#5C7E8F]" /> {b.date} @ {b.timeIn} ({b.durationHours || 2} hrs)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#D4DDE2]/30 p-3 rounded-xl border border-[#D4DDE2]">
                      <div>
                        <span className="text-[#718096] text-[10px] block">Vehicle Plate</span>
                        <span className="font-mono font-bold text-[#2C3E50]">{b.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#718096] text-[10px] block">Total Paid</span>
                        <span className="font-bold text-[#5C7E8F]">${Number(b.amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D4DDE2]/60 flex items-center justify-between gap-2">
                    {!isCancelled && !isCompleted && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="ml-auto px-4 py-2 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" /> View Digital QR Ticket
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* QR Code Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white p-8 rounded-3xl border border-[#D4DDE2] max-w-sm w-full shadow-2xl relative space-y-6 text-center">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#718096]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#2C3E50]">Entry/Exit Scanning Pass</h3>
            
            <div className="p-4 bg-white rounded-2xl border border-[#D4DDE2] flex flex-col items-center justify-center">
              <QRTicket
                bookingId={selectedTicket.id}
                slotNumber={selectedTicket.slotNumber}
                vehicleNumber={selectedTicket.vehicleNumber}
                date={selectedTicket.date}
                timeIn={selectedTicket.timeIn}
                amount={selectedTicket.amount}
              />
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl transition"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
