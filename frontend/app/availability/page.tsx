'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car, MapPin, Filter, Loader2 } from 'lucide-react'

interface Slot {
  id: string
  code: string
  zone: string
  floor?: string
  type: string
  rate: number
  status: 'available' | 'occupied' | 'maintenance'
}

export default function PublicAvailabilityPage() {
  const [selectedZone, setSelectedZone] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fallbackSlots: Slot[] = [
    { id: '1', code: 'A101', zone: 'Zone A', floor: 'Floor 1', type: '4W', rate: 50, status: 'available' },
    { id: '2', code: 'A102', zone: 'Zone A', floor: 'Floor 1', type: '4W', rate: 50, status: 'occupied' },
    { id: '3', code: 'A103', zone: 'Zone A', floor: 'Floor 1', type: '4W', rate: 50, status: 'available' },
    { id: '4', code: 'A104', zone: 'Zone A', floor: 'Floor 1', type: '2W', rate: 30, status: 'available' },
    { id: '5', code: 'A105', zone: 'Zone A', floor: 'Floor 1', type: '2W', rate: 30, status: 'occupied' },
    { id: '6', code: 'A106', zone: 'Zone A', floor: 'Floor 1', type: '4W', rate: 50, status: 'maintenance' },
    
    { id: '7', code: 'B201', zone: 'Zone B', floor: 'Floor 2', type: '4W', rate: 60, status: 'available' },
    { id: '8', code: 'B202', zone: 'Zone B', floor: 'Floor 2', type: '4W', rate: 60, status: 'occupied' },
    { id: '9', code: 'B203', zone: 'Zone B', floor: 'Floor 2', type: '4W', rate: 60, status: 'available' },
    { id: '10', code: 'B204', zone: 'Zone B', floor: 'Floor 2', type: '2W', rate: 35, status: 'available' },
    { id: '11', code: 'B205', zone: 'Zone B', floor: 'Floor 2', type: '2W', rate: 35, status: 'available' },
    { id: '12', code: 'B206', zone: 'Zone B', floor: 'Floor 2', type: '4W', rate: 60, status: 'occupied' },

    { id: '13', code: 'C301', zone: 'Zone C', floor: 'Floor 3', type: '4W', rate: 45, status: 'available' },
    { id: '14', code: 'C302', zone: 'Zone C', floor: 'Floor 3', type: '4W', rate: 45, status: 'available' },
    { id: '15', code: 'C303', zone: 'Zone C', floor: 'Floor 3', type: '2W', rate: 25, status: 'occupied' },
    { id: '16', code: 'C304', zone: 'Zone C', floor: 'Floor 3', type: '2W', rate: 25, status: 'available' },
  ]

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/slots/availability')
      const data = await res.json()
      if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
        const formatted: Slot[] = data.data.map((item: any) => ({
          id: item._id || item.id || `s-${Math.random()}`,
          code: item.slotNumber || item.code || 'A101',
          zone: item.zone || 'Zone A',
          floor: item.floor || 'Floor 1',
          type: item.vehicleType === '2-wheeler' ? '2W' : item.vehicleType === '4-wheeler' ? '4W' : item.vehicleType || '4W',
          rate: item.hourlyRate || item.rate || 50,
          status: item.status || 'available',
        }))
        setSlots(formatted)
      } else {
        setSlots(fallbackSlots)
      }
    } catch (err) {
      setSlots(fallbackSlots)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  const filteredSlots = slots.filter((slot) => {
    if (selectedZone !== 'All' && slot.zone !== selectedZone) return false
    if (selectedType !== 'All' && slot.type !== selectedType) return false
    return true
  })

  const availableCount = filteredSlots.filter((s) => s.status === 'available').length
  const occupiedCount = filteredSlots.filter((s) => s.status === 'occupied').length
  const maintenanceCount = filteredSlots.filter((s) => s.status === 'maintenance').length

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 text-[#172B4D]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 saas-card p-6 border border-[#E2E8F0]">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">REAL-TIME MONITOR</span>
            <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight mt-0.5">Live Parking Slot Availability</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Real-time floor layout grid synced with live parking sensors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="h-[42px] px-5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-[10px] shadow-xs transition flex items-center gap-2"
            >
              <Car className="w-4 h-4" /> Book a Slot Now
            </Link>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#F0FDF4] border border-[#86EFAC] p-4 rounded-xl flex items-center gap-3.5">
            <div className="size-10 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold text-base">
              {availableCount}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#15803D]">Available</p>
              <p className="text-[11px] text-[#16A34A]">Ready for instant booking</p>
            </div>
          </div>

          <div className="bg-[#FEF2F2] border border-[#FECACA] p-4 rounded-xl flex items-center gap-3.5">
            <div className="size-10 rounded-lg bg-[#DC2626] text-white flex items-center justify-center font-bold text-base">
              {occupiedCount}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#DC2626]">Occupied</p>
              <p className="text-[11px] text-[#DC2626]">Parked vehicles</p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-xl flex items-center gap-3.5">
            <div className="size-10 rounded-lg bg-[#64748B] text-white flex items-center justify-center font-bold text-base">
              {maintenanceCount}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#64748B]">Maintenance</p>
              <p className="text-[11px] text-[#64748B]">Out of service</p>
            </div>
          </div>

          <div className="saas-card p-4 border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#0F2747]">Live Status</p>
              <p className="text-[11px] text-[#64748B]">{loading ? 'Syncing...' : 'Connected'}</p>
            </div>
            <span className="size-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="saas-card p-4 border border-[#E2E8F0] flex flex-wrap items-center gap-5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#0F2747]">
            <Filter className="w-3.5 h-3.5 text-[#1769E0]" /> Filter By:
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#64748B]">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#172B4D] focus:border-[#1769E0]"
            >
              <option value="All">All Zones</option>
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#64748B]">Vehicle:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#172B4D] focus:border-[#1769E0]"
            >
              <option value="All">All Vehicles</option>
              <option value="4W">4-Wheeler (Car)</option>
              <option value="2W">2-Wheeler (Bike)</option>
            </select>
          </div>
        </div>

        {/* Interactive Slot Grid */}
        <div className="saas-card p-6 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#0F2747] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1769E0]" />
              Floor Layout Matrix ({filteredSlots.length} Slots)
            </h3>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#15803D]">
                <span className="size-2.5 rounded-full bg-[#16A34A]" /> Available
              </span>
              <span className="flex items-center gap-1.5 text-[#DC2626]">
                <span className="size-2.5 rounded-full bg-[#DC2626]" /> Occupied
              </span>
              <span className="flex items-center gap-1.5 text-[#64748B]">
                <span className="size-2.5 rounded-full bg-[#64748B]" /> Maintenance
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-[#1769E0] animate-spin mx-auto" />
              <p className="text-xs font-medium text-[#64748B]">Loading slot data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredSlots.map((slot) => {
                let cardStyle = 'bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]'
                let badgeText = 'Available'
                let isClickable = true

                if (slot.status === 'occupied') {
                  cardStyle = 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] cursor-not-allowed opacity-85'
                  badgeText = 'Occupied'
                  isClickable = false
                } else if (slot.status === 'maintenance') {
                  cardStyle = 'bg-[#F8FAFC] border-[#CBD5E1] text-[#64748B] cursor-not-allowed opacity-75'
                  badgeText = 'Maintenance'
                  isClickable = false
                }

                return (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between ${cardStyle}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-base">{slot.code}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-white/80 border border-current">
                          {slot.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium opacity-85">{slot.zone} {slot.floor ? `• ${slot.floor}` : ''}</p>
                      <p className="text-xs font-semibold mt-1">₹{slot.rate}/hr</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-current/20">
                      {isClickable ? (
                        <Link
                          href={`/book?slot=${slot.code}`}
                          className="block w-full text-center py-1.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-md transition shadow-xs"
                        >
                          Book {slot.code}
                        </Link>
                      ) : (
                        <span className="block w-full text-center py-1 text-[10px] font-medium uppercase tracking-wider opacity-80">
                          {badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
