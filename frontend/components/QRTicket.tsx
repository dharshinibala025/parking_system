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
    'BK-806957'

  const ticketSlot = slotNumber || booking?.slotNumber || booking?.slot?.slotNumber || 'A101'
  const ticketLot = parkingLotName || booking?.parkingLotName || booking?.zone || 'Zone A'
  const ticketDate = bookingDate || date || booking?.bookingDate || booking?.date || '2026-09-15'
  const ticketTimeIn = startTime || timeIn || booking?.startTime || booking?.timeIn || '10:00 AM'
  const ticketVehicle = vehicleNumber || booking?.vehicleNumber || 'KA 01 AB 1234'
  const ticketAmount = totalAmount ?? amount ?? booking?.totalAmount ?? booking?.amount ?? 100.0
  const ticketStatus = status || booking?.status || 'active'

  const qrGrid = generateQRGrid(refCode)

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="w-full bg-white rounded-xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-xs space-y-3 text-left">
      {/* Pass Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-[#1769E0] text-white font-bold text-[11px]">
            <MapPin className="size-3.5" />
          </span>
          <h3 className="font-bold text-[13px] text-[#0F2747]">ParkEase Gate Pass</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A] border border-[#86EFAC] uppercase">
          <CheckCircle2 className="size-3 text-[#16A34A]" /> {ticketStatus}
        </span>
      </div>

      {/* Body Grid: QR Code Left + Details Right */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left: QR Code */}
        <div className="col-span-5 sm:col-span-4 flex flex-col items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#EFF6FF]/50 p-2 space-y-1 text-center">
          <div className="p-1.5 bg-white rounded-md border border-[#E2E8F0] shadow-xs">
            <svg width="84" height="84" viewBox="0 0 15 15" className="shape-rendering-crisp">
              {qrGrid.map((row, r) =>
                row.map((cell, c) =>
                  cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0F2747" /> : null
                )
              )}
            </svg>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-wider text-[#1769E0]">
              {refCode}
            </p>
            <p className="text-[9px] text-[#64748B] flex items-center justify-center gap-0.5 mt-0.5">
              <ShieldCheck className="size-2.5 text-[#16A34A]" /> Scan at gate
            </p>
          </div>
        </div>

        {/* Right: Details List */}
        <div className="col-span-7 sm:col-span-8 space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-[#64748B]">Assigned Slot</span>
            <span className="rounded bg-[#1769E0] px-2 py-0.5 font-bold text-white text-[11px]">
              Slot {ticketSlot}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#64748B]">Zone</span>
            <span className="font-semibold text-[#0F2747]">{ticketLot}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#64748B]">Date & Time</span>
            <span className="font-semibold text-[#172B4D]">{ticketDate} @ {ticketTimeIn}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#64748B]">Vehicle Plate</span>
            <span className="font-mono font-bold text-[#0F2747]">{ticketVehicle}</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-1 text-[12px]">
            <span className="font-bold text-[#0F2747]">Total Paid</span>
            <span className="font-bold text-[#1769E0] text-[14px]">₹{Number(ticketAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showPrint && (
        <div className="pt-1 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] py-1.5 text-[11px] font-semibold text-[#172B4D] transition"
          >
            <Printer className="size-3 text-[#64748B]" /> Print Pass
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#1769E0] hover:bg-[#1258C4] py-1.5 text-[11px] font-semibold text-white transition shadow-xs"
          >
            <Download className="size-3" /> Download
          </button>
        </div>
      )}
    </div>
  )
}
