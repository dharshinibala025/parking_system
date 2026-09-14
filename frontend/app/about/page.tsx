'use client'

import React from 'react'
import Link from 'next/link'
import { Car, CheckCircle2, ShieldCheck, Sparkles, Users, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA] py-16 px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#42606F]/10 text-[#42606F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> About ParkEase
          </span>
          <h1 className="text-4xl font-black text-[#1E2A30] sm:text-5xl tracking-tight">
            Smart, Guaranteed Parking For Urban Mobility.
          </h1>
          <p className="text-base text-[#5C6E78] max-w-2xl mx-auto leading-relaxed font-normal">
            ParkEase connects drivers with verified parking facilities, providing transparent hourly pricing, live floor-plan slot selection, and digital QR ticket admission.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="glass-card p-6 rounded-3xl border border-[#B9C7CF] text-center shadow-sm">
            <p className="text-4xl font-black text-[#42606F]">500+</p>
            <p className="mt-1 text-xs font-bold text-[#7D7D7D] uppercase tracking-wider">Managed Slots</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-[#B9C7CF] text-center shadow-sm">
            <p className="text-4xl font-black text-[#42606F]">50+</p>
            <p className="mt-1 text-xs font-bold text-[#7D7D7D] uppercase tracking-wider">Prime Locations</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-[#B9C7CF] text-center shadow-sm">
            <p className="text-4xl font-black text-emerald-700">99.9%</p>
            <p className="mt-1 text-xs font-bold text-[#7D7D7D] uppercase tracking-wider">Guaranteed Availability</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-[#B9C7CF] shadow-xl space-y-4">
          <h2 className="text-2xl font-bold text-[#1E2A30]">Our Core Mission</h2>
          <p className="text-sm leading-relaxed text-[#5C6E78]">
            Finding parking in busy metropolitan areas wastes time, fuel, and causes undue stress. ParkEase connects drivers with verified parking operators, providing transparent pricing, instant floor-plan selection, and automated QR gate admission.
          </p>
          <div className="pt-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#42606F] hover:bg-[#354E5A] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <span>Explore Live Slots</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
