'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ParkingLot, ParkingSlot } from '@/types'
import {
  Accessibility,
  ArrowDown,
  ArrowUp,
  Bike,
  Car,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'

interface ParkingSlotVisualizerProps {
  parkingLot: ParkingLot
  slots: ParkingSlot[]
  onSelectSlot?: (slot: ParkingSlot, date: string, startTime: string, endTime: string) => void
}

export function ParkingSlotVisualizer({ parkingLot, slots, onSelectSlot }: ParkingSlotVisualizerProps) {
  const router = useRouter()
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [startTime, setStartTime] = useState<string>('10:00')
  const [endTime, setEndTime] = useState<string>('12:00')

  const selectedSlot = slots.find((s) => s.id === selectedSlotId)

  // Calculate duration and price
  const [sH, sM] = startTime.split(':').map(Number)
  const [eH, eM] = endTime.split(':').map(Number)
  const startMins = sH * 60 + sM
  const endMins = eH * 60 + eM
  const durationHours = Math.max(1, Math.ceil((endMins - startMins) / 60))

  const hourlyRate = selectedSlot ? selectedSlot.pricePerHour : parkingLot.pricePerHour
  const parkingFee = hourlyRate * durationHours
  const serviceFee = 5
  const totalAmount = parkingFee + serviceFee

  const sections = Array.from(new Set(slots.map((s) => s.section))).sort()

  const handleContinue = () => {
    if (!selectedSlot) return
    if (onSelectSlot) {
      onSelectSlot(selectedSlot, bookingDate, startTime, endTime)
    } else {
      router.push(
        `/booking/new?lotId=${parkingLot.id}&slotId=${selectedSlot.id}&date=${bookingDate}&start=${startTime}&end=${endTime}`
      )
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Visual Garage Floor Plan */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
        {/* Garage Entrance Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-6 py-4 text-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold">
              <ArrowDown className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Entrance Lane</p>
              <p className="text-sm font-semibold">{parkingLot.name} — Floor 1</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Exit Lane</p>
              <p className="text-sm font-semibold">Automatic Gate</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500 text-white font-bold">
              <ArrowUp className="size-5" />
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="size-3.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3.5 rounded-full bg-slate-400" />
            <span className="text-muted-foreground">Booked / Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-3.5 text-amber-500" />
            <span className="text-muted-foreground">EV Spot</span>
          </div>
        </div>

        {/* Aisle Bays */}
        <div className="space-y-8">
          {sections.map((sec) => {
            const sectionSlots = slots.filter((s) => s.section === sec)
            return (
              <div key={sec} className="rounded-2xl border border-border/80 bg-secondary/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-bold tracking-widest text-primary uppercase">
                    Section {sec} — {sectionSlots.filter((s) => s.status === 'Available').length} Available
                  </h4>
                  <span className="text-[11px] text-muted-foreground font-mono">Lane {sec}-Main</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {sectionSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id
                    const isAvailable = slot.status === 'Available'
                    const isOccupied = slot.status === 'Occupied'
                    const isMaintenance = slot.status === 'Maintenance' || slot.status === 'Disabled'

                    let buttonBg = 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-500'
                    if (isSelected) {
                      buttonBg = 'bg-primary border-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary/40'
                    } else if (isOccupied) {
                      buttonBg = 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-75'
                    } else if (isMaintenance) {
                      buttonBg = 'bg-amber-50 border-amber-300 text-amber-700 cursor-not-allowed opacity-60'
                    }

                    return (
                      <button
                        key={slot.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all ${buttonBg}`}
                      >
                        {/* Slot Type Badges */}
                        <div className="absolute left-1.5 top-1.5 flex gap-1">
                          {slot.slotType === 'EV' && <Zap className="size-3 text-amber-500 fill-amber-500" />}
                          {slot.slotType === 'Accessible' && <Accessibility className="size-3 text-blue-600" />}
                        </div>

                        {/* Vehicle Icon */}
                        <div className="my-1">
                          {slot.vehicleType === 'Bike' ? (
                            <Bike className={`size-5 ${isSelected ? 'text-primary-foreground' : isAvailable ? 'text-emerald-700' : 'text-slate-400'}`} />
                          ) : (
                            <Car className={`size-5 ${isSelected ? 'text-primary-foreground' : isAvailable ? 'text-emerald-700' : 'text-slate-400'}`} />
                          )}
                        </div>

                        {/* Slot Number */}
                        <span className="font-mono text-xs font-bold">{slot.slotNumber}</span>

                        {/* Status Label */}
                        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider opacity-80">
                          {isSelected ? 'SELECTED' : slot.status}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Side Panel: Booking Summary & Time Selector */}
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
          <h3 className="text-lg font-bold text-foreground">Select Time & Slot</h3>
          <p className="mt-1 text-xs text-muted-foreground">Choose your schedule to reserve your spot.</p>

          {/* Date / Time Inputs */}
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Selected Slot Information */}
          <div className="mt-6 border-t border-border pt-5">
            {selectedSlot ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selected Slot</span>
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      Slot {selectedSlot.slotNumber}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{parkingLot.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Section {selectedSlot.section} • {selectedSlot.slotType} ({selectedSlot.vehicleType})
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Hourly Rate</span>
                    <span className="font-semibold text-foreground">₹{hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Duration</span>
                    <span className="font-semibold text-foreground">{durationHours} hours</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Parking Fee</span>
                    <span className="font-semibold text-foreground">₹{parkingFee}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service Fee</span>
                    <span className="font-semibold text-foreground">₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-emerald-600 text-base">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Proceed to Booking →
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <Info className="mx-auto size-8 text-muted-foreground/60" />
                <p className="mt-2 text-sm font-bold text-foreground">No slot selected</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click on any green <span className="font-bold text-emerald-600">Available</span> slot on the floor plan above to proceed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
