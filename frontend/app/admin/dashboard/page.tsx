'use client'

import React from 'react'
import Link from 'next/link'
import {
  Grid3X3,
  CheckCircle2,
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Calendar,
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
    { day: 'Mon', revenue: 4200 },
    { day: 'Tue', revenue: 5800 },
    { day: 'Wed', revenue: 7500 },
    { day: 'Thu', revenue: 6200 },
    { day: 'Fri', revenue: 9400 },
    { day: 'Sat', revenue: 12500 },
    { day: 'Sun', revenue: 11000 },
  ]

  const occupancyData = [
    { zone: 'Zone A', occupied: 12, available: 8 },
    { zone: 'Zone B', occupied: 16, available: 4 },
    { zone: 'Zone C', occupied: 8, available: 12 },
  ]

  const statCards = [
    { label: 'Total Slots', value: '48', icon: Grid3X3, color: 'text-[#1769E0] bg-[#EFF6FF]' },
    { label: 'Occupied Slots', value: '36', icon: CheckCircle2, color: 'text-[#DC2626] bg-[#FEF2F2]' },
    { label: 'Available Slots', value: '12', icon: Shield, color: 'text-[#16A34A] bg-[#ECFDF5]' },
    { label: 'Under Maintenance', value: '2', icon: Wrench, color: 'text-[#F59E0B] bg-[#FFFBEB]' },
    { label: "Today's Revenue", value: '₹12,500', icon: DollarSign, color: 'text-[#1769E0] bg-[#EFF6FF]' },
    { label: 'Monthly Revenue', value: '₹248,000', icon: TrendingUp, color: 'text-[#1769E0] bg-[#EFF6FF]' },
    { label: "Today's Bookings", value: '42', icon: Calendar, color: 'text-[#0F2747] bg-slate-100' },
    { label: 'Registered Customers', value: '128', icon: Users, color: 'text-[#1769E0] bg-[#EFF6FF]' },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] text-[#172B4D]">
      
      {/* Header */}
      <div className="saas-card p-5 sm:p-6 border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">
            ADMINISTRATOR PORTAL
          </span>
          <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight mt-0.5">System Overview Dashboard</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time parking telemetry, revenue analytics, slot occupancy, and system metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/slots"
            className="h-[40px] px-4 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center"
          >
            Manage Slots
          </Link>
          <Link
            href="/admin/reports"
            className="h-[40px] px-4 bg-white border border-[#E2E8F0] text-[#172B4D] hover:bg-slate-50 font-medium text-xs rounded-lg transition flex items-center"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="saas-card p-4 border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#64748B]">{card.label}</p>
                <p className="text-[24px] font-bold text-[#0F2747] mt-0.5">{card.value}</p>
              </div>
              <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="size-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Trend Chart */}
        <div className="lg:col-span-7 saas-card p-5 sm:p-6 border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#0F2747]">Weekly Revenue Trend (₹)</h3>
              <p className="text-[11px] text-[#64748B]">Gross earnings collected from slot bookings over past 7 days</p>
            </div>
            <span className="text-[11px] font-semibold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#86EFAC]">+18% vs last week</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1769E0" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1769E0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#1769E0" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Breakdown by Zone Chart */}
        <div className="lg:col-span-5 saas-card p-5 sm:p-6 border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#0F2747]">Occupancy by Zone</h3>
              <p className="text-[11px] text-[#64748B]">Occupied vs Available breakdown per parking zone</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="zone" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip />
                <Bar dataKey="occupied" name="Occupied" fill="#1769E0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" name="Available" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
            className="saas-card p-4 border border-[#E2E8F0] hover:border-[#1769E0] transition flex flex-col justify-between"
          >
            <div>
              <h4 className="font-semibold text-[#0F2747] text-xs">{item.title}</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-semibold text-[#1769E0]">
              <span>Open Portal</span> <ArrowRight className="size-3 ml-1" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
