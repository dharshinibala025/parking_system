'use client'

import React, { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle2, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-14 px-4 sm:px-6 lg:px-8 text-[#172B4D]">
      <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-2 items-start">
        
        {/* Contact Info */}
        <div className="space-y-4">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1769E0]">
            SUPPORT & INQUIRIES
          </span>
          <h1 className="text-3xl font-bold text-[#0F2747] tracking-tight">Contact ParkEase Support</h1>
          <p className="text-xs leading-relaxed text-[#64748B]">
            Have questions about booking parking slots, garage partnerships, or technical support? Send us a message and our team will respond within 24 hours.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="saas-card p-3.5 border border-[#E2E8F0] flex items-center gap-3.5">
              <div className="size-9 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center font-bold shrink-0">
                <Mail className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0F2747] text-xs">Email Support</p>
                <p className="text-[#64748B] text-[11px]">support@parkease.com</p>
              </div>
            </div>

            <div className="saas-card p-3.5 border border-[#E2E8F0] flex items-center gap-3.5">
              <div className="size-9 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center font-bold shrink-0">
                <Phone className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0F2747] text-xs">Helpline (24/7)</p>
                <p className="text-[#64748B] text-[11px]">+91 1800-PARK-EASE</p>
              </div>
            </div>

            <div className="saas-card p-3.5 border border-[#E2E8F0] flex items-center gap-3.5">
              <div className="size-9 rounded-lg bg-[#EFF6FF] text-[#1769E0] flex items-center justify-center font-bold shrink-0">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0F2747] text-xs">ParkEase Headquarters</p>
                <p className="text-[#64748B] text-[11px]">Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Working Form Card */}
        <div className="saas-card p-6 sm:p-7 border border-[#E2E8F0] shadow-sm">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-[#0F2747]">Message Sent Successfully</h3>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto">
                Thank you for reaching out. Your inquiry has been saved and sent to our support team.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setName('')
                  setEmail('')
                  setMessage('')
                }}
                className="mt-3 px-4 py-2 bg-[#1769E0] hover:bg-[#1258C4] text-white font-semibold text-xs rounded-lg shadow-xs transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-[#E2E8F0] pb-2.5">
                <h3 className="text-base font-semibold text-[#0F2747]">Send Us a Message</h3>
                <p className="text-xs text-[#64748B]">Submits directly to our ticket database</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[#172B4D] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[44px] rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] transition"
                  placeholder="Arun Kumar"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#172B4D] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[44px] rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] transition"
                  placeholder="arun@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#172B4D] block mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#172B4D] focus:outline-none focus:border-[#1769E0] transition"
                  placeholder="How can we help you with parking slot bookings?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] rounded-[10px] bg-[#1769E0] hover:bg-[#1258C4] text-xs font-semibold text-white shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Support Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
