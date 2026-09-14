'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { QRTicket } from '@/components/QRTicket'
import {
  Calendar,
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
            hourlyRate: 50,
            amount: 100,
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 text-[#172B4D]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner Header */}
        <div className="saas-card p-6 border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">
              RESERVATIONS LEDGER
            </span>
            <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight mt-0.5">My Parking Bookings</h1>
            <p className="text-xs text-[#64748B] mt-1">
              View digital QR tickets, cancel upcoming reservations, or review past sessions.
            </p>
          </div>

          <Link
            href="/book"
            className="h-[40px] px-5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center justify-center"
          >
            + Book New Slot
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 overflow-x-auto">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'active', label: 'Active & Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1769E0] text-white shadow-xs'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="saas-card p-10 text-center border border-[#E2E8F0] space-y-3 max-w-sm mx-auto">
            <Calendar className="size-8 text-[#94A3B8] mx-auto" />
            <h3 className="text-sm font-semibold text-[#0F2747]">No Bookings Found</h3>
            <p className="text-xs text-[#64748B]">
              There are no parking bookings under this category.
            </p>
            <Link
              href="/book"
              className="inline-block px-4 py-2 bg-[#1769E0] text-white font-semibold text-xs rounded-lg shadow-xs"
            >
              Book a Slot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBookings.map((b) => {
              const isCancelled = b.status === 'cancelled'
              const isCompleted = b.status === 'completed'
              let badgeStyle = 'bg-[#ECFDF5] text-[#16A34A] border-[#86EFAC]'

              if (isCancelled) badgeStyle = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
              if (isCompleted) badgeStyle = 'bg-slate-100 text-[#64748B] border-[#CBD5E1]'

              return (
                <div
                  key={b.id}
                  className="saas-card p-5 border border-[#E2E8F0] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                      <span className="text-xs font-mono font-bold text-[#1769E0]">{b.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${badgeStyle}`}>
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-[#0F2747]">Slot {b.slotNumber} ({b.zone || 'Zone A'})</h3>
                      <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3.5 text-[#1769E0]" /> {b.date} @ {b.timeIn} ({b.durationHours || 2} hrs)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#EFF6FF] p-2.5 rounded-lg border border-[#1769E0]/20">
                      <div>
                        <span className="text-[#64748B] text-[10px] block">Vehicle Plate</span>
                        <span className="font-mono font-semibold text-[#0F2747]">{b.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] text-[10px] block">Total Paid</span>
                        <span className="font-semibold text-[#1769E0]">₹{Number(b.amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                    {!isCancelled && !isCompleted && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-2.5 py-1.5 border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-medium rounded-md transition"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="ml-auto px-3.5 py-1.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-md shadow-xs transition flex items-center gap-1.5"
                    >
                      <QrCode className="size-3.5" /> View Ticket
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="saas-card bg-white p-5 rounded-2xl border border-[#E2E8F0] max-w-md w-full shadow-lg relative space-y-3.5 text-center">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <h3 className="text-sm font-bold text-[#0F2747]">Parking Digital Gate Pass</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-md hover:bg-slate-100 text-[#64748B] transition"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <QRTicket
              bookingId={selectedTicket.id}
              slotNumber={selectedTicket.slotNumber}
              vehicleNumber={selectedTicket.vehicleNumber}
              date={selectedTicket.date}
              timeIn={selectedTicket.timeIn}
              amount={selectedTicket.amount}
              zone={selectedTicket.zone}
            />

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2 bg-white border border-[#CBD5E1] text-[#172B4D] hover:bg-[#F8FAFC] font-semibold text-xs rounded-lg transition"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
