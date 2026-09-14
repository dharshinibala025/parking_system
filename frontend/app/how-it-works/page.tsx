'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Search Nearby Parking',
      desc: 'Enter your destination area or city. Browse verified parking facilities with real-time slot counts and transparent hourly pricing.',
      icon: MapPin,
    },
    {
      num: '02',
      title: 'Select Visual Floor Plan & Slot',
      desc: 'Use our interactive visual garage layout to pick your exact slot (EV charging, Accessible, Covered, or Standard).',
      icon: Car,
    },
    {
      num: '03',
      title: 'Instant Booking & Digital QR Ticket',
      desc: 'Choose your date and time window. Pay seamlessly via UPI, Card, or Cash. Instantly receive your digital QR parking pass.',
      icon: QrCode,
    },
    {
      num: '04',
      title: 'Drive In & Park Stress-Free',
      desc: 'Scan your QR code at the entrance gate. Your assigned slot will be waiting for you guaranteed.',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
              Simple Step-By-Step
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How ParkEase Works
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              From search to steering wheel, reserving your parking slot is effortless.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.num}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-sm">
                        {step.num}
                      </span>
                      <Icon className="size-6 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center">
            <Link
              href="/find-parking"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
            >
              Find & Reserve Parking Now <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
