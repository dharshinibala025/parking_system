'use client'

import React, { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { apiVehicles } from '@/services/api'
import { Vehicle, VehicleType } from '@/types'
import { Car, Plus, Trash2, CheckCircle2, Shield, Loader2, X } from 'lucide-react'

export default function VehiclesPage() {
  return (
    <ProtectedRoute>
      <VehiclesContent />
    </ProtectedRoute>
  )
}

function VehiclesContent() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form states
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fetchVehicles = async () => {
    setIsLoading(true)
    const data = await apiVehicles.getUserVehicles()
    setVehicles(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleNumber.trim()) {
      alert('Please enter a vehicle number.')
      return
    }

    setIsSaving(true)
    const res = await apiVehicles.addVehicle({
      vehicleNumber,
      vehicleType,
      model,
      color,
      isDefault,
    })

    if (res.success) {
      setIsModalOpen(false)
      setVehicleNumber('')
      setModel('')
      setColor('')
      setIsDefault(false)
      fetchVehicles()
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      await apiVehicles.deleteVehicle(id)
      fetchVehicles()
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Saved Vehicles
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add your vehicles to make booking faster and seamless.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 max-w-md mx-auto space-y-3">
            <Car className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Vehicles Registered</h3>
            <p className="text-xs text-slate-500">
              Add your vehicle details to easily select it during parking slot booking.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Car className="w-5 h-5" />
                    </div>
                    {v.isDefault && (
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-full">
                        DEFAULT VEHICLE
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-mono font-extrabold text-slate-900">{v.vehicleNumber}</h3>
                    <p className="text-xs text-slate-500 font-medium">{v.vehicleType} • {v.model || 'Standard'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Color: {v.color || 'White'}</span>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Add New Vehicle</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  placeholder="e.g. KA-01-MJ-4321"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="SUV">SUV</option>
                  <option value="EV">EV (Electric Vehicle)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Make / Model</label>
                <input
                  type="text"
                  placeholder="e.g. Honda City"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
                <input
                  type="text"
                  placeholder="e.g. White"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <label htmlFor="isDefault" className="text-xs font-semibold text-slate-700">Set as default vehicle</label>
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
                  {isSaving ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
