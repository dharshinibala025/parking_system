'use client'

import React, { useState } from 'react'
import {
  Grid3X3,
  Wrench,
  Shield,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  DollarSign,
  Car,
} from 'lucide-react'

interface Slot {
  id: string
  slotNumber: string
  zone: string
  floor: string
  vehicleType: '2W' | '4W'
  hourlyRate: number
  status: 'available' | 'occupied' | 'maintenance'
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([
    { id: '1', slotNumber: 'A101', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'available' },
    { id: '2', slotNumber: 'A102', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'occupied' },
    { id: '3', slotNumber: 'A103', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'available' },
    { id: '4', slotNumber: 'A104', zone: 'Zone A', floor: 'Floor 1', vehicleType: '2W', hourlyRate: 3.0, status: 'available' },
    { id: '5', slotNumber: 'A105', zone: 'Zone A', floor: 'Floor 1', vehicleType: '2W', hourlyRate: 3.0, status: 'occupied' },
    { id: '6', slotNumber: 'A106', zone: 'Zone A', floor: 'Floor 1', vehicleType: '4W', hourlyRate: 5.0, status: 'maintenance' },

    { id: '7', slotNumber: 'B201', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 6.0, status: 'available' },
    { id: '8', slotNumber: 'B202', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 6.0, status: 'occupied' },
    { id: '9', slotNumber: 'B203', zone: 'Zone B', floor: 'Floor 2', vehicleType: '4W', hourlyRate: 6.0, status: 'available' },
    { id: '10', slotNumber: 'B204', zone: 'Zone B', floor: 'Floor 2', vehicleType: '2W', hourlyRate: 3.5, status: 'available' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newSlotNumber, setNewSlotNumber] = useState('')
  const [newZone, setNewZone] = useState('Zone A')
  const [newFloor, setNewFloor] = useState('Floor 1')
  const [newVehicleType, setNewVehicleType] = useState<'2W' | '4W'>('4W')
  const [newHourlyRate, setNewHourlyRate] = useState<number>(5.0)

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlotNumber.trim()) return

    const newSlot: Slot = {
      id: `s-${Date.now()}`,
      slotNumber: newSlotNumber.trim().toUpperCase(),
      zone: newZone,
      floor: newFloor,
      vehicleType: newVehicleType,
      hourlyRate: Number(newHourlyRate),
      status: 'available',
    }

    setSlots([...slots, newSlot])
    setShowAddModal(false)
    setNewSlotNumber('')
  }

  const handleToggleMaintenance = (id: string) => {
    setSlots(
      slots.map((s) =>
        s.id === id ? { ...s, status: s.status === 'maintenance' ? 'available' : 'maintenance' } : s
      )
    )
  }

  const handleDeleteSlot = (id: string) => {
    if (confirm('Are you sure you want to delete this slot?')) {
      setSlots(slots.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Slot Configuration
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Slot Management</h1>
          <p className="text-sm text-[#718096] mt-1">
            Add new bays, adjust hourly pricing, set vehicle types (2W/4W), and toggle maintenance mode.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Slot
        </button>
      </div>

      {/* Slot Grid Ledger */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#D4DDE2]/60 pb-4">
          <h2 className="text-lg font-bold text-[#2C3E50]">All Parking Bays ({slots.length} Slots)</h2>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-700">Available ({slots.filter((s) => s.status === 'available').length})</span>
            <span className="text-rose-700">Occupied ({slots.filter((s) => s.status === 'occupied').length})</span>
            <span className="text-slate-600">Maintenance ({slots.filter((s) => s.status === 'maintenance').length})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slots.map((s) => {
            let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-300'
            if (s.status === 'occupied') statusBadge = 'bg-rose-50 text-rose-700 border-rose-200'
            if (s.status === 'maintenance') statusBadge = 'bg-slate-100 text-slate-600 border-slate-300'

            return (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-[#D4DDE2] bg-white flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-[#2C3E50]">{s.slotNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusBadge}`}>
                    {s.status}
                  </span>
                </div>

                <div className="text-xs text-[#718096] space-y-1">
                  <p className="font-semibold text-[#2C3E50]">{s.zone} • {s.floor}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#D4DDE2]/40 text-[#5C7E8F] font-bold text-[10px] uppercase">
                      {s.vehicleType}
                    </span>
                    <span className="font-bold text-[#5C7E8F]">${s.hourlyRate.toFixed(2)} / hr</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D4DDE2]/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleMaintenance(s.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                      s.status === 'maintenance'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-[#718096] hover:bg-slate-100'
                    }`}
                  >
                    {s.status === 'maintenance' ? 'Clear Maintenance' : 'Set Maintenance'}
                  </button>

                  <button
                    onClick={() => handleDeleteSlot(s.id)}
                    className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white p-8 rounded-3xl border border-[#D4DDE2] max-w-md w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4DDE2]/60 pb-3">
              <h3 className="text-xl font-black text-[#2C3E50]">Add New Parking Slot</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#A2A2A2] hover:text-[#2C3E50]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                  Slot Number / Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. C305"
                  value={newSlotNumber}
                  onChange={(e) => setNewSlotNumber(e.target.value)}
                  className="w-full bg-white border border-[#D4DDE2] rounded-xl px-4 py-2.5 text-sm font-bold uppercase text-[#2C3E50]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Zone</label>
                  <select
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full bg-white border border-[#D4DDE2] rounded-xl px-3 py-2 text-xs font-bold text-[#2C3E50]"
                  >
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone C">Zone C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Floor</label>
                  <select
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="w-full bg-white border border-[#D4DDE2] rounded-xl px-3 py-2 text-xs font-bold text-[#2C3E50]"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">Type</label>
                  <select
                    value={newVehicleType}
                    onChange={(e) => setNewVehicleType(e.target.value as any)}
                    className="w-full bg-white border border-[#D4DDE2] rounded-xl px-3 py-2 text-xs font-bold text-[#2C3E50]"
                  >
                    <option value="4W">4W (Car)</option>
                    <option value="2W">2W (Bike)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHourlyRate}
                    onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                    className="w-full bg-white border border-[#D4DDE2] rounded-xl px-3 py-2 text-xs font-bold text-[#2C3E50]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-white border border-[#D4DDE2] text-[#2C3E50] font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
