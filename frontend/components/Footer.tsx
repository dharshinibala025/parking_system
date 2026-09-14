'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Shield } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Hide footer completely on standalone auth pages
  const isAuthPage = ['/login', '/register', '/admin/login', '/forgot-password'].includes(pathname)
  if (isAuthPage) {
    return null
  }

  return (
    <footer className="bg-[#0F2747] text-white pt-14 pb-10 border-t border-[#1E3A5F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-[#1E3A5F]">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#1769E0] text-white font-bold shadow-xs">
                <MapPin className="size-4" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Park<span className="text-[#1769E0]">Ease</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#94A3B8] max-w-xs font-normal">
              Seamless smart parking reservation system. Real-time availability, instant slot booking, and digital QR ticket admission.
            </p>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li>
                <Link href="/availability" className="hover:text-white transition">
                  Live Availability
                </Link>
              </li>
              <li>
                <Link href="/find-parking" className="hover:text-white transition">
                  Find Parking
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition">
                  Book a Slot
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-white transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About ParkEase
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Create Account
                </Link>
              </li>
              <li className="pt-2 border-t border-[#1E3A5F]">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition"
                >
                  <Shield className="size-3.5 text-[#94A3B8]" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-2 text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ParkEase Platform. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#94A3B8] font-medium">
            <Link href="/about" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/admin/login" className="hover:text-white transition text-[11px]">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
