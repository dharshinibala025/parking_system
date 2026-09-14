'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AdminSidebar } from '@/components/AdminSidebar'
import { apiParking, apiSlots } from '@/services/api'
import { ArrowLeft, Check, MapPin, Star } from 'lucide-react'

export default function AdminParkingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const lot = apiParking.getLotById(resolvedParams.id)
  if (!lot) notFound()

  const slots = apiSlots.getSlotsByParkingId(lot.id)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <div className="flex-1 flex mx-auto max-w-7xl w-full px-5 py-8 lg:px-8 gap-8">
        <AdminSidebar />

        <main className="flex-1 space-y-6">
          <Link
            href="/admin/parking"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="size-3.5" /> Back to Parking Locations
          </Link>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-6">
            <div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {lot.parkingType} Facility
              </span>
              <h1 className="text-2xl font-bold text-foreground mt-2">{lot.name}</h1>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" /> {lot.address}
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold text-primary">₹{lot.pricePerHour}/hr</span>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                {lot.availableSlots} / {lot.totalSlots} Slots Free
              </p>
            </div>
          </div>

          {/* Slots Table */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-foreground">Facility Slot Allocation ({slots.length} Slots)</h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {slots.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-2xl border p-3 text-center text-xs font-bold ${
                    s.status === 'Available'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : s.status === 'Occupied'
                      ? 'border-slate-300 bg-slate-100 text-slate-500'
                      : 'border-amber-300 bg-amber-50 text-amber-800'
                  }`}
                >
                  <p className="font-mono text-sm">{s.slotNumber}</p>
                  <p className="text-[10px] font-semibold opacity-75 mt-0.5">{s.status}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
