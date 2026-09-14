'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Grid3X3,
  CheckCircle2,
  AlertCircle,
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  BarChart2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export default function AdminDashboardPage() {
  const revenueData = [
    { day: 'Mon', revenue: 420 },
    { day: 'Tue', revenue: 580 },
    { day: 'Wed', revenue: 750 },
    { day: 'Thu', revenue: 620 },
    { day: 'Fri', revenue: 940 },
    { day: 'Sat', revenue: 1250 },
    { day: 'Sun', revenue: 1100 },
  ]

  const occupancyData = [
    { zone: 'Zone A', occupied: 12, available: 8 },
    { zone: 'Zone B', occupied: 16, available: 4 },
    { zone: 'Zone C', occupied: 8, available: 12 },
  ]

  const statCards = [
    { label: 'Total Slots', value: '48', icon: Grid3X3, color: 'text-[#5C7E8F] bg-[#5C7E8F]/10' },
    { label: 'Occupied Slots', value: '36', icon: CheckCircle2, color: 'text-rose-600 bg-rose-50' },
    { label: 'Available Slots', value: '12', icon: Shield, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Under Maintenance', value: '2', icon: Wrench, color: 'text-amber-700 bg-amber-50' },
    { label: "Today's Revenue", value: '$1,250.00', icon: DollarSign, color: 'text-[#5C7E8F] bg-[#D4DDE2]' },
    { label: 'Monthly Revenue', value: '$24,800.00', icon: TrendingUp, color: 'text-[#5C7E8F] bg-[#5C7E8F]/10' },
    { label: "Today's Bookings", value: '42', icon: Calendar, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Registered Customers', value: '128', icon: Users, color: 'text-cyan-700 bg-cyan-50' },
  ]

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7E8F]/10 text-[#5C7E8F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Administrator Portal
          </span>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">System Overview Dashboard</h1>
          <p className="text-sm text-[#718096] mt-1">
            Real-time parking telemetry, revenue analytics, slot occupancy, and system metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/slots"
            className="px-5 py-2.5 bg-[#5C7E8F] hover:bg-[#4A6776] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Manage Slots
          </Link>
          <Link
            href="/admin/reports"
            className="px-5 py-2.5 bg-white border border-[#D4DDE2] text-[#2C3E50] hover:bg-[#D4DDE2]/40 font-bold text-xs rounded-xl transition"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-[#D4DDE2] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#718096] uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-black text-[#2C3E50] mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Revenue Trend Chart */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4DDE2]/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#2C3E50]">Weekly Revenue Trend ($)</h3>
              <p className="text-xs text-[#718096]">Gross earnings collected from slot bookings over the past 7 days</p>
            </div>
            <span className="text-xs font-bold text-[#5C7E8F] bg-[#D4DDE2]/40 px-3 py-1 rounded-full">+18% vs last week</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5C7E8F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5C7E8F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#5C7E8F" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Breakdown by Zone Chart */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-[#D4DDE2] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4DDE2]/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#2C3E50]">Occupancy by Zone</h3>
              <p className="text-xs text-[#718096]">Occupied vs Available breakdown per parking zone</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="zone" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <Tooltip />
                <Bar dataKey="occupied" name="Occupied" fill="#5C7E8F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="available" name="Available" fill="#D4DDE2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'Slot Management', desc: 'Add/edit slots & rates', href: '/admin/slots' },
          { title: 'Booking Ledger', desc: 'Check-in/out & refunds', href: '/admin/bookings' },
          { title: 'Customer Accounts', desc: 'Manage & block/unblock', href: '/admin/customers' },
          { title: 'Reports & Export', desc: 'CSV & PDF revenue logs', href: '/admin/reports' },
          { title: 'Admin Settings', desc: 'Hourly rates & password', href: '/admin/settings' },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="glass-card p-5 rounded-2xl border border-[#D4DDE2] hover:border-[#5C7E8F] transition duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <h4 className="font-bold text-[#2C3E50] text-sm">{item.title}</h4>
              <p className="text-xs text-[#718096] mt-1">{item.desc}</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#5C7E8F]">
              <span>Open Portal</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
