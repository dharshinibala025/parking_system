'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Booking } from '@/types'
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  Download,
  ArrowRight,
  ShieldCheck,
  Printer,
} from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <ProtectedRoute>
      <BookingSuccessContent />
    </ProtectedRoute>
  )
}

function BookingSuccessContent() {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('parkease_last_booking')
    if (saved) {
      try {
        setBooking(JSON.parse(saved))
      } catch (e) {
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
  }, [router])

  const handlePrintTicket = () => {
    window.print()
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-xs text-slate-600">
            Your parking slot has been reserved successfully. Present this digital pass at the entrance.
          </p>
        </div>

        {/* Printable Ticket Card */}
        <div
          ref={ticketRef}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6 relative overflow-hidden print:shadow-none print:border-none"
        >
          {/* Header Strip */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Booking Reference</span>
              <p className="text-lg font-mono font-extrabold text-slate-900">{booking.bookingReference}</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-xl text-xs border border-emerald-200">
              PAID & CONFIRMED
            </span>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
              <QRCodeSVG value={booking.bookingReference || 'PK-2026-000123'} size={140} />
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-2">Scan QR Code at Entry Gate</p>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Parking Location</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.parkingLotName || 'ParkEase Central Hub'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Reserved Slot</p>
              <p className="font-bold text-blue-600 mt-0.5 text-sm">Slot {booking.slotNumber || 'A01'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Date & Time</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {booking.bookingDate} ({booking.startTime} - {booking.endTime})
              </p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Vehicle Number</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.vehicleNumber || 'KA-01-MJ-4321'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Total Amount Paid</p>
              <p className="font-extrabold text-slate-900 mt-0.5 text-sm">₹{booking.totalAmount}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Payment Method</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.paymentMethod || 'UPI'}</p>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handlePrintTicket}
            className="w-full sm:w-1/2 py-3 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-blue-600" /> Print / Download Ticket
          </button>

          <Link
            href="/my-bookings"
            className="w-full sm:w-1/2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            View My Bookings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
            Back to Home Page
          </Link>
        </div>

      </div>
    </div>
  )
}
