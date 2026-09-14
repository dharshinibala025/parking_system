'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthContext'
import { Car, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setStatusMessage(null)
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const res = await resetPassword(data.email)
      if (res.success) {
        setStatusMessage(res.message || 'Password reset email sent. Please check your inbox.')
      } else {
        setErrorMessage(res.error || 'Failed to send reset link.')
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FA] px-4 py-12 overflow-hidden">
      {/* Frosted Aura Ambient Background Mesh Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#42606F]/20 blur-3xl animate-ambient-glow pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] rounded-full bg-[#B9C7CF]/40 blur-3xl animate-ambient-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#B9C7CF]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#42606F] text-white flex items-center justify-center shadow-lg mb-3">
              <Car className="w-7 h-7" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#42606F]/10 text-[#42606F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Password Recovery
            </span>
            <h1 className="text-3xl font-black text-[#1E2A30] tracking-tight">Reset Password</h1>
            <p className="text-sm text-[#7D7D7D] mt-1">
              Enter your email address and we'll send reset instructions.
            </p>
          </div>

          {statusMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Link Sent!</p>
                <p className="text-xs text-emerald-700 mt-0.5">{statusMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs">{errorMessage}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full bg-white/90 border ${
                    errors.email ? 'border-red-300' : 'border-[#B9C7CF]'
                  } rounded-xl pl-11 pr-4 py-3 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#42606F] hover:bg-[#354E5A] text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending email...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          {/* Single Bottom Return Link */}
          <div className="mt-6 pt-6 border-t border-[#B9C7CF]/60 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7D7D7D] hover:text-[#42606F]">
              <ArrowLeft className="w-4 h-4" /> Back to Customer Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
