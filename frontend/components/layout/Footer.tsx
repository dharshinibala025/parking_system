'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Mail, Phone, MapPin, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">ParkEase</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              ParkEase is an online parking reservation platform offering seamless parking slot discovery, real-time availability, instant slot booking, and secure simulated payments.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Firebase Auth</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-400" /> 24/7 Availability</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/find-parking" className="hover:text-white transition">Find Parking</Link></li>
              <li><Link href="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
              <li><Link href="/vehicles" className="hover:text-white transition">My Vehicles</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Parking Locations */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Top Locations</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> MG Road Central Hub</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Koramangala City Mall</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Airport Express Plaza</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Tech Park Solar Canopy</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400" /> support@parkease.com
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400" /> +91 1800-PARK-EASE
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400" /> Bengaluru, Karnataka, India
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ParkEase. Online Parking Slot Booking & Management System.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition cursor-pointer">College Project Demo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
