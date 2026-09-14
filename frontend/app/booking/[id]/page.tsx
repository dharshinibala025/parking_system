'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { apiBookings, apiParking, apiSlots, apiVehicles } from '@/services/api'
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  QrCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

function BookingCheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()

  const lotId = searchParams.get('lotId') || 'lot-1'
  const slotId = searchParams.get('slotId') || 'slot-lot-1-A-01'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const startTime = searchParams.get('start') || '10:00'
  const endTime = searchParams.get('end') || '12:00'

  const lot = apiParking.getLotById(lotId)
  const slots = apiSlots.getSlotsByParkingId(lotId)
  const slot = slots.find((s) => s.id === slotId) || slots[0]

  const userVehicles = user ? apiVehicles.getUserVehicles(user.id) : []
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    userVehicles[0]?.id || ''
  )
  const [customVehicleNum, setCustomVehicleNum] = useState('TN 01 AB 1234')
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI')
  const [agreed, setAgreed] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Calculate pricing
  const [sH, sM] = startTime.split(':').map(Number)
  const [eH, eM] = endTime.split(':').map(Number)
  const startMins = sH * 60 + sM
  const endMins = eH * 60 + eM
  const durationHours = Math.max(1, Math.ceil((endMins - startMins) / 60))

  const hourlyRate = slot ? slot.pricePerHour : lot?.pricePerHour || 40
  const parkingFee = hourlyRate * durationHours
  const serviceFee = 5
  const totalAmount = parkingFee + serviceFee

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError('Please agree to the booking terms.')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Create vehicle if not registered
      let vehicleIdToUse = selectedVehicleId
      if (!vehicleIdToUse && user) {
        const newV = await apiVehicles.addVehicle({
          userId: user.id,
          vehicleNumber: customVehicleNum,
          vehicleType: 'Car',
          model: 'Standard Car',
          color: 'White',
          isDefault: true,
        })
        vehicleIdToUse = newV.id
      }

      const booking = await apiBookings.createBooking({
        userId: user?.id || 'usr-customer-1',
        parkingLotId: lotId,
        slotId: slot.id,
        vehicleId: vehicleIdToUse || 'veh-1',
        bookingDate: date,
        startTime,
        endTime,
        paymentMethod,
      })

      router.push(`/booking-confirmation/${booking.id}`)
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!lot || !slot) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">Parking details missing. Please select a spot again.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/parking/${lotId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition mb-6"
          >
            <ArrowLeft className="size-4" /> Change Slot
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Booking Summary & Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your spot reservation details and choose payment method.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleConfirmBooking} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left Column: Details & Vehicle & Payment */}
            <div className="space-y-6">
              {/* Reservation Overview Card */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-base text-foreground mb-4">Reservation Details</h3>
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Parking Facility</span>
                    <p className="mt-1 font-bold text-primary flex items-center gap-1.5">
                      <MapPin className="size-4" /> {lot.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{lot.address}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Assigned Slot</span>
                    <p className="mt-1 font-bold text-foreground">
                      <span className="rounded-lg bg-primary px-3 py-1 text-xs text-primary-foreground">
                        Slot {slot.slotNumber}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Section {slot.section} ({slot.slotType})</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Date</span>
                    <p className="mt-1 font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="size-4 text-primary" /> {date}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Time Slot</span>
                    <p className="mt-1 font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="size-4 text-primary" /> {startTime} – {endTime} ({durationHours}h)
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Selection Card */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-base text-foreground mb-4">Select Vehicle</h3>

                {userVehicles.length > 0 ? (
                  <div className="space-y-3">
                    {userVehicles.map((veh) => (
                      <label
                        key={veh.id}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                          selectedVehicleId === veh.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border bg-secondary/20 hover:bg-secondary/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="vehicle"
                            checked={selectedVehicleId === veh.id}
                            onChange={() => setSelectedVehicleId(veh.id)}
                            className="size-4 text-primary"
                          />
                          <div>
                            <p className="font-bold text-sm text-foreground">{veh.model}</p>
                            <p className="text-xs text-muted-foreground font-mono">{veh.vehicleNumber} ({veh.vehicleType})</p>
                          </div>
                        </div>
                        {veh.isDefault && (
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-primary">
                            Default
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Vehicle License Number
                    </label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={customVehicleNum}
                        onChange={(e) => setCustomVehicleNum(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary/30 pl-10 pr-4 py-2.5 text-sm font-semibold uppercase text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. TN 01 AB 1234"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-base text-foreground mb-4">Payment Method</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode, desc: 'Instant GPay/PhonePe' },
                    { id: 'Card', label: 'Credit/Debit', icon: CreditCard, desc: 'Visa/Mastercard' },
                    { id: 'Cash', label: 'Pay at Exit', icon: Wallet, desc: 'Cash/Counter' },
                  ].map((m) => {
                    const Icon = m.icon
                    const isSelected = paymentMethod === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                          isSelected
                            ? 'border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary/30'
                            : 'border-border bg-secondary/20 text-muted-foreground hover:bg-secondary/50'
                        }`}
                      >
                        <Icon className="size-6 mb-2 text-primary" />
                        <span className="text-xs font-bold text-foreground">{m.label}</span>
                        <span className="mt-1 text-[10px] text-muted-foreground">{m.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Price Calculation & Confirm */}
            <div>
              <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 space-y-4">
                <h3 className="font-bold text-lg text-foreground">Payment Summary</h3>

                <div className="space-y-3 text-xs border-b border-border pb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base Hourly Rate</span>
                    <span className="font-semibold text-foreground">₹{hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Duration ({durationHours} hours)</span>
                    <span className="font-semibold text-foreground">₹{parkingFee}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service Fee</span>
                    <span className="font-semibold text-foreground">₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span className="font-semibold text-emerald-600">₹0</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-xl text-emerald-600">₹{totalAmount}</span>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-border text-primary focus:ring-primary size-4"
                    />
                    <span>
                      I agree to the <a href="#" className="text-primary underline">terms & cancellation policy</a>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processing Payment...
                    </span>
                  ) : (
                    `Confirm & Pay ₹${totalAmount}`
                  )}
                </button>

                <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" /> Guaranteed reservation & instant QR ticket
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function BookingCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-muted-foreground">
          Loading checkout...
        </div>
      }
    >
      <BookingCheckoutContent />
    </Suspense>
  )
}
