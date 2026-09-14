'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Plus,
  ArrowRight,
  QrCode,
} from 'lucide-react'

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute>
      <CustomerDashboardContent />
    </ProtectedRoute>
  )
}

function CustomerDashboardContent() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])

  useEffect(() => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('parkease_bookings') || '[]')
      const storedVehicles = JSON.parse(localStorage.getItem('parkease_vehicles') || '[]')
      setBookings(storedBookings)
      setVehicles(storedVehicles)
    } catch (e) {}
  }, [])

  const activeBooking = bookings.find((b) => b.status === 'active') || bookings[0]
  const upcomingCount = bookings.filter((b) => b.status === 'active').length
  const completedCount = bookings.filter((b) => b.status === 'completed').length
  const totalSpent = bookings.reduce((acc, b) => acc + (b.amount || 0), 0)

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Dashboard
            </span>
            <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">
              Welcome back, {user?.name || 'Customer'}!
            </h1>
            <p className="text-sm text-[#718096] mt-1">
              Manage your active reservations, digital QR tickets, and profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="px-6 py-3.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <span>Book New Slot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#5C7E8F]/10 text-[#5C7E8F] flex items-center justify-center shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[#718096] tracking-wider">Active Bookings</p>
              <p className="text-3xl font-black text-[#2C3E50] mt-0.5">{upcomingCount}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[#718096] tracking-wider">Completed Sessions</p>
              <p className="text-3xl font-black text-[#2C3E50] mt-0.5">{completedCount}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4DDE2] text-[#5C7E8F] flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[#718096] tracking-wider">Total Amount Spent</p>
              <p className="text-3xl font-black text-[#5C7E8F] mt-0.5">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Active Booking Spotlight & Quick Vehicles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Booking Spotlight */}
          <div className="lg:col-span-8 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4DDE2]/60 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#2C3E50]">Current / Upcoming Reservation</h2>
                <p className="text-xs text-[#718096]">Your active digital QR entry pass</p>
              </div>
              <Link href="/my-bookings" className="text-xs font-bold text-[#5C7E8F] hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {activeBooking ? (
              <div className="bg-[#D4DDE2]/30 border border-[#D4DDE2] p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#5C7E8F]">ID: {activeBooking.id}</span>
                    <h3 className="text-xl font-black text-[#2C3E50] mt-0.5">Slot {activeBooking.slotNumber} ({activeBooking.zone || 'Zone A'})</h3>
                  </div>
                  <span className="px-3.5 py-1 bg-[#5C7E8F] text-white text-xs font-bold rounded-full self-start sm:self-auto">
                    {activeBooking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div>
                    <span className="text-[#718096] block">Date:</span>
                    <span className="font-bold text-[#2C3E50]">{activeBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[#718096] block">Time-In:</span>
                    <span className="font-bold text-[#2C3E50]">{activeBooking.timeIn}</span>
                  </div>
                  <div>
                    <span className="text-[#718096] block">Vehicle Plate:</span>
                    <span className="font-mono font-bold text-[#2C3E50]">{activeBooking.vehicleNumber}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/my-bookings"
                    className="px-4 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" /> View Digital Ticket Pass
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#D4DDE2]/20 rounded-2xl border border-[#D4DDE2] space-y-3">
                <Car className="w-8 h-8 text-[#A2A2A2] mx-auto" />
                <p className="text-sm font-bold text-[#2C3E50]">No active bookings right now.</p>
                <p className="text-xs text-[#718096]">Select a slot on our interactive map and reserve in seconds.</p>
                <Link href="/book" className="inline-block px-5 py-2.5 bg-[#5C7E8F] text-white font-bold text-xs rounded-xl shadow-xs">
                  Book a Slot Now
                </Link>
              </div>
            )}
          </div>

          {/* Customer Shortcuts & Saved Vehicles */}
          <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
            <div className="border-b border-[#D4DDE2]/60 pb-3">
              <h3 className="text-base font-bold text-[#2C3E50]">Quick Customer Actions</h3>
            </div>

            <div className="space-y-3">
              <Link
                href="/book"
                className="w-full p-3.5 rounded-2xl bg-white border border-[#D4DDE2] hover:border-[#5C7E8F] flex items-center justify-between text-xs font-bold text-[#2C3E50] transition shadow-xs"
              >
                <span className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-[#5C7E8F]" /> Book Parking Slot
                </span>
                <ChevronRight className="w-4 h-4 text-[#A2A2A2]" />
              </Link>

              <Link
                href="/my-bookings"
                className="w-full p-3.5 rounded-2xl bg-white border border-[#D4DDE2] hover:border-[#5C7E8F] flex items-center justify-between text-xs font-bold text-[#2C3E50] transition shadow-xs"
              >
                <span className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#5C7E8F]" /> Booking History & Passes
                </span>
                <ChevronRight className="w-4 h-4 text-[#A2A2A2]" />
              </Link>

              <Link
                href="/profile"
                className="w-full p-3.5 rounded-2xl bg-white border border-[#D4DDE2] hover:border-[#5C7E8F] flex items-center justify-between text-xs font-bold text-[#2C3E50] transition shadow-xs"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#5C7E8F]" /> Manage Profile & Vehicles
                </span>
                <ChevronRight className="w-4 h-4 text-[#A2A2A2]" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
