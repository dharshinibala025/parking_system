'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { apiBookings } from '@/services/api'
import { Booking } from '@/types'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Car,
  Printer,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'

export default function BookingDetailPage() {
  return (
    <ProtectedRoute>
      <BookingDetailContent />
    </ProtectedRoute>
  )
}

function BookingDetailContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (id) {
        const data = await apiBookings.getBookingById(id)
        if (data) {
          setBooking(data)
        } else {
          setError('Booking record not found or access restricted.')
        }
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleCancel = async () => {
    if (!booking) return
    if (confirm('Are you sure you want to cancel this booking?')) {
      const res = await apiBookings.cancelBooking(booking.id)
      if (res.success) {
        setBooking({ ...booking, status: 'Cancelled', paymentStatus: 'Refunded' })
      } else {
        alert('Failed to cancel booking.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 text-center max-w-md w-full space-y-3">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500">{error || 'Booking details could not be loaded.'}</p>
          <Link href="/my-bookings" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
            Return to My Bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link href="/my-bookings" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to My Bookings
          </Link>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-blue-600" /> Print Pass
          </button>
        </div>

        {/* Digital Pass Ticket Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Booking Reference</span>
              <p className="text-xl font-mono font-extrabold text-slate-900">{booking.bookingReference}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold border uppercase ${
                booking.status === 'Cancelled'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {booking.status}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
              <QRCodeSVG value={booking.bookingReference} size={140} />
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-2">Scan QR Code at Entry Gate</p>
          </div>

          {/* Ticket Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Facility Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.parkingLotName || 'ParkEase Location'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Reserved Bay</p>
              <p className="font-extrabold text-blue-600 mt-0.5 text-sm">Slot {booking.slotNumber || 'A01'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Date & Time</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.bookingDate} ({booking.startTime} - {booking.endTime})</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Vehicle Number</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.vehicleNumber || 'KA-01-MJ-4321'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Total Amount</p>
              <p className="font-extrabold text-slate-900 mt-0.5 text-sm">₹{booking.totalAmount}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Payment Status</p>
              <p className="font-bold text-emerald-700 mt-0.5 uppercase">{booking.paymentStatus || 'PAID'}</p>
            </div>
          </div>

          {/* Cancel Option if active */}
          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition"
              >
                Cancel Booking & Request Refund
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
