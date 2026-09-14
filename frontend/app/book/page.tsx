'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { QRTicket } from '@/components/QRTicket'
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
  Sparkles,
  CreditCard,
  Check,
  QrCode,
} from 'lucide-react'

interface Slot {
  id: string
  slotNumber: string
  zone: string
  floor: string
  vehicleType: '2W' | '4W'
  hourlyRate: number
  status: 'available' | 'occupied' | 'maintenance'
}

export default function BookSlotPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-[#D4DDE2] border-t-[#5C7E8F] rounded-full animate-spin" />
        </div>
      }>
        <BookSlotContent />
      </Suspense>
    </ProtectedRoute>
  )
}

function BookSlotContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const preselectedSlotCode = searchParams.get('slot') || 'A101'

  // Master Slots Registry
  const [slots] = useState<Slot[]>([
    { id: 's1', slotNumber: 'A101', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'available' },
    { id: 's2', slotNumber: 'A102', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'occupied' },
    { id: 's3', slotNumber: 'A103', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'available' },
    { id: 's4', slotNumber: 'A104', zone: 'Zone A', floor: 'Floor 1', vehicleType: '2W', hourlyRate: 3.0, status: 'available' },
    { id: 's5', slotNumber: 'A105', zone: 'Zone A', floor: 'Floor 1', vehicleType: '2W', hourlyRate: 3.0, status: 'occupied' },
    { id: 's6', slotNumber: 'A106', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'maintenance' },

    { id: 's7', slotNumber: 'B201', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 6.0, status: 'available' },
    { id: 's8', slotNumber: 'B202', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 6.0, status: 'occupied' },
    { id: 's9', slotNumber: 'B203', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 6.0, status: 'available' },
    { id: 's10', slotNumber: 'B204', zone: 'Zone B', floor: 'Floor 2', vehicleType: '2W', hourlyRate: 3.5, status: 'available' },

    { id: 's11', slotNumber: 'C301', zone: 'Zone C', floor: 'Floor 3', vehicleType: '4W', hourlyRate: 4.5, status: 'available' },
    { id: 's12', slotNumber: 'C302', zone: 'Zone C', floor: 'Floor 3', vehicleType: '2W', hourlyRate: 2.5, status: 'available' },
  ])

  const [selectedSlot, setSelectedSlot] = useState<Slot>(() => {
    return slots.find((s) => s.slotNumber === preselectedSlotCode && s.status === 'available') || slots[0]
  })

  // Filters
  const [filterZone, setFilterZone] = useState<string>('All')
  const [filterType, setFilterType] = useState<string>('All')

  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>('2026-09-15')
  const [timeIn, setTimeIn] = useState<string>('10:00')
  const [durationHours, setDurationHours] = useState<number>(2)
  const [vehicleNumber, setVehicleNumber] = useState<string>('KA 01 AB 1234')

  // Payment & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null)

  // Cost calculation
  const totalCost = selectedSlot ? selectedSlot.hourlyRate * durationHours : 0

  const filteredSlots = slots.filter((slot) => {
    if (filterZone !== 'All' && slot.zone !== filterZone) return false
    if (filterType !== 'All' && slot.vehicleType !== filterType) return false
    return true
  })

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    setIsProcessing(true)

    setTimeout(() => {
      const newBooking = {
        id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: user?.name || 'Customer',
        customerEmail: user?.email || 'customer@example.com',
        slotId: selectedSlot.id,
        slotNumber: selectedSlot.slotNumber,
        zone: selectedSlot.zone,
        floor: selectedSlot.floor,
        vehicleType: selectedSlot.vehicleType,
        vehicleNumber: vehicleNumber.toUpperCase(),
        date: bookingDate,
        timeIn,
        durationHours,
        hourlyRate: selectedSlot.hourlyRate,
        amount: totalCost,
        status: 'active',
        qrCodeValue: `PARKEASE:${selectedSlot.slotNumber}:${vehicleNumber}:${bookingDate}`,
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      try {
        const existingBookings = JSON.parse(localStorage.getItem('parkease_bookings') || '[]')
        existingBookings.unshift(newBooking)
        localStorage.setItem('parkease_bookings', JSON.stringify(existingBookings))
      } catch (err) {}

      setIsProcessing(false)
      setConfirmedBooking(newBooking)
    }, 1200)
  }

  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-[#D4DDE2] shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                Booking Confirmed & Paid
              </span>
              <h1 className="text-3xl font-black text-[#2C3E50]">Spot Reserved Successfully!</h1>
              <p className="text-xs text-[#718096] mt-1">
                Booking ID: <span className="font-mono font-bold text-[#5C7E8F]">{confirmedBooking.id}</span>
              </p>
            </div>

            {/* QR Code Ticket */}
            <div className="p-6 bg-white rounded-2xl border border-[#D4DDE2] shadow-inner flex flex-col items-center">
              <QRTicket
                bookingId={confirmedBooking.id}
                slotNumber={confirmedBooking.slotNumber}
                vehicleNumber={confirmedBooking.vehicleNumber}
                date={confirmedBooking.date}
                timeIn={confirmedBooking.timeIn}
                amount={confirmedBooking.amount}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-left bg-[#D4DDE2]/30 p-4 rounded-xl border border-[#D4DDE2]">
              <div>
                <p className="text-[#718096]">Slot Reserved:</p>
                <p className="font-bold text-[#2C3E50]">{confirmedBooking.slotNumber} ({confirmedBooking.zone})</p>
              </div>
              <div>
                <p className="text-[#718096]">Vehicle Plate:</p>
                <p className="font-mono font-bold text-[#2C3E50]">{confirmedBooking.vehicleNumber}</p>
              </div>
              <div>
                <p className="text-[#718096]">Date & Time:</p>
                <p className="font-bold text-[#2C3E50]">{confirmedBooking.date} @ {confirmedBooking.timeIn}</p>
              </div>
              <div>
                <p className="text-[#718096]">Total Paid:</p>
                <p className="font-bold text-[#5C7E8F]">${confirmedBooking.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/my-bookings"
                className="flex-1 py-3 px-4 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-sm rounded-xl transition shadow-md text-center"
              >
                View My Bookings
              </Link>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="flex-1 py-3 px-4 bg-white border border-[#D4DDE2] text-[#2C3E50] hover:bg-[#D4DDE2]/40 font-bold text-sm rounded-xl transition text-center"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Booking Portal
            </span>
            <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Book Your Parking Slot</h1>
            <p className="text-sm text-[#718096] mt-1">
              Select a color-coded slot, specify duration, and generate your instant QR entry ticket.
            </p>
          </div>

          <Link
            href="/my-bookings"
            className="px-5 py-2.5 bg-white border border-[#D4DDE2] text-[#5C7E8F] hover:bg-[#D4DDE2]/40 font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Clock className="w-4 h-4" /> View My Bookings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: VISUAL SLOT SELECTION GRID */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4DDE2]/60">
                <div>
                  <h2 className="text-lg font-bold text-[#2C3E50]">Interactive Slot Selection Map</h2>
                  <p className="text-xs text-[#718096]">Tap any green slot to choose your parking space.</p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-3">
                  <select
                    value={filterZone}
                    onChange={(e) => setFilterZone(e.target.value)}
                    className="bg-white border border-[#D4DDE2] rounded-xl px-3 py-1.5 text-xs font-bold text-[#2C3E50]"
                  >
                    <option value="All">All Zones</option>
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone C">Zone C</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white border border-[#D4DDE2] rounded-xl px-3 py-1.5 text-xs font-bold text-[#2C3E50]"
                  >
                    <option value="All">All Types</option>
                    <option value="4W">4W (Car)</option>
                    <option value="2W">2W (Bike)</option>
                  </select>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs font-bold bg-[#D4DDE2]/30 p-3 rounded-2xl border border-[#D4DDE2]">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Available
                </span>
                <span className="flex items-center gap-1 text-[#5C7E8F]">
                  <span className="w-3 h-3 rounded-full bg-[#5C7E8F]" /> Selected
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-3 h-3 rounded-full bg-rose-500" /> Occupied
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-[#A2A2A2]" /> Maintenance
                </span>
              </div>

              {/* Slot Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredSlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id
                  const isAvailable = slot.status === 'available'
                  const isOccupied = slot.status === 'occupied'
                  const isMaint = slot.status === 'maintenance'

                  let btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  let labelText = 'Free'

                  if (isSelected) {
                    btnStyle = 'bg-[#5C7E8F] text-white border-[#4A6776] shadow-md ring-2 ring-[#5C7E8F]/40'
                    labelText = 'Selected'
                  } else if (isOccupied) {
                    btnStyle = 'bg-rose-50 text-rose-800 border-rose-200 opacity-60 cursor-not-allowed'
                    labelText = 'Occupied'
                  } else if (isMaint) {
                    btnStyle = 'bg-slate-100 text-slate-500 border-slate-300 opacity-60 cursor-not-allowed'
                    labelText = 'Maint.'
                  }

                  return (
                    <button
                      key={slot.id}
                      disabled={!isAvailable && !isSelected}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-2xl border text-center font-bold transition flex flex-col justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-base">{slot.slotNumber}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/80 border border-current">
                          {slot.vehicleType}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium opacity-80">{slot.zone}</p>
                      <div className="mt-2 pt-2 border-t border-current/20 flex items-center justify-between text-[11px]">
                        <span>${slot.hourlyRate.toFixed(2)}/hr</span>
                        <span className="font-extrabold">{labelText}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Selected Slot Indicator Banner */}
              {selectedSlot && (
                <div className="p-4 rounded-2xl bg-[#5C7E8F]/10 border border-[#5C7E8F]/30 flex items-center justify-between text-xs text-[#2C3E50]">
                  <div>
                    <span className="font-bold">Active Selected Slot: </span>
                    <span className="bg-[#5C7E8F] text-white font-extrabold px-2.5 py-1 rounded-lg text-xs ml-1">
                      {selectedSlot.slotNumber}
                    </span>
                    <span className="text-[#718096] ml-2">({selectedSlot.zone} • {selectedSlot.vehicleType})</span>
                  </div>
                  <span className="font-bold text-[#5C7E8F] text-sm">${selectedSlot.hourlyRate.toFixed(2)} / hour</span>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT: BOOKING CONFIGURATION FORM & PRICE ESTIMATOR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
              
              <div className="pb-4 border-b border-[#D4DDE2]/60">
                <h2 className="text-lg font-bold text-[#2C3E50]">Reservation Details</h2>
                <p className="text-xs text-[#718096]">Configure your parking time & vehicle info</p>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Vehicle Plate Input */}
                <div>
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Vehicle License Plate Number
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A2A2A2]" />
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="KA 01 AB 1234"
                      className="w-full bg-white border border-[#D4DDE2] rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-[#2C3E50] uppercase focus:ring-2 focus:ring-[#5C7E8F]"
                      required
                    />
                  </div>
                </div>

                {/* Booking Date */}
                <div>
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Parking Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A2A2A2]" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white border border-[#D4DDE2] rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                      required
                    />
                  </div>
                </div>

                {/* Time-In & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                      Time-In
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A2A2A2]" />
                      <input
                        type="time"
                        value={timeIn}
                        onChange={(e) => setTimeIn(e.target.value)}
                        className="w-full bg-white border border-[#D4DDE2] rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                      Duration
                    </label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full bg-white border border-[#D4DDE2] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours</option>
                      <option value={3}>3 Hours</option>
                      <option value={4}>4 Hours</option>
                      <option value={8}>8 Hours (Full Day)</option>
                    </select>
                  </div>
                </div>

                {/* Cost Calculation Summary Box */}
                <div className="bg-[#D4DDE2]/30 p-5 rounded-2xl border border-[#D4DDE2] space-y-2.5 text-xs text-[#2C3E50]">
                  <p className="font-bold uppercase tracking-wider text-[#5C7E8F] border-b border-[#D4DDE2] pb-1.5">
                    Estimated Cost Calculation
                  </p>
                  <div className="flex justify-between">
                    <span>Selected Slot Rate ({selectedSlot?.slotNumber})</span>
                    <span className="font-bold">${selectedSlot?.hourlyRate.toFixed(2)} / hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Duration</span>
                    <span className="font-bold">{durationHours} Hours</span>
                  </div>
                  <div className="border-t border-[#D4DDE2] pt-2 flex justify-between text-base font-black text-[#2C3E50]">
                    <span>Total Amount:</span>
                    <span className="text-[#5C7E8F]">${totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Confirm & Book CTA */}
                <button
                  type="submit"
                  disabled={isProcessing || !selectedSlot}
                  className="w-full bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating QR Ticket & Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Confirm & Book (${totalCost.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
