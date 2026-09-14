'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { apiParking } from '@/services/api'
import { ParkingLot } from '@/types'
import {
  MapPin,
  Clock,
  Star,
  Shield,
  Zap,
  Car,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Share2,
} from 'lucide-react'

export default function ParkingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [lot, setLot] = useState<ParkingLot | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (id) {
        const data = await apiParking.getParkingLotById(id)
        setLot(data)
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Parking Lot Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested parking facility could not be located.</p>
        <Link href="/find-parking" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Back to Find Parking
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Banner Bar */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/find-parking" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to Search Results
          </Link>

          <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Details Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Header & Image */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
              <div className="relative h-72 sm:h-96 w-full">
                <img src={lot.image} alt={lot.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold text-slate-800 shadow-md">
                  {lot.parkingType} Facility
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-sm font-extrabold shadow-lg">
                  ₹{lot.pricePerHour}/hr
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {lot.name}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-600" /> {lot.address}, {lot.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-200 text-sm font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {lot.rating} / 5.0
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{lot.description}</p>
                </div>

                {/* Opening Hours & Vehicle Compatibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Operating Hours</p>
                      <p className="text-xs font-bold text-slate-900">{lot.openingTime} - {lot.closingTime}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Car className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Available Slots</p>
                      <p className="text-xs font-bold text-emerald-700">{lot.availableSlots} of {lot.totalSlots} Slots Free</p>
                    </div>
                  </div>
                </div>

                {/* Amenities list */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">Facility Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {lot.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs font-semibold text-blue-900">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Booking Summary & Action Sidebar */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <p className="text-xs text-slate-500 font-medium">Reservation Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹{lot.pricePerHour}</span>
                  <span className="text-xs text-slate-500 font-normal">/ hour</span>
                </div>
              </div>

              {/* Status info */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Slots Currently Available
                </p>
                <p className="text-[11px] text-emerald-700">
                  {lot.availableSlots} open parking bays ready for instant reservation.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push(`/booking?lotId=${lot.id}`)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                Select Parking Slot <ChevronRight className="w-5 h-5" />
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Free cancellation up to 30 minutes before booking start time.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
