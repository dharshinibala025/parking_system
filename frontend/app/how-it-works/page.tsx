'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Car,
  CheckCircle2,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
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
      title: 'Select Floor & Slot',
      desc: 'Use our interactive visual garage layout to pick your exact slot (2W/4W, Zone A/B/C) with color-coded live statuses.',
      icon: Car,
    },
    {
      num: '03',
      title: 'Instant Booking & Digital QR Ticket',
      desc: 'Choose your date and time window. Complete booking and instantly receive your digital QR parking pass for admission.',
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
    <div className="min-h-screen bg-[#F8FAFC] py-14 px-4 sm:px-6 lg:px-8 text-[#172B4D]">
      <div className="mx-auto max-w-5xl space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">
            SIMPLE 4-STEP PROCESS
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
            How ParkEase Works
          </h1>
          <p className="text-sm text-[#64748B]">
            From search to steering wheel, reserving your parking slot is effortless.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="saas-card p-6 border border-[#E2E8F0] flex flex-col justify-between space-y-3 saas-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#1769E0] text-white font-bold text-xs shadow-xs">
                      {step.num}
                    </span>
                    <Icon className="size-5 text-[#1769E0]" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#0F2747]">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div className="text-center pt-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 h-[44px] px-6 rounded-[10px] bg-[#1769E0] hover:bg-[#1258C4] text-xs font-semibold text-white transition shadow-xs"
          >
            <span>Book Your Slot Now</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
