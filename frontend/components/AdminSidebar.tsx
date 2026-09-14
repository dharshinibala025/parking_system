'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CalendarCheck,
  Grid,
  Home,
  Settings,
  Shield,
  Users,
  Sparkles,
} from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Slot Management', href: '/admin/slots', icon: Grid },
    { name: 'Booking Ledger', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Customer Accounts', href: '/admin/customers', icon: Users },
    { name: 'Reports & Exports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Admin Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-[#D4DDE2] glass-card p-4 min-h-[calc(100vh-5rem)]">
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[#5C7E8F] text-white font-bold text-xs shadow-sm">
            <Shield className="size-4 text-white" />
          </span>
          <span className="font-extrabold text-sm text-[#2C3E50] tracking-tight">Admin Console</span>
        </div>
        <p className="mt-1.5 text-[11px] font-semibold text-[#718096] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#5C7E8F]" /> Frosted Aura Controls
        </p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href === '/admin/dashboard' && pathname === '/admin') ||
            (item.href === '/admin/customers' && pathname === '/admin/users')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-[#5C7E8F] text-white shadow-md'
                  : 'text-[#718096] hover:bg-[#D4DDE2]/40 hover:text-[#2C3E50]'
              }`}
            >
              <Icon className="size-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
