'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSeedInfo, setShowSeedInfo] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await login(email, password)
      if (res.success) {
        if (res.role === 'ADMIN' || email.toLowerCase().includes('admin')) {
          window.location.href = redirect
        } else {
          setError('This account does not have Administrator privileges.')
        }
      } else {
        setError(res.error || 'Invalid admin credentials.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during admin authentication.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const useSeedAdmin = () => {
    setEmail('admin@parkeasy.com')
    setPassword('Admin@123')
    setError('')
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FA] px-4 py-12 overflow-hidden">
      {/* Frosted Aura Ambient Background Mesh Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#42606F]/20 blur-3xl animate-ambient-glow pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] rounded-full bg-[#B9C7CF]/40 blur-3xl animate-ambient-pulse pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-[#42606F]/15 blur-2xl animate-ambient-glow pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Admin Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#B9C7CF]">
          {/* Header Badge */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#42606F] text-white flex items-center justify-center shadow-lg mb-4 transform -rotate-3 hover:rotate-0 transition">
              <Shield className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#42606F]/10 text-[#42606F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Restricted Admin Portal
            </span>
            <h1 className="text-3xl font-black text-[#1E2A30] tracking-tight">Admin Sign In</h1>
            <p className="text-sm text-[#7D7D7D] mt-1">
              Authorized personnel access only
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@parkeasy.com"
                  className="w-full bg-white/90 border border-[#B9C7CF] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider">
                  Admin Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/90 border border-[#B9C7CF] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#42606F] hover:bg-[#354E5A] text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Seed Fill Helper */}
          <div className="mt-6 pt-6 border-t border-[#B9C7CF]/60">
            <button
              type="button"
              onClick={() => setShowSeedInfo(!showSeedInfo)}
              className="w-full text-center text-xs text-[#42606F] font-semibold hover:underline flex items-center justify-center gap-1"
            >
              <span>{showSeedInfo ? 'Hide Default Credentials' : 'Need Default Seed Admin Account?'}</span>
            </button>

            {showSeedInfo && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#B9C7CF]/30 border border-[#B9C7CF] text-xs text-[#1E2A30]">
                <p className="font-bold flex items-center gap-1.5 text-[#42606F] mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Default Seed Credentials:
                </p>
                <p className="font-mono text-[11px] text-[#5C6E78]">
                  Email: <span className="font-bold">admin@parkeasy.com</span>
                  <br />
                  Pass: <span className="font-bold">Admin@123</span>
                </p>
                <button
                  type="button"
                  onClick={useSeedAdmin}
                  className="mt-2.5 w-full bg-[#42606F]/10 hover:bg-[#42606F]/20 text-[#42606F] font-bold py-1.5 px-3 rounded-lg text-[11px] transition text-center"
                >
                  Auto-fill Seed Credentials
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Single Return Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#7D7D7D] hover:text-[#42606F] transition"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
