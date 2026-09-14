'use client'

import React from 'react'
import { Booking } from '@/types'
import { CheckCircle2, Download, MapPin, Printer, ShieldCheck } from 'lucide-react'

interface QRTicketProps {
  booking: Booking
  showPrint?: boolean
}

// Generate deterministic SVG QR Code grid pattern based on reference string
function generateQRGrid(seed: string) {
  const size = 15
  const grid: boolean[][] = []

  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  for (let r = 0; r < size; r++) {
    const row: boolean[] = []
    for (let c = 0; c < size; c++) {
      // Corner finder patterns
      if (
        (r < 4 && c < 4) ||
        (r < 4 && c >= size - 4) ||
        (r >= size - 4 && c < 4)
      ) {
        const isBorder =
          r === 0 || r === 3 || c === 0 || c === 3 ||
          r === size - 1 || r === size - 4 || c === size - 1 || c === size - 4 ||
          (r < 4 && (c === 0 || c === 3)) ||
          (c < 4 && (r === 0 || r === 3)) ||
          (c >= size - 4 && (r === 0 || r === 3))
        row.push(isBorder || (r >= 1 && r <= 2 && c >= 1 && c <= 2) || (r >= 1 && r <= 2 && c >= size - 3 && c <= size - 2) || (r >= size - 3 && r <= size - 2 && c >= 1 && c <= 2))
      } else {
        const val = Math.abs(Math.sin(hash + r * 17 + c * 31) * 10000)
        row.push(val % 2 < 1)
      }
    }
    grid.push(row)
  }
  return grid
}

export function QRTicket({ booking, showPrint = true }: QRTicketProps) {
  const qrGrid = generateQRGrid(booking.bookingReference)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl border-2 border-primary/20 bg-card p-6 shadow-2xl shadow-primary/10">
      {/* Ticket Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            P
          </span>
          <span className="font-bold tracking-tight text-foreground">ParkEase Ticket</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="size-3.5 text-emerald-600" /> {booking.status}
        </span>
      </div>

      {/* QR Code Container */}
      <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5">
        <div className="relative p-2 bg-white rounded-xl shadow-md border border-slate-200">
          <svg width="150" height="150" viewBox="0 0 15 15" className="shape-rendering-crisp">
            {qrGrid.map((row, r) =>
              row.map((cell, c) =>
                cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0F172A" /> : null
              )
            )}
          </svg>
        </div>
        <p className="mt-3 font-mono text-sm font-bold tracking-wider text-primary">
          {booking.bookingReference}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="size-3 text-emerald-600" /> Show this QR code at parking gate
        </p>
      </div>

      {/* Ticket Details List */}
      <div className="space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Parking Spot</span>
          <span className="font-bold text-primary flex items-center gap-1">
            <MapPin className="size-3.5" /> {booking.parkingLotName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Assigned Slot</span>
          <span className="rounded-lg bg-primary px-2.5 py-0.5 font-bold text-primary-foreground text-xs">
            Slot {booking.slotNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-semibold text-foreground">{booking.bookingDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time Slot</span>
          <span className="font-semibold text-foreground">
            {booking.startTime} – {booking.endTime} ({booking.durationHours}h)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Vehicle</span>
          <span className="font-semibold text-foreground font-mono">{booking.vehicleNumber}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3">
          <span className="font-bold text-foreground">Total Paid</span>
          <span className="font-bold text-emerald-600 text-base">₹{booking.totalAmount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showPrint && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/50 py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition"
          >
            <Printer className="size-3.5" /> Print
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
          >
            <Download className="size-3.5" /> Download
          </button>
        </div>
      )}
    </div>
  )
}
