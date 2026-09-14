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
    { id: 's1', slotNumber: 'A101', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 50.0, status: 'available' },
    { id: 's2', slotNumber: 'A102', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 50.0, status: 'occupied' },
    { id: 's3', slotNumber: 'A103', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 50.0, status: 'available' },
    { id: 's4', slotNumber: 'A104', zone: 'Zone A', floor: 'Floor 1', vehicleType: '2W', hourlyRate: 30.0, status: 'available' },
    { id: 's5', slotNumber: 'A105', zone: 'Zone A', floor: 'Floor 1', vehicleType: '2W', hourlyRate: 30.0, status: 'occupied' },
    { id: 's6', slotNumber: 'A106', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 50.0, status: 'maintenance' },

    { id: 's7', slotNumber: 'B201', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 60.0, status: 'available' },
    { id: 's8', slotNumber: 'B202', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 60.0, status: 'occupied' },
    { id: 's9', slotNumber: 'B203', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 60.0, status: 'available' },
    { id: 's10', slotNumber: 'B204', zone: 'Zone B', floor: 'Floor 2', vehicleType: '2W', hourlyRate: 35.0, status: 'available' },

    { id: 's11', slotNumber: 'C301', zone: 'Zone C', floor: 'Floor 3', vehicleType: '4W', hourlyRate: 45.0, status: 'available' },
    { id: 's12', slotNumber: 'C302', zone: 'Zone C', floor: 'Floor 3', vehicleType: '2W', hourlyRate: 25.0, status: 'available' },
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
      <div className="min-h-screen bg-[#F8FAFC] py-4 sm:py-6 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
            
            {/* Header: Horizontal Flex */}
            <div className="flex items-center gap-3.5 border-b border-[#E2E8F0] pb-3.5">
              <div className="w-10 h-10 bg-[#ECFDF5] text-[#16A34A] rounded-xl flex items-center justify-center shrink-0 border border-[#86EFAC]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-[#0F2747] truncate">Spot Reserved Successfully!</h1>
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#16A34A] text-[11px] font-semibold uppercase shrink-0 border border-[#86EFAC]">
                    Paid
                  </span>
                </div>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  Ref: <span className="font-mono font-semibold text-[#1769E0]">{confirmedBooking.id}</span> • Customer: <span className="font-medium text-[#172B4D]">{confirmedBooking.customerName}</span>
                </p>
              </div>
            </div>

            {/* Single Professional QR Code Gate Pass */}
            <QRTicket
              bookingId={confirmedBooking.id}
              slotNumber={confirmedBooking.slotNumber}
              vehicleNumber={confirmedBooking.vehicleNumber}
              date={confirmedBooking.date}
              timeIn={confirmedBooking.timeIn}
              amount={confirmedBooking.amount}
              zone={confirmedBooking.zone}
            />

            {/* Bottom Action Bar */}
            <div className="flex gap-2.5 pt-1 border-t border-[#E2E8F0]">
              <Link
                href="/my-bookings"
                className="flex-1 py-2 px-4 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg transition shadow-xs text-center flex items-center justify-center gap-1.5"
              >
                View My Bookings
              </Link>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="flex-1 py-2 px-4 bg-white border border-[#CBD5E1] text-[#172B4D] hover:bg-[#F8FAFC] font-semibold text-[13px] rounded-lg transition text-center"
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
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1769E0] text-[12px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Booking Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2747] tracking-tight">Book Your Parking Slot</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Select an available parking slot, specify reservation hours, and get your digital QR ticket pass.
            </p>
          </div>

          <Link
            href="/my-bookings"
            className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1769E0] hover:bg-[#EFF6FF] font-semibold text-[13px] rounded-lg transition shadow-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Clock className="w-4 h-4" /> View My Bookings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: VISUAL SLOT SELECTION GRID */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#0F2747]">Interactive Slot Selection Map</h2>
                  <p className="text-[13px] text-[#64748B]">Click any available green slot to choose your parking space.</p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2.5">
                  <select
                    value={filterZone}
                    onChange={(e) => setFilterZone(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#172B4D]"
                  >
                    <option value="All">All Zones</option>
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone C">Zone C</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#172B4D]"
                  >
                    <option value="All">All Types</option>
                    <option value="4W">4W (Car)</option>
                    <option value="2W">2W (Bike)</option>
                  </select>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <span className="flex items-center gap-1.5 text-[#15803D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" /> Available
                </span>
                <span className="flex items-center gap-1.5 text-[#1769E0]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1769E0]" /> Selected
                </span>
                <span className="flex items-center gap-1.5 text-[#DC2626]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> Occupied
                </span>
                <span className="flex items-center gap-1.5 text-[#64748B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" /> Maintenance
                </span>
              </div>

              {/* Slot Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredSlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id
                  const isAvailable = slot.status === 'available'
                  const isOccupied = slot.status === 'occupied'
                  const isMaint = slot.status === 'maintenance'

                  let btnStyle = 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC] hover:bg-[#DCFCE7]'
                  let labelText = 'Free'

                  if (isSelected) {
                    btnStyle = 'bg-[#1769E0] text-white border-[#1769E0] shadow-sm ring-2 ring-[#1769E0]/30'
                    labelText = 'Selected'
                  } else if (isOccupied) {
                    btnStyle = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] opacity-75 cursor-not-allowed'
                    labelText = 'Occupied'
                  } else if (isMaint) {
                    btnStyle = 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1] opacity-75 cursor-not-allowed'
                    labelText = 'Maint.'
                  }

                  return (
                    <button
                      key={slot.id}
                      disabled={!isAvailable && !isSelected}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3.5 rounded-xl border text-center font-semibold transition flex flex-col justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-[15px]">{slot.slotNumber}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-white/80 border border-current">
                          {slot.vehicleType}
                        </span>
                      </div>
                      <p className="text-[12px] font-normal opacity-90">{slot.zone}</p>
                      <div className="mt-2 pt-2 border-t border-current/20 flex items-center justify-between text-[11px]">
                        <span>₹{slot.hourlyRate.toFixed(2)}/hr</span>
                        <span className="font-semibold">{labelText}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Selected Slot Indicator Banner */}
              {selectedSlot && (
                <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#E2E8F0] flex items-center justify-between text-[13px] text-[#172B4D]">
                  <div>
                    <span className="font-medium">Selected Slot: </span>
                    <span className="bg-[#1769E0] text-white font-bold px-2 py-0.5 rounded text-[12px] ml-1">
                      {selectedSlot.slotNumber}
                    </span>
                    <span className="text-[#64748B] ml-2">({selectedSlot.zone} • {selectedSlot.vehicleType})</span>
                  </div>
                  <span className="font-bold text-[#1769E0] text-[14px]">₹{selectedSlot.hourlyRate.toFixed(2)} / hr</span>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT: BOOKING CONFIGURATION FORM & PRICE ESTIMATOR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
              
              <div className="pb-4 border-b border-[#E2E8F0]">
                <h2 className="text-[17px] font-bold text-[#0F2747]">Reservation Details</h2>
                <p className="text-[13px] text-[#64748B]">Specify vehicle plate and booking hours</p>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Vehicle Plate Input */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#172B4D] uppercase tracking-wider mb-1">
                    Vehicle License Plate
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="KA 01 AB 1234"
                      className="w-full h-11 bg-white border border-[#CBD5E1] rounded-lg pl-9 pr-4 py-2 text-[14px] font-semibold text-[#172B4D] uppercase focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                      required
                    />
                  </div>
                </div>

                {/* Booking Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#172B4D] uppercase tracking-wider mb-1">
                    Parking Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full h-11 bg-white border border-[#CBD5E1] rounded-lg pl-9 pr-4 py-2 text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                      required
                    />
                  </div>
                </div>

                {/* Time-In & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#172B4D] uppercase tracking-wider mb-1">
                      Time-In
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="time"
                        value={timeIn}
                        onChange={(e) => setTimeIn(e.target.value)}
                        className="w-full h-11 bg-white border border-[#CBD5E1] rounded-lg pl-9 pr-3 py-2 text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[#172B4D] uppercase tracking-wider mb-1">
                      Duration
                    </label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full h-11 bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours</option>
                      <option value={3}>3 Hours</option>
                      <option value={4}>4 Hours</option>
                      <option value={8}>8 Hours (Full Day)</option>
                    </select>
                  </div>
                </div>

                {/* Cost Summary Box */}
                <div className="bg-[#EFF6FF]/60 p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-[13px] text-[#172B4D]">
                  <p className="font-semibold text-[12px] uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0] pb-1.5">
                    Price Calculation
                  </p>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Slot Rate ({selectedSlot?.slotNumber})</span>
                    <span className="font-semibold">₹{selectedSlot?.hourlyRate.toFixed(2)} / hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Duration</span>
                    <span className="font-semibold">{durationHours} Hours</span>
                  </div>
                  <div className="border-t border-[#E2E8F0] pt-2 flex justify-between text-[15px] font-bold text-[#0F2747]">
                    <span>Total Amount:</span>
                    <span className="text-[#1769E0]">₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Confirm & Book CTA */}
                <button
                  type="submit"
                  disabled={isProcessing || !selectedSlot}
                  className="w-full h-11 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold rounded-lg transition shadow-xs flex items-center justify-center gap-2 text-[14px] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Ticket...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm & Book (₹{totalCost.toFixed(2)})</span>
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
