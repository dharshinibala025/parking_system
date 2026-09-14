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
  Zap,
  ShieldCheck,
  Navigation,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [location, setLocation] = useState('Central Plaza Mall')
  const [bookingDate, setBookingDate] = useState('2026-09-14')
  const [startTime, setStartTime] = useState('10:00')
  const [duration, setDuration] = useState('2')
  const [availableSlotsCount, setAvailableSlotsCount] = useState(42)

  // Dynamic live slot counter oscillation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableSlotsCount((prev) => Math.max(35, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1))))
    }, 5000)
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
      location: 'Downtown Financial District',
      slots: '18 Available Slots',
      price: '$5.00/hour',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    },
    {
      id: 'lot-[#2]',
      name: 'Metro Grand Station',
      location: 'Transit Hub Terminal A',
      slots: '14 Available Slots',
      price: '$4.50/hour',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    },
    {
      id: 'lot-3',
      name: 'Tech Innovation Park',
      location: 'Silicon Boulevard',
      slots: '10 Available Slots',
      price: '$4.00/hour',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
    },
  ]

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans text-[#2C3E50] overflow-x-hidden">
      {/* HERO SECTION WITH FROSTED AURA AMBIENT ANIMATED MESH */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-[#D4DDE2]/50">
        {/* Ambient Gradient Mesh Background Elements */}
        <div className="absolute -top-20 -left-20 w-[35rem] h-[35rem] rounded-full bg-[#5C7E8F]/20 blur-3xl animate-ambient-glow pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[40rem] h-[40rem] rounded-full bg-[#D4DDE2]/70 blur-3xl animate-ambient-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#5C7E8F]/15 blur-2xl animate-ambient-glow pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN: HERO HEADLINE */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider border border-[#5C7E8F]/20">
                <Sparkles className="w-4 h-4 text-[#5C7E8F]" />
                Frosted Aura Smart Parking System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2C3E50] tracking-tight leading-[1.12]">
                Guaranteed Parking. <br className="hidden sm:block" />
                <span className="text-[#5C7E8F]">Zero Waiting.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#718096] max-w-xl font-normal leading-relaxed">
                Browse color-coded parking slots in real time, lock in your spot in seconds, and scan your instant QR code at entry.
              </p>

              {/* LIVE AVAILABILITY COUNTER BADGE */}
              <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl glass-card border border-[#D4DDE2]">
                <div className="size-3.5 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-xs sm:text-sm font-bold text-[#2C3E50]">
                  <span className="text-emerald-600 font-extrabold text-base mr-1.5">{availableSlotsCount} slots</span>
                  free right now across prime zones
                </p>
                <Link href="/availability" className="text-xs font-bold text-[#5C7E8F] underline hover:text-[#4A6776] ml-2">
                  View Map
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/book"
                  className="px-8 py-4 rounded-xl bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-base shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Book Your Spot Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl bg-white/80 hover:bg-[#D4DDE2]/40 text-[#5C7E8F] font-bold text-base border border-[#D4DDE2] shadow-sm flex items-center justify-center transition"
                >
                  How It Works
                </a>
              </div>

              {/* Trust statement */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#718096]">
                <span className="flex items-center gap-1.5 text-[#2C3E50]">
                  <Check className="w-4 h-4 text-[#5C7E8F] stroke-[3]" /> Instant QR Entry
                </span>
                <span className="flex items-center gap-1.5 text-[#2C3E50]">
                  <Check className="w-4 h-4 text-[#5C7E8F] stroke-[3]" /> Live Slot Status
                </span>
                <span className="flex items-center gap-1.5 text-[#2C3E50]">
                  <Check className="w-4 h-4 text-[#5C7E8F] stroke-[3]" /> Flexible Cancellation
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: FROSTED GLASS SLOT PREVIEW DEMO */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                <div className="glass-card p-6 sm:p-7 rounded-3xl border border-[#D4DDE2] shadow-2xl relative z-10 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#D4DDE2]/60">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-2xl bg-[#D4DDE2] text-[#5C7E8F] flex items-center justify-center shadow-xs">
                        <MapPin className="size-6 text-[#5C7E8F]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#2C3E50] text-sm sm:text-base">Central Plaza • Zone A</h3>
                        <p className="text-xs text-[#718096] flex items-center gap-1">
                          <Navigation className="size-3 text-[#5C7E8F]" /> Floor 1 • 4W & 2W Bays
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Live Grid
                    </span>
                  </div>

                  {/* Interactive Visual Slot Matrix */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#2C3E50] mb-3">
                      <span>Interactive Slot Matrix</span>
                      <span className="text-[#5C7E8F] bg-[#D4DDE2]/40 px-2.5 py-0.5 rounded-full font-semibold">$5.00/hr</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5">
                      {[
                        { code: 'A1', status: 'available' },
                        { code: 'A2', status: 'selected' },
                        { code: 'A3', status: 'occupied' },
                        { code: 'A4', status: 'available' },
                        { code: 'B1', status: 'occupied' },
                        { code: 'B2', status: 'available' },
                        { code: 'B3', status: 'maintenance' },
                        { code: 'B4', status: 'available' },
                      ].map((slot) => {
                        let styleClass = 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        let statusText = 'Free'
                        if (slot.status === 'selected') {
                          styleClass = 'bg-[#5C7E8F] text-white border-[#4A6776] shadow-md ring-2 ring-[#5C7E8F]/40'
                          statusText = 'Selected'
                        } else if (slot.status === 'occupied') {
                          styleClass = 'bg-rose-50 text-rose-700 border-rose-200 opacity-75'
                          statusText = 'Occupied'
                        } else if (slot.status === 'maintenance') {
                          styleClass = 'bg-[#A2A2A2]/20 text-[#718096] border-[#A2A2A2]/40'
                          statusText = 'Maint.'
                        }

                        return (
                          <div
                            key={slot.code}
                            className={`p-3 rounded-2xl border text-center font-bold text-xs transition duration-200 ${styleClass}`}
                          >
                            <Car className={`size-4 mx-auto mb-1 ${slot.status === 'selected' ? 'text-white' : slot.status === 'occupied' ? 'text-rose-500' : 'text-[#5C7E8F]'}`} />
                            <span className="block font-black text-xs">{slot.code}</span>
                            <span className="block text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">{statusText}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Slot Booking Shortcut Box */}
                  <div className="bg-[#D4DDE2]/40 p-4 rounded-2xl border border-[#D4DDE2] flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[#718096] font-medium">Selected Preview Slot</p>
                      <p className="text-sm font-black text-[#2C3E50]">Slot A2 • <span className="text-[#5C7E8F]">4-Wheeler</span></p>
                    </div>
                    <Link
                      href="/book?slot=A2"
                      className="px-4 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white rounded-xl font-bold shadow-xs transition"
                    >
                      Book Slot A2
                    </Link>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-white/95 p-3.5 rounded-2xl shadow-xl border border-[#D4DDE2] hidden sm:flex items-center gap-3 z-20">
                  <div className="size-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C3E50]">Encrypted Booking</p>
                    <p className="text-[11px] text-[#718096]">Automatic QR Receipt</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK BOOKING SEARCH BAR */}
      <section className="-mt-12 relative z-30 max-w-6xl mx-auto px-6">
        <form
          onSubmit={handleSearch}
          className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#D4DDE2]"
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2C3E50] flex items-center gap-2">
              <Search className="w-5 h-5 text-[#5C7E8F]" />
              Quick Parking Slot Finder
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                Zone / Mall
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#A2A2A2] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Central Plaza"
                  className="w-full pl-10 pr-3 py-3 bg-white border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#5C7E8F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#A2A2A2] absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#5C7E8F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                Start Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#A2A2A2] absolute left-3.5 top-3.5" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#5C7E8F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2">
                Duration (Hours)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#D4DDE2] rounded-xl text-sm font-semibold text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#5C7E8F]"
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="4">4 Hours</option>
                <option value="8">8 Hours (Full Day)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Check Availability
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* HOW IT WORKS SECTION (3-STEP: CHOOSE SLOT -> BOOK -> PARK) */}
      <section id="how-it-works" className="py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#5C7E8F]">
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50]">
              How ParkEase Works
            </h2>
            <p className="text-sm text-[#718096]">
              Reserve your slot in under 60 seconds with instant QR validation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-card p-8 rounded-3xl border border-[#D4DDE2] hover:shadow-xl transition duration-300 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5C7E8F] text-white font-black text-xl flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50]">Choose Your Slot</h3>
              <p className="text-sm text-[#718096] leading-relaxed font-normal">
                Browse our real-time interactive parking grid. Filter slots by floor, vehicle type (2W/4W), and rate.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 rounded-3xl border border-[#D4DDE2] hover:shadow-xl transition duration-300 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5C7E8F] text-white font-black text-xl flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50]">Book & Pay</h3>
              <p className="text-sm text-[#718096] leading-relaxed font-normal">
                Select your start time and estimated duration. Review auto-calculated pricing and complete booking with simulated gateway.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 rounded-3xl border border-[#D4DDE2] hover:shadow-xl transition duration-300 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5C7E8F] text-white font-black text-xl flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50]">Park Hassle-Free</h3>
              <p className="text-sm text-[#718096] leading-relaxed font-normal">
                Receive your digital QR code ticket. Drive straight to your reserved bay and scan for entry & exit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PARKING LOCATIONS */}
      <section className="py-24 bg-[#F7FAFC] border-t border-[#D4DDE2]/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50]">
              Featured Parking Locations
            </h2>
            <p className="text-[#718096] text-sm">
              Equipped with live IoT sensors & instant QR entry scanners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-3xl border border-[#D4DDE2] overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#2C3E50] shadow-xs flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {loc.rating}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-[#2C3E50]">{loc.name}</h3>
                    <p className="text-xs font-semibold text-[#718096] flex items-center gap-1.5">
                      <MapPin className="size-4 text-[#5C7E8F]" />
                      {loc.location}
                    </p>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {loc.slots}
                      </span>
                      <span className="font-bold text-[#5C7E8F] text-sm">
                        {loc.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/book"
                    className="block w-full text-center py-3 bg-[#D4DDE2]/40 hover:bg-[#5C7E8F] hover:text-white text-[#5C7E8F] font-bold text-xs rounded-xl transition duration-200"
                  >
                    View Slots & Reserve
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-[#5C7E8F] text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Ready to park with zero hassle?
          </h2>
          <p className="text-[#D4DDE2] text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Choose your slot now, generate your QR pass, and enjoy guaranteed parking.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-9 py-4 bg-white text-[#5C7E8F] font-black text-base rounded-xl shadow-xl hover:bg-[#D4DDE2] transition transform hover:-translate-y-0.5"
            >
              <span>Book Your Parking Slot Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
