'use client'

import React, { useState } from 'react'
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  vehicleCount: number
  totalBookings: number
  status: 'active' | 'blocked'
  createdAt: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust-1',
      name: 'Arun Kumar',
      email: 'arun@example.com',
      phone: '+91 9876543210',
      vehicleCount: 2,
      totalBookings: 8,
      status: 'active',
      createdAt: '2026-08-12',
    },
    {
      id: 'cust-2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9812345678',
      vehicleCount: 1,
      totalBookings: 5,
      status: 'active',
      createdAt: '2026-08-20',
    },
    {
      id: 'cust-3',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '+91 9988776655',
      vehicleCount: 1,
      totalBookings: 2,
      status: 'active',
      createdAt: '2026-09-01',
    },
    {
      id: 'cust-4',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91 9123456789',
      vehicleCount: 3,
      totalBookings: 12,
      status: 'blocked',
      createdAt: '2026-07-15',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const handleToggleBlockStatus = (id: string) => {
    setCustomers(
      customers.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'blocked' : 'active'
          return { ...c, status: nextStatus }
        }
        return c
      })
    )
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Customer Management
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Registered Customers</h1>
          <p className="text-sm text-[#718096] mt-1">
            View customer directory, inspect booking history, and block or unblock customer accounts.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-[#D4DDE2] shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A2A2A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4DDE2] rounded-xl text-xs font-semibold text-[#2C3E50]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card rounded-3xl border border-[#D4DDE2] shadow-xl p-6 sm:p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#D4DDE2] text-[#718096] font-bold uppercase tracking-wider">
              <th className="py-3 px-3">Customer Name</th>
              <th className="py-3 px-3">Email Address</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Vehicles</th>
              <th className="py-3 px-3">Total Bookings</th>
              <th className="py-3 px-3">Joined Date</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Account Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4DDE2]/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#D4DDE2]/20 transition">
                <td className="py-3.5 px-3 font-bold text-[#2C3E50]">{c.name}</td>
                <td className="py-3.5 px-3 text-[#718096]">{c.email}</td>
                <td className="py-3.5 px-3 text-[#718096] font-mono">{c.phone}</td>
                <td className="py-3.5 px-3 font-bold text-[#5C7E8F]">{c.vehicleCount} Registered</td>
                <td className="py-3.5 px-3 font-bold text-[#2C3E50]">{c.totalBookings} Bookings</td>
                <td className="py-3.5 px-3 text-[#718096]">{c.createdAt}</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      c.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => handleToggleBlockStatus(c.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition ${
                      c.status === 'active'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {c.status === 'active' ? 'Block Account' : 'Unblock Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
