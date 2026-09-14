'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Bell,
  Car,
  ChevronDown,
  Clock,
  LogOut,
  Menu,
  Shield,
  User,
  UserCheck,
  X,
  MapPin,
} from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    user,
    role,
    isAuthenticated,
    logout,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  // Auth pages standalone detection rule:
  const isAuthPage = ['/login', '/register', '/admin/login', '/forgot-password'].includes(pathname)

  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Minimal Standalone Logo Only */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="ParkEase home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1769E0] text-white shadow-xs">
              <MapPin className="size-4" />
            </span>
            <span className="text-xl font-bold tracking-tight text-[#0F2747]">
              Park<span className="text-[#1769E0]">Ease</span>
            </span>
          </Link>
        </div>
      </header>
    )
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Parking', href: '/find-parking' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleLogout = async () => {
    await logout()
    setUserDropdownOpen(false)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="ParkEase home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#1769E0] text-white shadow-xs transition group-hover:bg-[#1258C4]">
            <MapPin className="size-4" />
          </span>
          <span className="text-xl font-bold tracking-tight text-[#0F2747]">
            Park<span className="text-[#1769E0]">Ease</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-7 text-[14px] font-medium text-[#64748B] md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-[#1769E0] ${
                  isActive ? 'font-semibold text-[#1769E0]' : ''
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute left-0 bottom-0 h-0.5 w-full rounded-full bg-[#1769E0]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative flex size-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#172B4D] hover:bg-[#F8FAFC] transition"
                  aria-label="Notifications"
                >
                  <Bell className="size-4 text-[#64748B]" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-lg z-50">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                      <h4 className="font-semibold text-xs text-[#172B4D] uppercase tracking-wider">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] font-medium text-[#1769E0] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-2.5 max-h-64 space-y-2 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-xs text-[#94A3B8]">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`cursor-pointer rounded-lg p-2.5 text-xs transition ${
                              !n.isRead ? 'bg-[#EFF6FF] border border-[#1769E0]/20' : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            <p className="font-semibold text-[#172B4D]">{n.title}</p>
                            <p className="mt-0.5 text-[#64748B] text-[11px]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#172B4D] hover:bg-[#F8FAFC] transition"
                >
                  <span className="flex size-6 items-center justify-center rounded bg-[#EFF6FF] font-bold text-[#1769E0]">
                    {user?.name.charAt(0) || 'U'}
                  </span>
                  <span className="max-w-[100px] truncate text-[#172B4D]">{user?.name}</span>
                  <ChevronDown className="size-3.5 text-[#94A3B8]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg z-50">
                    <div className="border-b border-[#E2E8F0] px-3 py-2 text-xs">
                      <p className="font-semibold text-[#172B4D]">{user?.name}</p>
                      <p className="text-[#64748B] truncate text-[11px]">{user?.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${role === 'ADMIN' ? 'bg-[#0F2747] text-white' : 'bg-[#EFF6FF] text-[#1769E0]'}`}>
                        {role || 'Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      {role === 'ADMIN' ? (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-[#1769E0] hover:bg-[#EFF6FF] transition"
                        >
                          <Shield className="size-3.5" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-[#172B4D] hover:bg-[#F8FAFC] transition"
                        >
                          <User className="size-3.5 text-[#64748B]" /> Dashboard
                        </Link>
                      )}

                      <Link
                        href="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-[#172B4D] hover:bg-[#F8FAFC] transition"
                      >
                        <Clock className="size-3.5 text-[#64748B]" /> My Bookings
                      </Link>

                      {role !== 'ADMIN' && (
                        <Link
                          href="/vehicles"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-[#172B4D] hover:bg-[#F8FAFC] transition"
                        >
                          <Car className="size-3.5 text-[#64748B]" /> Vehicles
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-[#172B4D] hover:bg-[#F8FAFC] transition"
                      >
                        <UserCheck className="size-3.5 text-[#64748B]" /> Profile
                      </Link>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-[#DC2626] hover:bg-red-50 transition"
                      >
                        <LogOut className="size-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-[14px] font-medium text-[#172B4D] hover:text-[#1769E0] transition px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center h-[42px] px-5 rounded-[10px] bg-[#1769E0] hover:bg-[#1258C4] text-[14px] font-semibold text-white transition shadow-xs"
              >
                Book a Slot
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="rounded-lg p-2 text-[#172B4D] hover:bg-slate-100 md:hidden transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="size-5 text-[#172B4D]" /> : <Menu className="size-5 text-[#172B4D]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="flex flex-col gap-3 border-t border-[#E2E8F0] bg-white px-6 py-4 text-sm font-medium md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#172B4D] hover:text-[#1769E0]"
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-3 border-t border-[#E2E8F0]">
              {role === 'ADMIN' ? (
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[#1769E0] font-semibold">
                  Admin Dashboard
                </Link>
              ) : (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Link href="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                My Bookings
              </Link>
              <button onClick={handleLogout} className="text-left text-[#DC2626] font-semibold mt-1">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#172B4D]">
                Sign In
              </Link>
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-[10px] bg-[#1769E0] py-2.5 text-white font-semibold text-sm"
              >
                Book a Slot
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
