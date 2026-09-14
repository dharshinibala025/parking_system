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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="saas-card rounded-2xl p-7 sm:p-8 shadow-xs border border-[#E2E8F0]">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-12 rounded-xl bg-[#1769E0] text-white flex items-center justify-center shadow-xs mb-3">
              <Car className="size-6" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1769E0] text-[12px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Password Recovery
            </span>
            <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight">Reset Password</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Enter your email address and we'll send reset instructions.
            </p>
          </div>

          {statusMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ECFDF5] border border-[#86EFAC] flex items-start gap-2.5 text-[#16A34A] text-[13px] font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[13px]">Reset Link Sent!</p>
                <p className="text-[12px] mt-0.5">{statusMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[#DC2626] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[12px]">{errorMessage}</p>
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
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full h-[46px] bg-white border ${
                    errors.email ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1769E0]'
                  } rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none transition`}
                />
              </div>
              {errors.email && <p className="mt-1 text-[12px] text-[#DC2626]">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[46px] bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[15px] rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending email...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          {/* Single Bottom Return Link */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#1769E0]">
              <ArrowLeft className="w-4 h-4" /> Back to Customer Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
