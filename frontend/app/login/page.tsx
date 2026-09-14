'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthContext'
import { Sparkles, Mail, Lock, ArrowRight, Loader2, AlertCircle, User } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#B9C7CF] border-t-[#42606F] rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login } = useAuth()

  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const result = await login(data.email, data.password)

      if (result.success) {
        const targetUrl = result.role === 'ADMIN' ? '/admin/dashboard' : (redirectUrl || '/dashboard')
        window.location.href = targetUrl
      } else {
        setServerError(result.error || 'Failed to sign in. Please check your credentials.')
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FA] px-4 py-12 overflow-hidden">
      {/* Frosted Aura Ambient Background Mesh Blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#42606F]/20 blur-3xl animate-ambient-glow pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] rounded-full bg-[#B9C7CF]/40 blur-3xl animate-ambient-pulse pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#B9C7CF]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#42606F] text-white flex items-center justify-center shadow-lg mb-3">
              <User className="w-7 h-7" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#42606F]/10 text-[#42606F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Portal Login
            </span>
            <h1 className="text-3xl font-black text-[#1E2A30] tracking-tight">Customer Sign In</h1>
            <p className="text-sm text-[#7D7D7D] mt-1">
              Access your parking slot bookings & profile
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
          >
            <div>
              <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="email"
                  placeholder="customer@example.com"
                  {...register('email')}
                  className={`w-full bg-white/90 border ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-[#B9C7CF] focus:ring-[#42606F]'
                  } rounded-xl pl-11 pr-4 py-3 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#42606F] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full bg-white/90 border ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-[#B9C7CF] focus:ring-[#42606F]'
                  } rounded-xl pl-11 pr-4 py-3 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#42606F] hover:bg-[#354E5A] text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In to Customer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt — Single Bottom Link */}
          <div className="mt-6 pt-6 border-t border-[#B9C7CF]/60 text-center text-xs text-[#7D7D7D]">
            New to ParkEase?{' '}
            <Link href="/register" className="font-bold text-[#42606F] hover:underline">
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
