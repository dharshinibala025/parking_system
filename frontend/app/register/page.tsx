'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthContext'
import { Sparkles, User, Mail, Phone, Lock, Car, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    vehicleNumber: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerAuth } = useAuth()

  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      vehicleNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const result = await registerAuth({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })

      if (result.success) {
        if (data.vehicleNumber) {
          try {
            const savedVehicles = JSON.parse(localStorage.getItem('parkease_vehicles') || '[]')
            savedVehicles.push({
              id: `v-${Date.now()}`,
              userId: result.user?.id || 'new-user',
              plateNumber: data.vehicleNumber.toUpperCase(),
              type: '4W',
              isDefault: true,
            })
            localStorage.setItem('parkease_vehicles', JSON.stringify(savedVehicles))
          } catch (e) {}
        }
        router.push('/dashboard')
      } else {
        setServerError(result.error || 'Registration failed. Please try again.')
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred during registration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FA] px-4 py-12 overflow-hidden">
      {/* Ambient Mesh Background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#42606F]/20 blur-3xl animate-ambient-glow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] rounded-full bg-[#B9C7CF]/50 blur-3xl animate-ambient-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#B9C7CF]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#42606F] text-white flex items-center justify-center shadow-lg mb-3">
              <Car className="w-7 h-7" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#42606F]/10 text-[#42606F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Customer Self-Registration
            </span>
            <h1 className="text-3xl font-black text-[#1E2A30] tracking-tight">Create Customer Account</h1>
            <p className="text-sm text-[#7D7D7D] mt-1">
              Join ParkEase to reserve slots, manage vehicles & park easily
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Error</p>
                <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="text"
                  placeholder="Arun Kumar"
                  {...register('name')}
                  className={`w-full bg-white/90 border ${
                    errors.name ? 'border-red-300' : 'border-[#B9C7CF]'
                  } rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7D7D7D]" />
                <input
                  type="email"
                  placeholder="customer@example.com"
                  {...register('email')}
                  className={`w-full bg-white/90 border ${
                    errors.email ? 'border-red-300' : 'border-[#B9C7CF]'
                  } rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Phone & Vehicle Number grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7D7D]" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register('phone')}
                    className={`w-full bg-white/90 border ${
                      errors.phone ? 'border-red-300' : 'border-[#B9C7CF]'
                    } rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-1">
                  Vehicle Plate # (Optional)
                </label>
                <div className="relative">
                  <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7D7D]" />
                  <input
                    type="text"
                    placeholder="KA 01 AB 1234"
                    {...register('vehicleNumber')}
                    className="w-full bg-white/90 border border-[#B9C7CF] rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7D7D]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full bg-white/90 border ${
                      errors.password ? 'border-red-300' : 'border-[#B9C7CF]'
                    } rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2A30] uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7D7D]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className={`w-full bg-white/90 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-[#B9C7CF]'
                    } rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1E2A30] placeholder-[#7D7D7D] focus:outline-none focus:ring-2 focus:ring-[#42606F] transition`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#42606F] hover:bg-[#354E5A] text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link — Single Bottom Link */}
          <div className="mt-6 pt-6 border-t border-[#B9C7CF]/60 text-center text-xs text-[#7D7D7D]">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-[#42606F] hover:underline">
              Sign In to Customer Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
