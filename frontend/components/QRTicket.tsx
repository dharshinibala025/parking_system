'use client'

import React from 'react'
import { Booking } from '@/types'
import { CheckCircle2, Download, MapPin, Printer, ShieldCheck } from 'lucide-react'

interface QRTicketProps {
  booking?: Booking | any
  bookingId?: string
  bookingReference?: string
  slotNumber?: string
  parkingLotName?: string
  vehicleNumber?: string
  date?: string
  bookingDate?: string
  timeIn?: string
  startTime?: string
  endTime?: string
  durationHours?: number
  totalAmount?: number
  amount?: number
  status?: string
  showPrint?: boolean
}

// Generate deterministic SVG QR Code grid pattern based on reference string
function generateQRGrid(seed: string = 'PARKEASE-PASS-2026') {
  const safeSeed = seed || 'PARKEASE-PASS-2026'
  const size = 15
  const grid: boolean[][] = []

  let hash = 0
  for (let i = 0; i < safeSeed.length; i++) {
    hash = safeSeed.charCodeAt(i) + ((hash << 5) - hash)
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

export function QRTicket(props: QRTicketProps) {
  const {
    booking,
    bookingId,
    bookingReference,
    slotNumber,
    parkingLotName,
    vehicleNumber,
    date,
    bookingDate,
    timeIn,
    startTime,
    endTime,
    durationHours,
    totalAmount,
    amount,
    status,
    showPrint = true,
  } = props

  // Extract values safely from either booking object or standalone props
  const refCode =
    bookingReference ||
    booking?.bookingReference ||
    bookingId ||
    booking?.id ||
    booking?._id ||
    booking?.qrCode ||
    'PE-BK-2026-001'

  const ticketSlot = slotNumber || booking?.slotNumber || booking?.slot?.slotNumber || 'A101'
  const ticketLot = parkingLotName || booking?.parkingLotName || booking?.zone || 'Zone A - Main Garage'
  const ticketDate = bookingDate || date || booking?.bookingDate || booking?.date || '2026-09-15'
  const ticketTimeIn = startTime || timeIn || booking?.startTime || booking?.timeIn || '10:00 AM'
  const ticketTimeOut = endTime || booking?.endTime || booking?.timeOut || '12:00 PM'
  const ticketDuration = durationHours || booking?.durationHours || 2
  const ticketVehicle = vehicleNumber || booking?.vehicleNumber || 'KA 01 AB 1234'
  const ticketAmount = totalAmount ?? amount ?? booking?.totalAmount ?? booking?.amount ?? 10.0
  const ticketStatus = status || booking?.status || 'active'

  const qrGrid = generateQRGrid(refCode)

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl border-2 border-[#42606F]/20 bg-white p-6 shadow-2xl shadow-[#42606F]/10">
      {/* Ticket Header */}
      <div className="flex items-center justify-between border-b border-[#B9C7CF]/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#42606F] text-white font-black text-sm shadow-xs">
            P
          </span>
          <span className="font-bold tracking-tight text-[#1E2A30]">ParkEase Pass</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase">
          <CheckCircle2 className="size-3.5 text-emerald-600" /> {ticketStatus}
        </span>
      </div>

      {/* QR Code Container */}
      <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#42606F]/40 bg-[#42606F]/5 p-5">
        <div className="relative p-2 bg-white rounded-xl shadow-md border border-slate-200">
          <svg width="150" height="150" viewBox="0 0 15 15" className="shape-rendering-crisp">
            {qrGrid.map((row, r) =>
              row.map((cell, c) =>
                cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#1E2A30" /> : null
              )
            )}
          </svg>
        </div>
        <p className="mt-3 font-mono text-sm font-bold tracking-wider text-[#42606F]">
          {refCode}
        </p>
        <p className="mt-1 text-[11px] text-[#7D7D7D] flex items-center gap-1">
          <ShieldCheck className="size-3 text-emerald-600" /> Scan QR code at parking gate
        </p>
      </div>

      {/* Ticket Details List */}
      <div className="space-y-3 border-t border-[#B9C7CF]/60 pt-4 text-xs">
        <div className="flex justify-between">
          <span className="text-[#7D7D7D]">Facility / Zone</span>
          <span className="font-bold text-[#42606F] flex items-center gap-1">
            <MapPin className="size-3.5" /> {ticketLot}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#7D7D7D]">Assigned Slot</span>
          <span className="rounded-lg bg-[#42606F] px-2.5 py-0.5 font-bold text-white text-xs">
            Slot {ticketSlot}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#7D7D7D]">Date</span>
          <span className="font-semibold text-[#1E2A30]">{ticketDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#7D7D7D]">Time Window</span>
          <span className="font-semibold text-[#1E2A30]">
            {ticketTimeIn} – {ticketTimeOut} ({ticketDuration}h)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#7D7D7D]">Vehicle</span>
          <span className="font-semibold text-[#1E2A30] font-mono">{ticketVehicle}</span>
        </div>
        <div className="flex justify-between border-t border-[#B9C7CF]/60 pt-3">
          <span className="font-bold text-[#1E2A30]">Total Paid</span>
          <span className="font-bold text-emerald-700 text-sm">₹{Number(ticketAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showPrint && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#B9C7CF] bg-slate-50 py-2.5 text-xs font-bold text-[#1E2A30] hover:bg-slate-100 transition"
          >
            <Printer className="size-3.5" /> Print
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#42606F] py-2.5 text-xs font-bold text-white hover:bg-[#354E5A] transition shadow-sm"
          >
            <Download className="size-3.5" /> Download
          </button>
        </div>
      )}
    </div>
  )
}
