'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { apiParking } from '@/services/api'
import { ParkingLot } from '@/types'
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  Star,
  Car,
  Zap,
  Shield,
  ArrowUpDown,
  Map as MapIcon,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react'

export default function FindParkingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <FindParkingContent />
    </Suspense>
  )
}

function FindParkingContent() {
  const searchParams = useSearchParams()

  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [parkingType, setParkingType] = useState(searchParams.get('parkingType') || '')
  const [vehicleType, setVehicleType] = useState(searchParams.get('vehicleType') || '')
  const [sortBy, setSortBy] = useState('recommended')

  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileMap, setShowMobileMap] = useState(false)

  const fetchLots = async () => {
    setIsLoading(true)
    const data = await apiParking.getParkingLots({
      city: searchCity || undefined,
      search: searchTerm || undefined,
      parkingType: parkingType || undefined,
      vehicleType: vehicleType || undefined,
    })
    setParkingLots(data)
    if (data.length > 0) setSelectedLot(data[0])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchLots()
  }, [searchCity, parkingType, vehicleType])

  // Sorting
  const sortedLots = [...parkingLots].sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerHour - b.pricePerHour
    if (sortBy === 'price-high') return b.pricePerHour - a.pricePerHour
    if (sortBy === 'availability') return b.availableSlots - a.availableSlots
    return b.rating - a.rating // recommended
  })

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Search Banner */}
      <div className="bg-white border-b border-slate-200/80 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find a parking spot near you
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your destination to view live available parking slots and prices.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="City (e.g. Bengaluru)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={parkingType}
              onChange={(e) => setParkingType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Parking Types</option>
              <option value="Covered">Covered</option>
              <option value="Basement">Basement</option>
              <option value="Open">Open</option>
            </select>

            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Vehicle Types</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="SUV">SUV</option>
              <option value="EV">EV</option>
            </select>

            <button
              onClick={fetchLots}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Filter Results
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Controls bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-600">
            Showing <span className="text-slate-900">{sortedLots.length}</span> parking locations
          </p>

          <div className="flex items-center gap-3">
            {/* Mobile map view toggle */}
            <button
              onClick={() => setShowMobileMap(!showMobileMap)}
              className="lg:hidden px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <MapIcon className="w-3.5 h-3.5 text-blue-600" />
              {showMobileMap ? 'View List' : 'View Map'}
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none text-xs"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="availability">Highest Availability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Side-by-side desktop layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Results List Column */}
          <div className={`lg:col-span-7 space-y-4 ${showMobileMap ? 'hidden lg:block' : 'block'}`}>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white p-4 rounded-3xl border border-slate-200/80 animate-pulse space-y-3">
                    <div className="h-40 bg-slate-200 rounded-2xl"></div>
                    <div className="h-4 bg-slate-200 w-3/4 rounded"></div>
                    <div className="h-3 bg-slate-100 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : sortedLots.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Parking Locations Found</h3>
                <p className="text-xs text-slate-500">
                  We couldn't find parking spaces matching your criteria. Try adjusting your city or search filter.
                </p>
                <button
                  onClick={() => {
                    setSearchCity('')
                    setSearchTerm('')
                    setParkingType('')
                    setVehicleType('')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              sortedLots.map((lot) => {
                const isSelected = selectedLot?.id === lot.id
                return (
                  <div
                    key={lot.id}
                    onClick={() => setSelectedLot(lot)}
                    className={`bg-white rounded-3xl border p-4 sm:p-5 transition cursor-pointer flex flex-col sm:flex-row gap-5 ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200/80 hover:border-blue-300 shadow-xs'
                    }`}
                  >
                    {/* Image */}
                    <div className="sm:w-48 h-36 sm:h-auto rounded-2xl overflow-hidden relative shrink-0">
                      <img src={lot.image} alt={lot.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-800">
                        {lot.parkingType}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 transition">
                            {lot.name}
                          </h3>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {lot.rating}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {lot.address}
                        </p>

                        {/* Amenities Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {lot.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Details & CTA */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Price</p>
                          <p className="text-sm font-extrabold text-slate-900">
                            ₹{lot.pricePerHour}<span className="text-xs text-slate-500 font-normal">/hr</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                            {lot.availableSlots} slots free
                          </span>

                          <Link
                            href={`/parking/${lot.id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                          >
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Interactive Map Area Column */}
          <div className={`lg:col-span-5 sticky top-20 ${showMobileMap ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-blue-600" /> Interactive Location Map
                </h3>
                <span className="text-xs text-slate-500">Live GPS Grid</span>
              </div>

              {/* Map Preview Visual Container */}
              <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex flex-col justify-between p-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                
                {/* Simulated Pins */}
                <div className="absolute inset-0 p-6 flex flex-col justify-around items-center pointer-events-none">
                  {parkingLots.slice(0, 4).map((lot, idx) => {
                    const isSelected = selectedLot?.id === lot.id
                    return (
                      <div
                        key={lot.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedLot(lot)
                        }}
                        className={`pointer-events-auto cursor-pointer transition transform hover:scale-110 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg ${
                          isSelected
                            ? 'bg-blue-600 text-white ring-4 ring-blue-300 z-20'
                            : 'bg-white text-slate-900 border border-slate-200 z-10'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>₹{lot.pricePerHour}/hr</span>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Lot Popover Card */}
                {selectedLot && (
                  <div className="mt-auto bg-white/95 backdrop-blur p-3 rounded-2xl shadow-xl border border-slate-200/80 relative z-30 flex items-center gap-3">
                    <img src={selectedLot.image} alt={selectedLot.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{selectedLot.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{selectedLot.address}</p>
                      <p className="text-xs font-extrabold text-blue-600 mt-0.5">₹{selectedLot.pricePerHour}/hr</p>
                    </div>
                    <Link
                      href={`/parking/${selectedLot.id}`}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shrink-0 hover:bg-blue-700"
                    >
                      Book
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
