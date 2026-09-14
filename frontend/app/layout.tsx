import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'ParkEase — Find Your Spot. Park With Ease.',
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
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
