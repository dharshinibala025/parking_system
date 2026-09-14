'use client'

import React from 'react'
import { Car, CheckCircle2, ShieldCheck, Sparkles, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            About ParkEase
          </span>
          <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            Eliminating Parking Stress Everywhere.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            ParkEase is a modern online Parking Slot Booking and Management System built to optimize urban parking availability through real-time technology.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 text-center">
            <p className="text-4xl font-bold text-primary">500+</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground uppercase">Managed Slots</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 text-center">
            <p className="text-4xl font-bold text-primary">50+</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground uppercase">Prime Locations</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 text-center">
            <p className="text-4xl font-bold text-primary">99.9%</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground uppercase">Guaranteed Availability</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Our Core Mission</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Finding parking in busy metropolitan areas wastes time, fuel, and causes undue stress. ParkEase connects drivers with verified parking operators, providing transparent pricing, instant floor-plan selection, and automated QR gate admission.
          </p>
        </div>
      </div>
    </div>
  )
}
