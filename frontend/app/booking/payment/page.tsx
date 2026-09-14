'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { apiBookings } from '@/services/api'
import {
  CreditCard,
  QrCode,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentContent />
    </ProtectedRoute>
  )
}

function PaymentContent() {
  const router = useRouter()
  const [draftBooking, setDraftBooking] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'UPI' | 'Cash'>('UPI')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const savedDraft = sessionStorage.getItem('parkease_draft_booking')
    if (savedDraft) {
      try {
        setDraftBooking(JSON.parse(savedDraft))
      } catch (e) {
        router.push('/find-parking')
      }
    } else {
      router.push('/find-parking')
    }
  }, [router])

  const handleProcessPayment = async () => {
    if (!draftBooking) return
    setIsProcessing(true)
    setErrorMsg(null)

    try {
      // Execute booking transaction via API
      const result = await apiBookings.createBooking({
        parkingLotId: draftBooking.parkingLotId,
        parkingSlotId: draftBooking.parkingSlotId,
        vehicleId: draftBooking.vehicleId,
        bookingDate: draftBooking.bookingDate,
        startTime: draftBooking.startTime,
        endTime: draftBooking.endTime,
        paymentMethod,
      })

      if (result.success && result.booking) {
        // Save confirmed booking to sessionStorage for confirmation page display
        sessionStorage.setItem('parkease_last_booking', JSON.stringify(result.booking))
        sessionStorage.removeItem('parkease_draft_booking')

        setTimeout(() => {
          setIsProcessing(false)
          router.push('/booking/success')
        }, 1200)
      } else {
        setIsProcessing(false)
        setErrorMsg(result.error || 'Payment failed due to slot unavailability or error.')
      }
    } catch (err: any) {
      setIsProcessing(false)
      setErrorMsg(err.message || 'An unexpected error occurred during payment processing.')
    }
  }

  if (!draftBooking) {
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/booking" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to Booking Summary
          </Link>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            Step 2 of 2: Safe Payment Simulation
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Safe Demo Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3 text-blue-900 text-xs">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Safe Demonstration Environment</p>
            <p className="text-blue-700 mt-0.5">
              This is a safe college project payment simulator. No real money or credit card charges will be made.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Booking Conflict Error</p>
              <p className="text-red-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Payment Method Selector Column */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Select Payment Method
              </h2>

              {/* Options */}
              <div className="space-y-3">
                
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">UPI Instant Transfer</p>
                      <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                    {paymentMethod === 'UPI' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'Card'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Credit / Debit Card</p>
                      <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Card' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                    {paymentMethod === 'Card' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Cash Option */}
                <div
                  onClick={() => setPaymentMethod('Cash')}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'Cash'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Cash at Parking</p>
                      <p className="text-xs text-slate-500">Pay cash directly at the parking entrance booth</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                    {paymentMethod === 'Cash' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

              </div>

              {/* Simulated Inputs Based on Method */}
              {paymentMethod === 'UPI' && (
                <div className="pt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <label className="block font-semibold text-slate-700">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    defaultValue="user@upi"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
                    placeholder="name@okaxis"
                  />
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="pt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expiry</label>
                      <input type="text" defaultValue="12/28" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">CVV</label>
                      <input type="password" defaultValue="123" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900" />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Checkout & Total Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-5">
              
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="text-xs space-y-2.5">
                <div className="flex justify-between text-slate-600">
                  <span>Location</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[180px]">{draftBooking.parkingLotName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Slot</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{draftBooking.slotNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Vehicle Number</span>
                  <span className="font-semibold text-slate-900">{draftBooking.vehicleNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Date & Time</span>
                  <span className="font-semibold text-slate-900">{draftBooking.bookingDate} ({draftBooking.startTime} - {draftBooking.endTime})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duration</span>
                  <span className="font-semibold text-slate-900">{draftBooking.durationHours} hours</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-blue-600">₹{draftBooking.totalAmount}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Pay ₹{draftBooking.totalAmount}
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
