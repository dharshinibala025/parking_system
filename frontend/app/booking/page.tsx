'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { apiParking, apiSlots, apiVehicles } from '@/services/api'
import { ParkingLot, ParkingSlot, Vehicle } from '@/types'
import {
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Plus,
  Loader2,
} from 'lucide-react'

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }>
        <BookingContent />
      </Suspense>
    </ProtectedRoute>
  )
}

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lotId = searchParams.get('lotId') || 'lot-1'

  const [lot, setLot] = useState<ParkingLot | null>(null)
  const [slots, setSlots] = useState<ParkingSlot[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const [bookingDate, setBookingDate] = useState('2026-09-14')
  const [startTime, setStartTime] = useState('14:00')
  const [endTime, setEndTime] = useState('16:00')
  const [selectedFloor, setSelectedFloor] = useState('Ground Floor')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBookingData() {
      setIsLoading(true)
      const lotData = await apiParking.getParkingLotById(lotId)
      const slotsData = await apiSlots.getSlotsForLot(lotId)
      const userVehicles = await apiVehicles.getUserVehicles()

      setLot(lotData)
      setSlots(slotsData)
      setVehicles(userVehicles)

      if (userVehicles.length > 0) {
        const defaultV = userVehicles.find((v) => v.isDefault) || userVehicles[0]
        setSelectedVehicle(defaultV)
      }

      // Auto-select first available slot
      const firstAvailable = slotsData.find((s) => s.status === 'Available' || s.status === 'AVAILABLE')
      if (firstAvailable) setSelectedSlot(firstAvailable)

      setIsLoading(false)
    }

    loadBookingData()
  }, [lotId])

  // Calculate duration and price breakdown
  const calculateDuration = () => {
    try {
      const s = new Date(`2026-09-14T${startTime}`)
      const e = new Date(`2026-09-14T${endTime}`)
      const diff = e.getTime() - s.getTime()
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60)))
    } catch (err) {
      return 2
    }
  }

  const durationHours = calculateDuration()
  const hourlyRate = lot?.pricePerHour || 50
  const parkingFee = durationHours * hourlyRate
  const serviceFee = 10
  const tax = Math.round(parkingFee * 0.05)
  const totalAmount = parkingFee + serviceFee + tax

  const handleProceedToPayment = () => {
    if (!selectedSlot) {
      alert('Please select a parking slot before proceeding.')
      return
    }
    if (!selectedVehicle) {
      alert('Please select or add a vehicle.')
      return
    }

    // Save transient draft booking to sessionStorage
    const draftBooking = {
      parkingLotId: lot?.id,
      parkingLotName: lot?.name,
      parkingLotAddress: lot?.address,
      parkingSlotId: selectedSlot.id,
      slotNumber: selectedSlot.slotNumber,
      vehicleId: selectedVehicle.id,
      vehicleNumber: selectedVehicle.vehicleNumber,
      bookingDate,
      startTime,
      endTime,
      durationHours,
      parkingFee,
      serviceFee,
      tax,
      totalAmount,
    }

    sessionStorage.setItem('parkease_draft_booking', JSON.stringify(draftBooking))
    router.push('/booking/payment')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/parking/${lotId}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to Parking Details
          </Link>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            Step 1 of 2: Slot & Summary
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Slot Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              
              <div>
                <h2 className="text-lg font-bold text-slate-900">Select Parking Slot</h2>
                <p className="text-xs text-slate-500">
                  Tap any available green slot to reserve your preferred parking bay.
                </p>
              </div>

              {/* Floor Selector */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                {['Ground Floor', 'First Floor'].map((flr) => (
                  <button
                    key={flr}
                    onClick={() => setSelectedFloor(flr)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      selectedFloor === flr
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {flr}
                  </button>
                ))}
              </div>

              {/* Visual Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-400"></div> Available
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-3.5 h-3.5 rounded bg-blue-600"></div> Selected
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-3.5 h-3.5 rounded bg-slate-300"></div> Occupied
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-3.5 h-3.5 rounded bg-amber-200"></div> Reserved
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-3.5 h-3.5 rounded bg-red-200"></div> Maintenance
                </div>
              </div>

              {/* Slot Layout Grid */}
              <div className="space-y-4 pt-2">
                {['A', 'B'].map((sec) => {
                  const secSlots = slots.filter((s) => s.section === sec)
                  return (
                    <div key={sec} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-2.5">SECTION {sec}</p>
                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                        {secSlots.map((s) => {
                          const isSel = selectedSlot?.id === s.id
                          const isOcc = ['Occupied', 'OCCUPIED'].includes(s.status)
                          const isMaint = ['Maintenance', 'MAINTENANCE', 'Disabled'].includes(s.status)
                          const isRes = ['Reserved', 'RESERVED'].includes(s.status)

                          let btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          if (isSel) btnStyle = 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-200 shadow-md'
                          else if (isOcc) btnStyle = 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                          else if (isMaint) btnStyle = 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed'
                          else if (isRes) btnStyle = 'bg-amber-100 text-amber-600 border-amber-300 cursor-not-allowed'

                          return (
                            <button
                              key={s.id}
                              disabled={isOcc || isMaint || isRes}
                              onClick={() => setSelectedSlot(s)}
                              className={`p-3 rounded-2xl border text-center font-bold transition flex flex-col items-center justify-center ${btnStyle}`}
                            >
                              <span className="text-[10px] opacity-80 font-normal">Bay</span>
                              <span className="text-sm">{s.slotNumber}</span>
                              {s.slotType === 'EV' && <span className="text-[9px] font-bold text-purple-600 mt-0.5">EV</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Selected Slot Highlight Banner */}
              {selectedSlot && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
                  <div>
                    <span className="font-bold">Selected Slot: </span>
                    <span className="bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded text-xs">
                      {selectedSlot.slotNumber}
                    </span>
                    <span className="text-slate-500 ml-2">Section {selectedSlot.section}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{lot?.pricePerHour || 50}/hour</span>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Booking Configuration & Price Breakdown */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-5">
              
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Booking Summary
              </h2>

              {/* Date & Time Selectors */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Select Vehicle</label>
                  <Link href="/vehicles" className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                    <Plus className="w-3 h-3" /> Manage Vehicles
                  </Link>
                </div>

                {vehicles.length > 0 ? (
                  <select
                    value={selectedVehicle?.id || ''}
                    onChange={(e) => {
                      const v = vehicles.find((veh) => veh.id === e.target.value)
                      if (v) setSelectedVehicle(v)
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} ({v.vehicleType} - {v.model})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    No vehicles found. Please add a vehicle in your account.
                  </div>
                )}
              </div>

              {/* Configurable Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <p className="font-bold text-slate-800 border-b border-slate-200/60 pb-1.5">Price Breakdown</p>
                <div className="flex justify-between text-slate-600">
                  <span>Parking Fee ({durationHours} hrs × ₹{hourlyRate})</span>
                  <span className="font-semibold text-slate-900">₹{parkingFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Service Fee</span>
                  <span className="font-semibold text-slate-900">₹{serviceFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-slate-900">₹{tax}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                Proceed to Payment <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
