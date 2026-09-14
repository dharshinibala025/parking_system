'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { QRTicket } from '@/components/QRTicket'
import { apiBookings } from '@/services/api'
import { CheckCircle2, Home, ListOrdered } from 'lucide-react'

export default function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const booking = apiBookings.getBookingById(resolvedParams.id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 px-4 py-6 sm:py-8 flex items-center justify-center">
        <div className="mx-auto max-w-lg w-full text-center space-y-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-left">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#86EFAC] shrink-0">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="rounded bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#16A34A] uppercase border border-[#86EFAC]">
                Payment Successful
              </span>
              <h1 className="mt-0.5 text-base sm:text-lg font-bold text-[#0F2747]">Booking Confirmed!</h1>
              <p className="text-[12px] text-[#64748B]">
                Your parking slot is reserved. Present the QR pass at the gate.
              </p>
            </div>
          </div>

          {/* QR TICKET COMPONENT */}
          <QRTicket booking={booking} />

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <Link
              href="/my-bookings"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#1769E0] hover:bg-[#1258C4] py-2 px-4 text-xs font-bold text-white shadow-xs transition"
            >
              <ListOrdered className="size-3.5" /> View My Bookings
            </Link>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[#CBD5E1] bg-white py-2 px-4 text-xs font-bold text-[#172B4D] hover:bg-[#F8FAFC] transition"
            >
              <Home className="size-3.5 text-[#64748B]" /> Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
