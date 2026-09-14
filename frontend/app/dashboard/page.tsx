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
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1769E0] text-[12px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2747] tracking-tight">
              Welcome back, {user?.name || 'Customer'}!
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Manage your active parking reservations, digital QR tickets, and profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="px-5 py-2.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[14px] rounded-lg shadow-xs transition flex items-center gap-2"
            >
              <span>Book New Slot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase text-[#64748B] tracking-wider">Active Bookings</p>
              <p className="text-2xl font-bold text-[#0F2747] mt-0.5">{upcomingCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase text-[#64748B] tracking-wider">Completed Sessions</p>
              <p className="text-2xl font-bold text-[#0F2747] mt-0.5">{completedCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase text-[#64748B] tracking-wider">Total Amount Spent</p>
              <p className="text-2xl font-bold text-[#1769E0] mt-0.5">₹{totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Active Booking Spotlight & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active Booking Spotlight */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-[17px] font-bold text-[#0F2747]">Current / Upcoming Reservation</h2>
                <p className="text-[13px] text-[#64748B]">Your active digital QR entry pass</p>
              </div>
              <Link href="/my-bookings" className="text-[13px] font-semibold text-[#1769E0] hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {activeBooking ? (
              <div className="bg-[#EFF6FF]/50 border border-[#E2E8F0] p-5 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[12px] font-mono font-semibold text-[#1769E0]">ID: {activeBooking.id}</span>
                    <h3 className="text-lg font-bold text-[#0F2747] mt-0.5">Slot {activeBooking.slotNumber} ({activeBooking.zone || 'Zone A'})</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#1769E0] text-white text-[12px] font-semibold rounded-md self-start sm:self-auto">
                    {activeBooking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px] pt-1">
                  <div>
                    <span className="text-[#64748B] block text-[12px]">Date:</span>
                    <span className="font-semibold text-[#172B4D]">{activeBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[12px]">Time-In:</span>
                    <span className="font-semibold text-[#172B4D]">{activeBooking.timeIn}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[12px]">Vehicle Plate:</span>
                    <span className="font-mono font-semibold text-[#172B4D]">{activeBooking.vehicleNumber}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/my-bookings"
                    className="px-4 py-2 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg transition flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" /> View Digital Pass
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
                <Car className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <p className="text-[15px] font-semibold text-[#0F2747]">No active bookings right now.</p>
                <p className="text-[13px] text-[#64748B]">Select a slot on our interactive map and reserve in seconds.</p>
                <Link href="/book" className="inline-block px-5 py-2.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[14px] rounded-lg shadow-xs">
                  Book a Slot Now
                </Link>
              </div>
            )}
          </div>

          {/* Quick Customer Actions */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h3 className="text-[16px] font-bold text-[#0F2747]">Quick Actions</h3>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/book"
                className="w-full p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] flex items-center justify-between text-[14px] font-medium text-[#172B4D] transition"
              >
                <span className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-[#1769E0]" /> Book Parking Slot
                </span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>

              <Link
                href="/my-bookings"
                className="w-full p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] flex items-center justify-between text-[14px] font-medium text-[#172B4D] transition"
              >
                <span className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#1769E0]" /> Booking History & Passes
                </span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>

              <Link
                href="/profile"
                className="w-full p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] flex items-center justify-between text-[14px] font-medium text-[#172B4D] transition"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#1769E0]" /> Profile & Vehicles
                </span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
