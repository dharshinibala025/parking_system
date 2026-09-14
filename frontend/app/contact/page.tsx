'use client'

import React, { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2">
        <div>
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="mt-3 text-4xl font-bold text-foreground">Contact ParkEase Support</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Have questions about booking, parking partnerships, or technical support? Send us a message and our team will respond within 24 hours.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">Email Us</p>
                <p className="text-xs text-muted-foreground">support@parkease.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">Call Helpline</p>
                <p className="text-xs text-muted-foreground">+91 1800-123-4567 (24/7)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">Head Office</p>
                <p className="text-xs text-muted-foreground">124 Tech Park Road, Bengaluru</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
          {submitted ? (
            <div className="py-12 text-center">
              <h3 className="text-xl font-bold text-emerald-600">Message Sent!</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Thank you for contacting ParkEase. We will reach back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Send Message</h3>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Arun Kumar"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="arun@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
