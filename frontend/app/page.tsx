'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Search,
  ShieldCheck,
  Zap,
  QrCode,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [city, setCity] = useState('Bengaluru')
  const [bookingDate, setBookingDate] = useState('2026-09-14')
  const [startTime, setStartTime] = useState('12:00')
  const [endTime, setEndTime] = useState('14:00')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = new URLSearchParams({ city, date: bookingDate, startTime, endTime })
    router.push(`/find-parking?${query.toString()}`)
  }

  const popularLots = [
    {
      id: 'lot-1',
      name: 'ParkEase Central Hub',
      address: '100 MG Road, Central Business District',
      city: 'Bengaluru',
      price: 50,
      rating: 4.8,
      available: 22,
      total: 32,
      type: 'Covered',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    },
    {
      id: 'lot-2',
      name: 'City Mall Underground Hub',
      address: '45 Forum Avenue, Koramangala',
      city: 'Bengaluru',
      price: 40,
      rating: 4.6,
      available: 16,
      total: 24,
      type: 'Basement',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    },
    {
      id: 'lot-3',
      name: 'Airport Express Parking Plaza',
      address: 'Terminal 1 Expressway, Devanahalli',
      city: 'Bengaluru',
      price: 80,
      rating: 4.9,
      available: 28,
      total: 40,
      type: 'Open',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
    },
  ]

  const faqs = [
    {
      q: 'How does ParkEase work?',
      a: 'ParkEase allows you to search for nearby parking facilities, view live slot availability, select your preferred parking bay, pay online, and receive a digital ticket with a QR code for seamless entrance.',
    },
    {
      q: 'Can I select a specific parking slot?',
      a: 'Yes! ParkEase features an interactive visual floor plan layout where you can choose exact bays (e.g. A01, B04) marked with EV charging or accessible facilities.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'ParkEase supports simulated instant digital payments including UPI, Credit/Debit Cards, and Cash at Parking.',
    },
    {
      q: 'How do I access the parking lot upon arrival?',
      a: 'Once your booking is confirmed, you will receive a digital ticket containing a unique QR code. Show or scan this QR code at the entrance checkpoint.',
    },
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Online Parking Slot Booking & Management System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Find your perfect <span className="text-blue-600 underline decoration-blue-200 decoration-wavy">parking spot.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Book a parking space in advance and park without the hassle. Real-time availability, interactive slot selection, and instant confirmation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/find-parking"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  Find Parking <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-base border border-slate-200 shadow-xs flex items-center justify-center transition"
                >
                  How It Works
                </a>
              </div>

              {/* Feature Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0 text-slate-600 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Guaranteed Reserved Slot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Instant QR Code Ticket</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>24/7 Gate Clearance</span>
                </div>
              </div>
            </div>

            {/* Right Visual Hero Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glassmorphic Card */}
                <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">ParkEase Central Hub</h3>
                        <p className="text-xs text-slate-500">100 MG Road, Bengaluru</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">
                      AVAILABLE
                    </span>
                  </div>

                  {/* Visual Slot Layout Preview */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                      <span>Visual Slot Layout</span>
                      <span className="text-blue-600">Floor 1 • Section A</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08'].map((slot, idx) => {
                        const isSelected = idx === 1
                        const isOccupied = idx === 2 || idx === 6
                        return (
                          <div
                            key={slot}
                            className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                                : isOccupied
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            <span className="block text-[10px] opacity-75 font-normal">Bay</span>
                            {slot}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-slate-500">Hourly Rate</p>
                      <p className="text-base font-bold text-slate-900">₹50<span className="text-xs text-slate-500 font-normal">/hr</span></p>
                    </div>
                    <Link
                      href="/find-parking"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition"
                    >
                      Book Slot A02
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK SEARCH BAR SECTION */}
      <section className="-mt-10 relative z-20 max-w-6xl mx-auto px-4">
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City / Location
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. Bengaluru)"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Start Time
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              End Time
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
            >
              <Search className="w-4 h-4" /> Search Parking
            </button>
          </div>
        </form>
      </section>

      {/* WHY PARKEASE SECTION */}
      <section className="py-24 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Why Choose ParkEase</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              The smartest, stress-free way to reserve your parking.
            </p>
            <p className="text-slate-600 text-sm">
              Eliminate driving around looking for open spots. ParkEase gives you full visibility and instant reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Live Availability</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View real-time slot occupancy data across commercial hubs, malls, airports, and private carparks before you arrive.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Visual Slot Selection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick your specific bay (A01, B04) with EV charging support or accessible parking options right from the interactive map grid.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital QR Pass</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive an instant digital ticket with a scannable QR code for touchless entry and exit verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Simple 4-Step Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How ParkEase Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Search Parking', desc: 'Enter your destination city, date, and preferred time window.' },
              { step: '02', title: 'Select Your Slot', desc: 'Choose your desired parking bay from our visual floor plan grid.' },
              { step: '03', title: 'Simulated Payment', desc: 'Pay safely using UPI, Card, or Cash at Parking.' },
              { step: '04', title: 'Park With Ease', desc: 'Show your QR code ticket at the entrance and park hassle-free.' },
            ].map((s, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                <span className="text-3xl font-black text-blue-600/30 font-mono">{s.step}</span>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR LOCATIONS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Featured Locations</h2>
              <p className="text-3xl font-extrabold text-slate-900">Popular Parking Hubs</p>
            </div>
            <Link
              href="/find-parking"
              className="mt-4 md:mt-0 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All Locations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                    {lot.type}
                  </div>
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                    ₹{lot.price}/hr
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {lot.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {lot.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" /> {lot.rating}
                    </div>
                    <div className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      {lot.available} slots free
                    </div>
                  </div>

                  <Link
                    href={`/parking/${lot.id}`}
                    className="block w-full text-center py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold text-xs rounded-xl transition"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Frequently Asked Questions</h2>
            <p className="text-3xl font-extrabold text-slate-900">Got Questions? We Have Answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to book your stress-free parking slot?
          </h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto mb-8">
            Join ParkEase today. Find available parking near you and park with confidence.
          </p>
          <Link
            href="/find-parking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:bg-blue-50 transition"
          >
            Find Parking Now <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}
