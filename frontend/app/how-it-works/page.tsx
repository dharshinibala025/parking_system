'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Car,
  CheckCircle2,
  MapPin,
  QrCode,
  Sparkles,
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Search Nearby Parking',
      desc: 'Enter your destination area or mall. Browse verified parking facilities with real-time slot counts and transparent hourly pricing.',
      icon: MapPin,
    },
    {
      num: '02',
      title: 'Select Floor Plan & Slot',
      desc: 'Use our interactive visual garage layout to pick your exact slot (2W/4W, Zone A/B/C) with color-coded live statuses.',
      icon: Car,
    },
    {
      num: '03',
      title: 'Instant Booking & Digital QR Ticket',
      desc: 'Choose your date and time window. Complete booking and instantly receive your digital QR parking pass for entry.',
      icon: QrCode,
    },
    {
      num: '04',
      title: 'Drive In & Park Stress-Free',
      desc: 'Scan your QR code at the entrance scanner. Your assigned slot will be waiting for you guaranteed.',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F9FA] py-16 px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#42606F]/10 text-[#42606F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Simple 4-Step Process
          </span>
          <h1 className="text-4xl font-black tracking-tight text-[#1E2A30] sm:text-5xl">
            How ParkEase Works
          </h1>
          <p className="text-base text-[#5C6E78]">
            From search to steering wheel, reserving your parking slot is effortless.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="glass-card p-6 rounded-3xl border border-[#B9C7CF] shadow-sm flex flex-col justify-between hover:shadow-xl transition duration-300 space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-[#42606F] text-white font-bold text-sm shadow-md">
                      {step.num}
                    </span>
                    <Icon className="size-6 text-[#42606F]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2A30]">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5C6E78]">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-[#42606F] hover:bg-[#354E5A] px-8 py-4 text-sm font-bold text-white shadow-lg transition transform hover:-translate-y-0.5"
          >
            <span>Book Your Slot Now</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
