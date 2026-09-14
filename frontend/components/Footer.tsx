'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Shield } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Hide footer completely on standalone auth pages
  const isAuthPage = ['/login', '/register', '/admin/login', '/forgot-password'].includes(pathname)
  if (isAuthPage) {
    return null
  }

  return (
    <footer className="bg-[#1E2A30] text-white pt-16 pb-12 border-t border-[#B9C7CF]/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#42606F] text-white font-extrabold shadow-sm transition group-hover:bg-[#354E5A]">
                <Sparkles className="size-5" />
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                Park<span className="text-[#B9C7CF]">Ease</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#B9C7CF]/90 max-w-xs font-normal">
              Seamless, smart parking slot booking and management with real-time slot availability.
            </p>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-bold text-[#B9C7CF] uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[#B9C7CF]/80 font-medium">
              <li>
                <Link href="/availability" className="hover:text-white transition">
                  Live Slot Availability
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
            <h4 className="text-xs font-bold text-[#B9C7CF] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[#B9C7CF]/80 font-medium">
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

          {/* Column 3: Portal Access */}
          <div>
            <h4 className="text-xs font-bold text-[#B9C7CF] uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-3 text-sm text-[#B9C7CF]/80 font-medium">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Customer Registration
                </Link>
              </li>
              <li className="pt-2 border-t border-[#B9C7CF]/20">
                {/* Discreet Admin Login Link */}
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#7D7D7D] hover:text-[#B9C7CF] transition opacity-80 hover:opacity-100"
                >
                  <Shield className="size-3.5 text-[#7D7D7D]" />
                  <span>Admin Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#B9C7CF]/20 text-xs text-[#7D7D7D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ParkEase System. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#7D7D7D] font-medium">
            <Link href="/about" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/admin/login" className="hover:text-white transition text-[11px] text-slate-400">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
