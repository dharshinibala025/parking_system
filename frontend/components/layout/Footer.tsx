'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Mail, Phone, ShieldCheck, Clock } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || ['/login', '/register', '/admin/login', '/forgot-password'].includes(pathname)) {
    return null
  }

  return (
    <footer className="bg-[#0F2747] text-white pt-14 pb-8 border-t border-[#1E3A5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#1E3A5F]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1769E0] flex items-center justify-center text-white shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ParkEase</span>
            </Link>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              Online parking reservation platform offering seamless parking slot discovery, real-time availability, instant slot booking, and digital QR admission.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure JWT Auth</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#1769E0]" /> 24/7 Availability</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/find-parking" className="hover:text-white transition">Find Parking</Link></li>
              <li><Link href="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
              <li><Link href="/vehicles" className="hover:text-white transition">My Vehicles</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Parking Locations */}
          <div>
            <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Top Locations</h3>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> MG Road Central Hub</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> Koramangala City Mall</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> Airport Express Plaza</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> Tech Park Solar Canopy</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Contact</h3>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1769E0]" /> support@parkease.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1769E0]" /> +91 1800-PARK-EASE
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> Bengaluru, India
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} ParkEase. Online Parking Slot Booking & Management System.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
