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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Parking', href: '/find-parking' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ]

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="ParkEase home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="text-xl font-bold">P</span>
          </span>
          <span className="text-xl font-bold tracking-tight">
            Park<span className="text-primary">Ease</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-foreground ${
                  isActive ? 'font-bold text-primary' : ''
                }`}
              >
                {link.name}
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
                  className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h4 className="font-bold text-foreground">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-xs text-muted-foreground">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`cursor-pointer rounded-xl p-3 text-xs transition ${
                              !n.isRead ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/40 hover:bg-secondary'
                            }`}
                          >
                            <p className="font-bold text-foreground">{n.title}</p>
                            <p className="mt-1 text-muted-foreground">{n.message}</p>
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
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-secondary"
                >
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 font-bold text-primary">
                    {user?.name.charAt(0) || 'U'}
                  </span>
                  <span className="max-w-[100px] truncate text-foreground">{user?.name}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl z-50">
                    <div className="border-b border-border px-3 py-2 text-xs">
                      <p className="font-bold text-foreground">{user?.name}</p>
                      <p className="text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {role === 'ADMIN' ? (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary transition"
                        >
                          <Shield className="size-4" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
                        >
                          <User className="size-4 text-muted-foreground" /> Dashboard
                        </Link>
                      )}

                      <Link
                        href="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
                      >
                        <Clock className="size-4 text-muted-foreground" /> My Bookings
                      </Link>

                      {role !== 'ADMIN' && (
                        <Link
                          href="/vehicles"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
                        >
                          <Car className="size-4 text-muted-foreground" /> Vehicles
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
                      >
                        <UserCheck className="size-4 text-muted-foreground" /> Profile
                      </Link>
                    </div>

                    <div className="border-t border-border pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="size-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link
                href="/find-parking"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Book a Slot
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="size-6 text-foreground" /> : <Menu className="size-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="flex flex-col gap-4 border-t border-border bg-card px-5 py-5 text-sm font-semibold md:hidden">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {role === 'ADMIN' ? (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-primary font-bold">
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
              <button onClick={handleLogout} className="text-left text-red-600 font-bold mt-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2 border-t border-border">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link
                href="/find-parking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-fit rounded-xl bg-primary px-5 py-2.5 text-primary-foreground"
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
