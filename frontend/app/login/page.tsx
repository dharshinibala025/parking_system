'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthContext'
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, MapPin } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="size-8 border-3 border-[#E2E8F0] border-t-[#1769E0] rounded-full animate-spin" />
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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="saas-card rounded-2xl p-7 sm:p-8 shadow-xs border border-[#E2E8F0]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-12 rounded-xl bg-[#1769E0] text-white flex items-center justify-center shadow-xs mb-3">
              <MapPin className="size-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight">Customer Sign In</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Access your parking slot bookings & profile
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[13px] font-medium flex items-start gap-2.5">
              <AlertCircle className="size-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[13px]">Authentication Failed</p>
                <p className="text-[12px] text-[#DC2626] mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form className="space-y-4.5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  type="email"
                  placeholder="customer@example.com"
                  {...register('email')}
                  className={`w-full h-[46px] bg-white border ${
                    errors.email ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1769E0]'
                  } rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[12px] text-[#DC2626]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-semibold text-[#172B4D]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-semibold text-[#1769E0] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full h-[46px] bg-white border ${
                    errors.password ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1769E0]'
                  } rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none transition`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[12px] text-[#DC2626]">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[46px] bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[15px] rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In to Customer Portal</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt — Single Bottom Link */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center text-[13px] text-[#64748B]">
            New to ParkEase?{' '}
            <Link href="/register" className="font-semibold text-[#1769E0] hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
