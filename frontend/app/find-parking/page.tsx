'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  MapPin,
  Filter,
  Star,
  Car,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react'

export default function FindParkingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#D4DDE2] border-t-[#5C7E8F] rounded-full animate-spin" />
      </div>
    }>
      <FindParkingContent />
    </Suspense>
  )
}

function FindParkingContent() {
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '')
  const [selectedType, setSelectedType] = useState('All')

  const parkingLots = [
    {
      id: 'lot-1',
      name: 'Central Plaza Mall Bay',
      location: 'Financial District, Main Blvd',
      availableSlots: 18,
      price: '₹50/hr',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    },
    {
      id: 'lot-2',
      name: 'Metro Grand Terminal Parking',
      location: 'Transit Station Plaza B',
      availableSlots: 14,
      price: '₹45/hr',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    },
    {
      id: 'lot-3',
      name: 'Silicon Tech Tower Bay',
      location: 'Innovation Corridor Floor 2',
      availableSlots: 10,
      price: '₹40/hr',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
    },
  ]

  const filtered = parkingLots.filter((lot) =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1769E0] text-[12px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Parking Explorer
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2747] tracking-tight">Find & Reserve Parking Bays</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Check live real-time available slots across major commercial garages
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location name..."
                className="pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-lg text-[13px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
              />
            </div>
            <Link
              href="/book"
              className="px-4 py-2 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Car className="w-4 h-4" /> Go to Book Slot Map
            </Link>
          </div>
        </div>

        {/* Locations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#1769E0]/40 hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img src={lot.image} alt={lot.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur px-2.5 py-0.5 rounded-md text-[12px] font-semibold text-[#0F2747] flex items-center gap-1 shadow-xs">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {lot.rating}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="text-[16px] font-bold text-[#0F2747]">{lot.name}</h3>
                  <p className="text-[13px] text-[#64748B] flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-[#1769E0] shrink-0" />
                    {lot.location}
                  </p>

                  <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md border border-[#86EFAC]">
                      {lot.availableSlots} Slots Free
                    </span>
                    <span className="font-bold text-[#1769E0] text-[14px]">{lot.price}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/book?lot=${lot.id}`}
                  className="block w-full text-center py-2.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                >
                  <span>Select & Book Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
