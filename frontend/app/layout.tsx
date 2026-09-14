import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'ParkEase — Online Parking Slot Booking and Management System',
  description:
    'Find nearby parking locations, view real-time availability, select and reserve your parking slot in advance with ParkEase. Find. Book. Park. Easy.',
  keywords: ['ParkEase', 'Parking Booking', 'Slot Reservation', 'Online Parking', 'Smart Parking'],
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
