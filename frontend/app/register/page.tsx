'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthContext'
import { MapPin, User, Mail, Phone, Lock, Car, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="saas-card rounded-2xl p-7 sm:p-8 shadow-xs border border-[#E2E8F0]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-12 rounded-xl bg-[#1769E0] text-white flex items-center justify-center shadow-xs mb-3">
              <MapPin className="size-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight">Create Customer Account</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Join ParkEase to reserve slots, manage vehicles & park easily
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[13px] font-medium flex items-start gap-2.5">
              <AlertCircle className="size-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[13px]">Registration Error</p>
                <p className="text-[12px] text-[#DC2626] mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Arun Kumar"
                  {...register('name')}
                  className={`w-full h-[46px] bg-white border ${
                    errors.name ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1769E0]'
                  } rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none transition`}
                />
              </div>
              {errors.name && <p className="mt-1 text-[12px] text-[#DC2626]">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                Email Address *
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
              {errors.email && <p className="mt-1 text-[12px] text-[#DC2626]">{errors.email.message}</p>}
            </div>

            {/* Phone & Vehicle Number grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register('phone')}
                    className={`w-full h-[46px] bg-white border ${
                      errors.phone ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1769E0]'
                    } rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none transition`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-[12px] text-[#DC2626]">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                  Vehicle Plate # (Optional)
                </label>
                <div className="relative">
                  <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="KA 01 AB 1234"
                    {...register('vehicleNumber')}
                    className="w-full h-[46px] bg-white border border-[#CBD5E1] rounded-lg pl-10 pr-3 text-[14px] font-mono font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#1769E0] transition uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                  Password *
                </label>
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
                {errors.password && <p className="mt-1 text-[12px] text-[#DC2626]">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#172B4D] mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className={`w-full h-[46px] bg-white border ${
                      errors.confirmPassword ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1769E0]'
                    } rounded-lg pl-10 pr-3 text-[14px] font-medium text-[#172B4D] placeholder-[#94A3B8] focus:outline-none transition`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[12px] text-[#DC2626]">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[46px] bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-[15px] rounded-lg transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center text-[13px] text-[#64748B]">
            Already registered?{' '}
            <Link href="/login" className="font-semibold text-[#1769E0] hover:underline">
              Sign In to Customer Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
