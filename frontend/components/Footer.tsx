'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <span className="font-bold">P</span>
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Park<span className="text-primary">Ease</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Find Your Spot. Park With Ease. Modern automated parking slot reservation & management platform.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="size-4 text-primary" /> Full-Stack College Mini-Project Demo
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/find-parking" className="hover:text-white transition">
                  Find Parking
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-white transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition flex items-center gap-1.5 text-primary">
                  <Shield className="size-3.5" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Parking Partner API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 ParkEase System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-400 transition">
              Terms
            </a>
            <a href="#" className="hover:text-slate-400 transition">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
