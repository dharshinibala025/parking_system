'use client'

import React from 'react'
import Link from 'next/link'
import { Car, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-14 px-4 sm:px-6 lg:px-8 text-[#172B4D]">
      <div className="mx-auto max-w-4xl space-y-10">
        
        <div className="text-center space-y-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">
            ABOUT PARKEASE
          </span>
          <h1 className="text-3xl font-bold text-[#0F2747] sm:text-4xl tracking-tight">
            Smart, Guaranteed Parking For Urban Mobility.
          </h1>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed font-normal">
            ParkEase connects drivers with verified parking facilities, providing transparent hourly pricing, live floor-plan slot selection, and digital QR ticket admission.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="saas-card p-5 text-center border border-[#E2E8F0]">
            <p className="text-3xl font-bold text-[#1769E0]">500+</p>
            <p className="mt-1 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Managed Slots</p>
          </div>
          <div className="saas-card p-5 text-center border border-[#E2E8F0]">
            <p className="text-3xl font-bold text-[#1769E0]">50+</p>
            <p className="mt-1 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Prime Locations</p>
          </div>
          <div className="saas-card p-5 text-center border border-[#E2E8F0]">
            <p className="text-3xl font-bold text-[#16A34A]">99.9%</p>
            <p className="mt-1 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Availability Guarantee</p>
          </div>
        </div>

        <div className="saas-card p-6 sm:p-8 border border-[#E2E8F0] space-y-3">
          <h2 className="text-xl font-bold text-[#0F2747]">Our Mission</h2>
          <p className="text-xs leading-relaxed text-[#64748B]">
            Finding parking in busy metropolitan areas wastes time, fuel, and causes undue stress. ParkEase connects drivers with verified parking operators, providing transparent pricing, instant floor-plan selection, and automated QR gate admission.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 h-[40px] px-5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-lg transition shadow-xs"
            >
              <span>Explore Live Slots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
