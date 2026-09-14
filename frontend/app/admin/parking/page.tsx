'use client'

import React, { useEffect, useState } from 'react'
import { apiParking } from '@/services/api'
import { ParkingLot, ParkingType } from '@/types'
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Loader2,
  X,
  Shield,
} from 'lucide-react'

export default function AdminParkingPage() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [pricePerHour, setPricePerHour] = useState(50)
  const [totalSlots, setTotalSlots] = useState(24)
  const [parkingType, setParkingType] = useState<ParkingType>('Covered')
  const [image, setImage] = useState('')
  const [openingTime, setOpeningTime] = useState('06:00 AM')
  const [closingTime, setClosingTime] = useState('11:00 PM')
  const [status, setStatus] = useState<'active' | 'maintenance' | 'closed'>('active')
  const [isSaving, setIsSaving] = useState(false)

  const fetchLots = async () => {
    setIsLoading(true)
    const data = await apiParking.getParkingLots()
    setParkingLots(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchLots()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingLot(null)
    setName('')
    setAddress('')
    setCity('Bengaluru')
    setDescription('')
    setPricePerHour(50)
    setTotalSlots(24)
    setParkingType('Covered')
    setImage('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80')
    setOpeningTime('06:00 AM')
    setClosingTime('11:00 PM')
    setStatus('active')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (lot: ParkingLot) => {
    setEditingLot(lot)
    setName(lot.name)
    setAddress(lot.address)
    setCity(lot.city)
    setDescription(lot.description)
    setPricePerHour(lot.pricePerHour)
    setTotalSlots(lot.totalSlots)
    setParkingType(lot.parkingType)
    setImage(lot.image)
    setOpeningTime(lot.openingTime)
    setClosingTime(lot.closingTime)
    setStatus(lot.status)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload: Partial<ParkingLot> = {
      name,
      address,
      city,
      description,
      pricePerHour: Number(pricePerHour),
      totalSlots: Number(totalSlots),
      parkingType,
      image,
      openingTime,
      closingTime,
      status,
      amenities: ['CCTV', 'Security', 'Covered Parking'],
    }

    if (editingLot) {
      await apiParking.updateParkingLot(editingLot.id, payload)
    } else {
      await apiParking.createParkingLot(payload)
    }

    setIsSaving(false)
    setIsModalOpen(false)
    fetchLots()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this parking lot?')) {
      await apiParking.deleteParkingLot(id)
      fetchLots()
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Admin Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Parking Lots Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and manage parking facilities, rates, and operational status.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Parking Lot
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingLots.map((lot) => (
            <div key={lot.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="relative h-44">
                  <img src={lot.image} alt={lot.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800">
                    {lot.parkingType}
                  </span>
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    ₹{lot.pricePerHour}/hr
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{lot.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {lot.address}, {lot.city}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-600">Total Slots: <strong className="text-slate-900">{lot.totalSlots}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">
                      {lot.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(lot)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(lot.id)}
                  className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editingLot ? 'Edit Parking Lot' : 'Add New Parking Lot'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price Per Hour (₹)</label>
                  <input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parking Type</label>
                  <select
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="Covered">Covered</option>
                    <option value="Basement">Basement</option>
                    <option value="Open">Open</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Slots</label>
                  <input
                    type="number"
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-1/2 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Save Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
