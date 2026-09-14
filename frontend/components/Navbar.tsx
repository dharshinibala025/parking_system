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
  Sparkles,
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
      <header className="sticky top-0 z-50 glass-nav transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Minimal Standalone Logo Only */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="ParkEase home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#42606F] text-white font-extrabold shadow-sm transition group-hover:bg-[#354E5A]">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xl font-black tracking-tight text-[#1E2A30]">
              Park<span className="text-[#42606F]">Ease</span>
            </span>
          </Link>
        </div>
      </header>
    )
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Availability', href: '/availability' },
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
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="ParkEase home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#42606F] text-white font-extrabold shadow-sm transition group-hover:bg-[#354E5A]">
            <Sparkles className="size-5" />
          </span>
          <span className="text-2xl font-black tracking-tight text-[#1E2A30]">
            Park<span className="text-[#42606F]">Ease</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#5C6E78] md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-[#42606F] ${
                  isActive ? 'font-bold text-[#42606F] border-b-2 border-[#42606F] pb-1' : ''
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative flex size-10 items-center justify-center rounded-xl border border-[#CCD7DE] bg-white text-[#5C6E78] hover:text-[#1E2A30] hover:bg-[#B9C7CF]/30 transition"
                  aria-label="Notifications"
                >
                  <Bell className="size-5 text-[#42606F]" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[#CCD7DE] bg-white p-4 shadow-xl z-50">
                    <div className="flex items-center justify-between border-b border-[#EBEFF2] pb-3">
                      <h4 className="font-bold text-[#1E2A30]">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs font-semibold text-[#42606F] hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-xs text-[#7D7D7D]">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`cursor-pointer rounded-xl p-3 text-xs transition ${
                              !n.isRead ? 'bg-[#B9C7CF]/30 border border-[#42606F]/20' : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            <p className="font-bold text-[#1E2A30]">{n.title}</p>
                            <p className="mt-1 text-[#5C6E78]">{n.message}</p>
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
                  className="flex items-center gap-2.5 rounded-xl border border-[#CCD7DE] bg-white px-3.5 py-2 text-sm font-semibold transition hover:bg-[#B9C7CF]/30"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#B9C7CF] font-bold text-[#42606F]">
                    {user?.name.charAt(0) || 'U'}
                  </span>
                  <span className="max-w-[120px] truncate text-[#1E2A30]">{user?.name}</span>
                  <ChevronDown className="size-4 text-[#7D7D7D]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#CCD7DE] bg-white p-2 shadow-xl z-50">
                    <div className="border-b border-[#EBEFF2] px-3 py-2 text-xs">
                      <p className="font-bold text-[#1E2A30]">{user?.name}</p>
                      <p className="text-[#7D7D7D] truncate">{user?.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${role === 'ADMIN' ? 'bg-[#42606F] text-white' : 'bg-[#B9C7CF] text-[#42606F]'}`}>
                        {role || 'Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      {role === 'ADMIN' ? (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#42606F] hover:bg-[#B9C7CF]/30 transition"
                        >
                          <Shield className="size-4" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1E2A30] hover:bg-[#B9C7CF]/30 transition"
                        >
                          <User className="size-4 text-[#7D7D7D]" /> Dashboard
                        </Link>
                      )}

                      <Link
                        href="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1E2A30] hover:bg-[#B9C7CF]/30 transition"
                      >
                        <Clock className="size-4 text-[#7D7D7D]" /> My Bookings
                      </Link>

                      {role !== 'ADMIN' && (
                        <Link
                          href="/vehicles"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1E2A30] hover:bg-[#B9C7CF]/30 transition"
                        >
                          <Car className="size-4 text-[#7D7D7D]" /> Vehicles
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1E2A30] hover:bg-[#B9C7CF]/30 transition"
                      >
                        <UserCheck className="size-4 text-[#7D7D7D]" /> Profile
                      </Link>
                    </div>

                    <div className="border-t border-[#EBEFF2] pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#DC2626] hover:bg-red-50 transition"
                      >
                        <LogOut className="size-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-bold text-[#1E2A30] hover:text-[#42606F] transition px-2 py-1"
              >
                Customer Login
              </Link>
              <Link
                href="/book"
                className="rounded-xl bg-[#42606F] hover:bg-[#354E5A] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-md"
              >
                Book a Slot
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="rounded-xl p-2.5 text-[#1E2A30] hover:bg-[#B9C7CF]/30 md:hidden transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="size-6 text-[#1E2A30]" /> : <Menu className="size-6 text-[#1E2A30]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="flex flex-col gap-4 border-t border-[#CCD7DE] bg-[#F7F9FA] px-6 py-6 text-sm font-semibold md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#1E2A30] hover:text-[#42606F]"
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-3 border-t border-[#EBEFF2]">
              {role === 'ADMIN' ? (
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[#42606F] font-bold">
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
              {role !== 'ADMIN' && (
                <Link href="/vehicles" onClick={() => setMobileMenuOpen(false)}>
                  Vehicles
                </Link>
              )}
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="text-left text-[#DC2626] font-bold mt-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-3 border-t border-[#EBEFF2]">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#1E2A30]">
                Customer Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-[#42606F]">
                Customer Register
              </Link>
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-xl bg-[#42606F] px-6 py-3 text-white font-bold"
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
