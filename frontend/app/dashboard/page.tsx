'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { apiBookings, apiVehicles } from '@/services/api'
import { Booking, Vehicle } from '@/types'
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  TrendingUp,
  Bell,
  Plus,
  ShieldCheck,
  Zap,
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
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      const bData = await apiBookings.getUserBookings()
      const vData = await apiVehicles.getUserVehicles()
      setBookings(bData)
      setVehicles(vData)
      setIsLoading(false)
    }
    loadDashboard()
  }, [])

  const upcomingBookings = bookings.filter((b) => b.status === 'Booked' || b.status === 'Confirmed')
  const completedBookings = bookings.filter((b) => b.status === 'Completed')
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'Successful' || b.paymentStatus === 'PAID')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)

  const activeSpotlight = upcomingBookings[0] || bookings[0]

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Customer Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Welcome back, {user?.name || 'Customer'}!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your active reservations, vehicles, and profile settings.
            </p>
          </div>

          <Link
            href="/find-parking"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 transition shrink-0"
          >
            <Search className="w-4 h-4" /> Find Parking Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Upcoming Bookings</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{upcomingBookings.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed Sessions</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{completedBookings.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Spent</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">₹{totalSpent}</p>
            </div>
          </div>

        </div>

        {/* Spotlight Active Booking Card & Vehicles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Booking Spotlight */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active & Upcoming Reservation</h2>
                <p className="text-xs text-slate-500">Your next scheduled parking session</p>
              </div>
              <Link href="/my-bookings" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeSpotlight ? (
              <div className="bg-blue-50/60 border border-blue-100 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600">{activeSpotlight.bookingReference}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{activeSpotlight.parkingLotName}</h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-extrabold rounded-full self-start sm:self-auto">
                    Slot {activeSpotlight.slotNumber || 'A01'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div>
                    <span className="text-slate-400 block">Date</span>
                    <span className="font-bold text-slate-800">{activeSpotlight.bookingDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Time Slot</span>
                    <span className="font-bold text-slate-800">{activeSpotlight.startTime} - {activeSpotlight.endTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Vehicle</span>
                    <span className="font-bold text-slate-800">{activeSpotlight.vehicleNumber}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/my-bookings/${activeSpotlight.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                  >
                    View Digital Pass QR
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <Car className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No active bookings right now.</p>
                <p className="text-xs text-slate-500">Need a parking spot? Search and reserve in advance.</p>
                <Link href="/find-parking" className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl">
                  Find Parking
                </Link>
              </div>
            )}
          </div>

          {/* Saved Vehicles Widget */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Saved Vehicles</h3>
              <Link href="/vehicles" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </Link>
            </div>

            <div className="space-y-3">
              {vehicles.map((v) => (
                <div key={v.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{v.vehicleNumber}</p>
                      <p className="text-[10px] text-slate-500">{v.vehicleType} • {v.model}</p>
                    </div>
                  </div>
                  {v.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded">DEFAULT</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
