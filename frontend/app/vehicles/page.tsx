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
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2747] tracking-tight">
              My Saved Vehicles
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Manage saved vehicle license plates for fast slot reservations.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[14px] rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-7 h-7 text-[#1769E0] animate-spin" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-[#E2E8F0] shadow-xs max-w-md mx-auto space-y-3">
              <Car className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <h3 className="text-[16px] font-bold text-[#0F2747]">No Vehicles Saved Yet</h3>
              <p className="text-[13px] text-[#64748B]">
                Add your license plate details to easily select it during parking slot booking.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[13px] rounded-lg shadow-xs"
              >
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center font-bold">
                        <Car className="w-5 h-5" />
                      </div>
                      {v.isDefault && (
                        <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#1769E0] text-[10px] font-bold rounded-md border border-[#1769E0]/20">
                          DEFAULT VEHICLE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-mono font-bold text-[#0F2747]">{v.vehicleNumber}</h3>
                      <p className="text-[13px] text-[#64748B] font-medium">{v.vehicleType} • {v.model || 'Standard'}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[13px]">
                    <span className="text-[#64748B]">Color: {v.color || 'White'}</span>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition"
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
          <div className="fixed inset-0 z-50 bg-[#0F2747]/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-lg border border-[#E2E8F0] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h2 className="text-[17px] font-bold text-[#0F2747]">Add New Vehicle</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md text-[#94A3B8] hover:bg-[#F8FAFC]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. KA-01-MJ-4321"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[14px] font-mono font-bold text-[#172B4D] uppercase focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="SUV">SUV</option>
                    <option value="EV">EV (Electric Vehicle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Make / Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Honda City"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#172B4D] mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. White"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-[14px] font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-[#1769E0] rounded border-[#CBD5E1]"
                  />
                  <label htmlFor="isDefault" className="text-[13px] font-medium text-[#172B4D]">Set as default vehicle</label>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 h-11 bg-white border border-[#E2E8F0] text-[#172B4D] hover:bg-[#F8FAFC] font-semibold text-[14px] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-1/2 h-11 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[14px] rounded-lg shadow-xs"
                  >
                    {isSaving ? 'Saving...' : 'Save Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
