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

      <main className="flex-1 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-xl text-center space-y-6">
          {/* Success Banner */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="size-10" />
          </div>

          <div>
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              Payment Successful
            </span>
            <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Booking Confirmed!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your parking slot is reserved. Present the QR ticket at the gate.
            </p>
          </div>

          {/* QR TICKET COMPONENT */}
          <QRTicket booking={booking} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/my-bookings"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"
            >
              <ListOrdered className="size-4" /> View My Bookings
            </Link>

            <Link
              href="/"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground hover:bg-secondary transition"
            >
              <Home className="size-4 text-muted-foreground" /> Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
