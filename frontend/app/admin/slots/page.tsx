'use client'

import React, { useEffect, useState } from 'react'
import { apiParking, apiSlots } from '@/services/api'
import { ParkingLot, ParkingSlot } from '@/types'
import { Grid3X3, Wrench, Shield, Loader2, CheckCircle2 } from 'lucide-react'

export default function AdminSlotsPage() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [selectedLotId, setSelectedLotId] = useState<string>('lot-1')
  const [slots, setSlots] = useState<ParkingSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const lots = await apiParking.getParkingLots()
      setParkingLots(lots)
      if (lots.length > 0) {
        const lotId = selectedLotId || lots[0].id
        const slotsData = await apiSlots.getSlotsForLot(lotId)
        setSlots(slotsData)
      }
      setIsLoading(false)
    }
    loadData()
  }, [selectedLotId])

  const handleToggleMaintenance = async (slot: ParkingSlot) => {
    const newStatus = slot.status === 'Maintenance' ? 'Available' : 'Maintenance'
    await apiSlots.updateSlotStatus(slot.id, newStatus)
    const updated = await apiSlots.getSlotsForLot(selectedLotId)
    setSlots(updated)
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Slot Grid Control</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Parking Slots Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time slot occupancy and flag maintenance bays across floors.
          </p>
        </div>

        {/* Parking Lot Selector */}
        <select
          value={selectedLotId}
          onChange={(e) => setSelectedLotId(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {parkingLots.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.city})
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Floor Plan & Bay Maintenance Ledger</h2>
            <span className="text-xs text-slate-500">{slots.length} Total Bays Configured</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {slots.map((s) => {
              const isOcc = ['Occupied', 'OCCUPIED'].includes(s.status)
              const isMaint = ['Maintenance', 'MAINTENANCE'].includes(s.status)

              let bg = 'bg-emerald-50 border-emerald-200 text-emerald-800'
              if (isOcc) bg = 'bg-slate-100 border-slate-200 text-slate-500'
              if (isMaint) bg = 'bg-red-50 border-red-200 text-red-700'

              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 text-center transition ${bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase">{s.section}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/80">{s.status}</span>
                  </div>

                  <div>
                    <p className="text-xl font-extrabold">{s.slotNumber}</p>
                    <p className="text-[10px] opacity-75">{s.vehicleType} Bay</p>
                  </div>

                  <button
                    onClick={() => handleToggleMaintenance(s)}
                    className="w-full py-1 bg-white/90 hover:bg-white text-[10px] font-bold rounded-lg border shadow-2xs transition"
                  >
                    {isMaint ? 'Clear Maintenance' : 'Flag Maintenance'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
