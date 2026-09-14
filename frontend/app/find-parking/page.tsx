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
      price: '$5.00/hr',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    },
    {
      id: 'lot-2',
      name: 'Metro Grand Terminal Parking',
      location: 'Transit Station Plaza B',
      availableSlots: 14,
      price: '$4.50/hr',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    },
    {
      id: 'lot-3',
      name: 'Silicon Tech Tower Bay',
      location: 'Innovation Corridor Floor 2',
      availableSlots: 10,
      price: '$4.00/hr',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
    },
  ]

  const filtered = parkingLots.filter((lot) =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Parking Explorer
            </span>
            <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Find & Reserve Parking Bays</h1>
            <p className="text-sm text-[#718096] mt-1">
              Check live slots across major mall & office garages
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A2A2A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location name..."
                className="pl-10 pr-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#5C7E8F]"
              />
            </div>
            <Link
              href="/book"
              className="px-5 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Car className="w-4 h-4" /> Go to Book Slot Map
            </Link>
          </div>
        </div>

        {/* Locations List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((lot) => (
            <div
              key={lot.id}
              className="glass-card rounded-3xl border border-[#D4DDE2] overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={lot.image} alt={lot.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#2C3E50] flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {lot.rating}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-[#2C3E50]">{lot.name}</h3>
                  <p className="text-xs font-semibold text-[#718096] flex items-center gap-1.5">
                    <MapPin className="size-4 text-[#5C7E8F]" />
                    {lot.location}
                  </p>

                  <div className="pt-3 border-t border-[#D4DDE2] flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {lot.availableSlots} Slots Free
                    </span>
                    <span className="font-bold text-[#5C7E8F] text-sm">{lot.price}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/book?lot=${lot.id}`}
                  className="block w-full text-center py-3 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1"
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
