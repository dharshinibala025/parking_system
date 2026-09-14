'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CalendarCheck,
  Car,
  DollarSign,
  Grid,
  Home,
  MapPin,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Parking Lots', href: '/admin/parking', icon: MapPin },
    { name: 'Parking Slots', href: '/admin/slots', icon: Grid },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    { name: 'Analytics & Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card p-4 min-h-[calc(100vh-5rem)]">
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
            <Shield className="size-4" />
          </span>
          <span className="font-bold text-sm text-foreground tracking-tight">Admin Console</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">Manage ParkEase operations</p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
