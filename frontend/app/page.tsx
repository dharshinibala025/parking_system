'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Search,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Zap,
} from 'lucide-react'

export default function HomePage() {
  const [availableSlotsCount, setAvailableSlotsCount] = useState(42)

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableSlotsCount((prev) => Math.max(35, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1))))
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = new URLSearchParams({ location, date: bookingDate, startTime, duration })
    router.push(`/book?${query.toString()}`)
  }

  const popularLocations = [
    {
      id: 'lot-1',
      name: 'Central Plaza Mall',
      location: 'Financial District, City Center',
      slots: '18 Available',
      price: '₹50/hr',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    },
    {
      id: 'lot-2',
      name: 'Metro Grand Station',
      location: 'Terminal A Transit Hub',
      slots: '14 Available',
      price: '₹45/hr',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    },
    {
      id: 'lot-3',
      name: 'Tech Innovation Park',
      location: 'Silicon Boulevard',
      slots: '10 Available',
      price: '₹40/hr',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
    },
  ]

  const stats = [
    { value: '500+', label: 'Parking Slots' },
    { value: '50+', label: 'Prime Locations' },
    { value: '10K+', label: 'Happy Drivers' },
    { value: '99%', label: 'Booking Success' },
  ]

  const features = [
    {
      icon: Search,
      title: 'Easy Booking',
      desc: 'Discover and reserve your preferred parking slot in under 60 seconds.',
    },
    {
      icon: Zap,
      title: 'Real-Time Availability',
      desc: 'Live IoT floor plans show available, occupied, and reserved slots instantly.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      desc: 'Transparent pricing with instant digital receipt and automated confirmation.',
    },
    {
      icon: QrCode,
      title: 'Instant QR Entry',
      desc: 'Drive straight to the gate and scan your digital QR pass for seamless access.',
    },
  ]

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#172B4D] font-sans antialiased">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="inline-block text-[12px] font-semibold uppercase tracking-wider text-[#1769E0] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#1769E0]/20">
                SMART PARKING PLATFORM
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#0F2747] tracking-tight leading-[1.12]">
                Find your perfect <br className="hidden sm:block" />
                <span className="text-[#1769E0]">parking spot.</span>
              </h1>

              <p className="text-[16px] text-[#64748B] max-w-lg font-normal leading-relaxed">
                Find, reserve, and manage your parking space with ease. Real-time availability and digital QR admission.
              </p>

              {/* LIVE COUNTER BADGE */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs shadow-xs">
                <span className="size-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="font-semibold text-[#0F2747]">
                  <strong className="text-[#16A34A] font-bold mr-1">{availableSlotsCount} slots</strong>
                  free right now across prime locations
                </span>
              </div>

              {/* HERO CTA BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center h-[46px] px-6 rounded-[10px] bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[15px] transition shadow-xs gap-2"
                >
                  <span>Find Parking</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center h-[46px] px-6 rounded-[10px] bg-white border border-[#E2E8F0] hover:bg-[#EFF6FF] text-[#172B4D] font-medium text-[15px] transition"
                >
                  How It Works
                </a>
              </div>

              {/* TRUST BULLETS */}
              <div className="pt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#64748B]">
                <span className="flex items-center gap-1.5 text-[#172B4D]">
                  <Check className="w-3.5 h-3.5 text-[#1769E0] stroke-[2.5]" /> Instant QR Entry
                </span>
                <span className="flex items-center gap-1.5 text-[#172B4D]">
                  <Check className="w-3.5 h-3.5 text-[#1769E0] stroke-[2.5]" /> Guaranteed Slot
                </span>
                <span className="flex items-center gap-1.5 text-[#172B4D]">
                  <Check className="w-3.5 h-3.5 text-[#1769E0] stroke-[2.5]" /> No Waiting Time
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: PARKING AVAILABILITY VISUALIZATION */}
            <div className="lg:col-span-5">
              <div className="saas-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="font-semibold text-[#0F2747] text-sm">Central Plaza • Zone A</h3>
                    <p className="text-[12px] text-[#64748B]">Floor 1 Floor Plan</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] text-[11px] font-semibold border border-[#86EFAC]">
                    Live Status
                  </span>
                </div>

                {/* PARKING SLOT GRID VISUALIZATION */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#64748B] mb-2.5">
                    <span>Select Slot Preview</span>
                    <span className="text-[#1769E0] font-semibold">₹50/hr</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { code: 'A01', status: 'available' },
                      { code: 'A02', status: 'selected' },
                      { code: 'A03', status: 'occupied' },
                      { code: 'A04', status: 'available' },
                      { code: 'A05', status: 'occupied' },
                      { code: 'A06', status: 'available' },
                      { code: 'A07', status: 'maintenance' },
                      { code: 'A08', status: 'available' },
                    ].map((slot) => {
                      let bg = 'bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]'
                      let label = 'Free'
                      if (slot.status === 'selected') {
                        bg = 'bg-[#1769E0] border-[#1769E0] text-white shadow-xs'
                        label = 'Selected'
                      } else if (slot.status === 'occupied') {
                        bg = 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                        label = 'Taken'
                      } else if (slot.status === 'maintenance') {
                        bg = 'bg-[#F8FAFC] border-[#CBD5E1] text-[#64748B]'
                        label = 'Maint.'
                      }

                      return (
                        <div
                          key={slot.code}
                          className={`p-2.5 rounded-lg border text-center font-medium text-xs transition ${bg}`}
                        >
                          <Car className={`size-3.5 mx-auto mb-1 ${slot.status === 'selected' ? 'text-white' : ''}`} />
                          <span className="block font-semibold text-xs">{slot.code}</span>
                          <span className="block text-[9px] opacity-80 mt-0.5">{label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* SELECTED SUMMARY CTA */}
                <div className="bg-[#EFF6FF] p-3 rounded-lg border border-[#1769E0]/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Active Selection</span>
                    <span className="font-semibold text-[#0F2747]">Slot A02 • 4-Wheeler</span>
                  </div>
                  <Link
                    href="/book?slot=A02"
                    className="h-8 px-3.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold rounded-md transition flex items-center gap-1"
                  >
                    Book A02
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-white border border-[#E2E8F0]">
                <p className="text-[26px] font-bold text-[#0F2747]">{s.value}</p>
                <p className="text-xs font-medium text-[#64748B] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARKEASE FEATURE SECTION */}
      <section id="how-it-works" className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">WHY PARKEASE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2747]">Parking made simple.</h2>
            <p className="text-sm text-[#64748B]">Designed for reliable urban mobility and guaranteed slot access.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="saas-card p-6 border border-[#E2E8F0] space-y-3">
                  <div className="size-10 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center font-bold">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#0F2747]">{f.title}</h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* POPULAR PARKING LOCATIONS */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">POPULAR LOCATIONS</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2747] mt-1">Featured Garages</h2>
            </div>
            <Link href="/find-parking" className="text-xs font-semibold text-[#1769E0] hover:underline flex items-center gap-1">
              Explore All Locations <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularLocations.map((loc) => (
              <div key={loc.id} className="saas-card overflow-hidden flex flex-col justify-between saas-card-hover">
                <div>
                  <div className="relative h-[160px] overflow-hidden bg-slate-100">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#0F2747] flex items-center gap-1 shadow-xs">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {loc.rating}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="text-[17px] font-semibold text-[#0F2747]">{loc.name}</h3>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#1769E0]" />
                      {loc.location}
                    </p>

                    <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#86EFAC]">
                        {loc.slots}
                      </span>
                      <span className="font-semibold text-[#0F2747] text-sm">
                        {loc.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/book?lot=${loc.id}`}
                    className="block w-full text-center py-2.5 bg-[#EFF6FF] hover:bg-[#1769E0] hover:text-white text-[#1769E0] font-semibold text-xs rounded-lg transition"
                  >
                    View Details & Reserve
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-[#0F2747] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to reserve your parking slot?
          </h2>
          <p className="text-[#94A3B8] text-sm max-w-xl mx-auto">
            Instant online booking, transparent hourly rates, and digital QR ticket gate admission.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 h-[46px] px-7 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-sm rounded-[10px] shadow-xs transition"
            >
              <span>Book Your Slot Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
