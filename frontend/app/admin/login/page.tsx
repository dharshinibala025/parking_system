'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Admin Card */}
        <div className="saas-card rounded-2xl p-7 sm:p-8 shadow-xs border border-[#E2E8F0]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-12 rounded-xl bg-[#0F2747] text-white flex items-center justify-center shadow-xs mb-3">
              <Shield className="size-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight">Admin Portal Sign In</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Authorized personnel clearance required
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[13px] font-medium flex items-start gap-2.5">
              <AlertCircle className="size-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="flex-1 text-[12px]">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@parkeasy.com"
                  className="w-full h-[46px] bg-white border border-[#CBD5E1] rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#1769E0] transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-semibold text-[#172B4D]">
                  Admin Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[46px] bg-white border border-[#CBD5E1] rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#1769E0] transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[46px] bg-[#0F2747] hover:bg-[#172B4D] text-white font-semibold text-[15px] rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Admin</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Seed Fill Helper */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setShowSeedInfo(!showSeedInfo)}
              className="w-full text-center text-[13px] text-[#1769E0] font-semibold hover:underline flex items-center justify-center gap-1"
            >
              <span>{showSeedInfo ? 'Hide Default Credentials' : 'Need Default Seed Admin Account?'}</span>
            </button>

            {showSeedInfo && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#EFF6FF] border border-[#1769E0]/20 text-[13px] text-[#172B4D]">
                <p className="font-semibold flex items-center gap-1 text-[#1769E0] mb-1">
                  <CheckCircle2 className="size-4" /> Default Admin Credentials:
                </p>
                <p className="font-mono text-[12px] text-[#64748B]">
                  Email: <span className="font-semibold text-[#0F2747]">admin@parkeasy.com</span>
                  <br />
                  Pass: <span className="font-semibold text-[#0F2747]">Admin@123</span>
                </p>
                <button
                  type="button"
                  onClick={useSeedAdmin}
                  className="mt-2.5 w-full bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold py-1.5 px-3 rounded-md text-[12px] transition text-center"
                >
                  Auto-fill Seed Credentials
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Return Link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-[13px] font-medium text-[#64748B] hover:text-[#1769E0] transition"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
