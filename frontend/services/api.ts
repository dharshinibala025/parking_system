import { ParkingLot, ParkingSlot, Vehicle, Booking, Notification, PricingConfig, User, ReportStats } from '@/types'
import { MOCK_PARKING_LOTS, MOCK_SLOTS, MOCK_VEHICLES, MOCK_BOOKINGS, MOCK_NOTIFICATIONS, MOCK_PRICING, MOCK_USERS } from './mockData'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper to get JWT token for Authorization header sent to MongoDB Express API
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('parkease_token') : null
    if (token) {
      return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }
  } catch (e) {
    console.warn('Unable to retrieve auth token:', e)
  }
  return { 'Content-Type': 'application/json' }
}

// In-Memory Storage Fallbacks for dev mode when backend server is offline
let localParkingLots = [...MOCK_PARKING_LOTS]
let localVehicles = [...MOCK_VEHICLES]
let localBookings = [...MOCK_BOOKINGS]
let localNotifications = [...MOCK_NOTIFICATIONS]
let localUsers = [...MOCK_USERS]
let localPricing = { ...MOCK_PRICING }

// --- PARKING API ---
export const apiParking = {
  getParkingLots: async (filters?: { city?: string; search?: string; parkingType?: string; vehicleType?: string }): Promise<ParkingLot[]> => {
    try {
      const headers = await getAuthHeader()
      const queryParams = new URLSearchParams()
      if (filters?.city) queryParams.append('city', filters.city)
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.parkingType) queryParams.append('parkingType', filters.parkingType)
      if (filters?.vehicleType) queryParams.append('vehicleType', filters.vehicleType)

      const res = await fetch(`${API_BASE_URL}/parking?${queryParams.toString()}`, { headers })
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (err) {
      console.warn('Backend offline, using fallback data')
    }

    // Fallback logic
    let result = [...localParkingLots]
    if (filters?.city) {
      result = result.filter((l) => l.city.toLowerCase() === filters.city!.toLowerCase())
    }
    if (filters?.search) {
      const term = filters.search.toLowerCase()
      result = result.filter((l) => l.name.toLowerCase().includes(term) || l.address.toLowerCase().includes(term) || l.city.toLowerCase().includes(term))
    }
    if (filters?.parkingType) {
      result = result.filter((l) => l.parkingType.toLowerCase() === filters.parkingType!.toLowerCase())
    }
    return result
  },

  getParkingLotById: async (id: string): Promise<ParkingLot | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/parking/${id}`)
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (err) {}
    return localParkingLots.find((l) => l.id === id) || localParkingLots[0] || null
  },

  createParkingLot: async (lotData: Partial<ParkingLot>): Promise<{ success: boolean; data?: ParkingLot; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/parking`, {
        method: 'POST',
        headers,
        body: JSON.stringify(lotData),
      })
      const data = await res.json()
      if (res.ok) {
        localParkingLots.unshift(data.data)
        return { success: true, data: data.data }
      }
      if (res.status === 403) {
        return { success: false, error: 'HTTP 403 Forbidden: Admin access required.' }
      }
      return { success: false, error: data.message }
    } catch (err: any) {
      const newLot: ParkingLot = {
        id: `lot-${Date.now()}`,
        name: lotData.name || 'New Parking',
        address: lotData.address || 'Sample Address',
        area: lotData.area || 'Downtown',
        city: lotData.city || 'Bengaluru',
        description: lotData.description || '',
        latitude: lotData.latitude || 12.97,
        longitude: lotData.longitude || 77.59,
        openingTime: lotData.openingTime || '06:00 AM',
        closingTime: lotData.closingTime || '11:00 PM',
        pricePerHour: lotData.pricePerHour || 50,
        parkingType: lotData.parkingType || 'Covered',
        amenities: lotData.amenities || ['CCTV', 'Security'],
        totalSlots: lotData.totalSlots || 20,
        availableSlots: lotData.totalSlots || 20,
        rating: 5.0,
        image: lotData.image || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
        status: 'active',
      }
      localParkingLots.unshift(newLot)
      return { success: true, data: newLot }
    }
  },

  updateParkingLot: async (id: string, lotData: Partial<ParkingLot>): Promise<{ success: boolean; data?: ParkingLot; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/parking/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(lotData),
      })
      const data = await res.json()
      if (res.ok) return { success: true, data: data.data }
      return { success: false, error: data.message }
    } catch (err: any) {
      const index = localParkingLots.findIndex((l) => l.id === id)
      if (index !== -1) {
        localParkingLots[index] = { ...localParkingLots[index], ...lotData }
        return { success: true, data: localParkingLots[index] }
      }
      return { success: false, error: 'Parking lot not found.' }
    }
  },

  deleteParkingLot: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/parking/${id}`, {
        method: 'DELETE',
        headers,
      })
      if (res.ok) return { success: true }
    } catch (err) {}
    localParkingLots = localParkingLots.filter((l) => l.id !== id)
    return { success: true }
  },
}

// --- SLOTS API ---
export const apiSlots = {
  getSlotsForLot: async (parkingLotId: string): Promise<ParkingSlot[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/parking/${parkingLotId}/slots`)
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (err) {}

    if (MOCK_SLOTS[parkingLotId]) return MOCK_SLOTS[parkingLotId]

    // Generate fallback visual grid (A01-A08, B01-B08)
    const generated: ParkingSlot[] = []
    ;['A', 'B'].forEach((sec) => {
      for (let i = 1; i <= 8; i++) {
        const slotNum = `${sec}${i < 10 ? '0' + i : i}`
        generated.push({
          id: `gen-${parkingLotId}-${slotNum}`,
          parkingLotId,
          slotNumber: slotNum,
          section: sec,
          slotType: i === 1 ? 'EV' : i === 2 ? 'Accessible' : 'Standard',
          vehicleType: i === 1 ? 'EV' : 'Car',
          status: i === 3 ? 'Occupied' : i === 6 ? 'Maintenance' : 'Available',
          pricePerHour: 50,
        })
      }
    })
    return generated
  },

  updateSlotStatus: async (slotId: string, status: string): Promise<{ success: boolean }> => {
    try {
      const headers = await getAuthHeader()
      await fetch(`${API_BASE_URL}/slots/${slotId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
      })
    } catch (e) {}
    return { success: true }
  },
}

// --- BOOKINGS API ---
export const apiBookings = {
  createBooking: async (bookingInput: {
    parkingLotId: string
    parkingSlotId: string
    vehicleId: string
    bookingDate: string
    startTime: string
    endTime: string
    paymentMethod?: string
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingInput),
      })
      const data = await res.json()
      if (res.ok) {
        localBookings.unshift(data.data)
        return { success: true, booking: data.data }
      }
      return { success: false, error: data.message }
    } catch (err: any) {
      // Offline simulation fallback
      const lot = localParkingLots.find((l) => l.id === bookingInput.parkingLotId) || localParkingLots[0]
      const vehicle = localVehicles.find((v) => v.id === bookingInput.vehicleId) || localVehicles[0]
      const randomRefNum = Math.floor(100000 + Math.random() * 900000)

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingReference: `PK-2026-${randomRefNum}`,
        userId: auth.currentUser?.uid || 'user-customer-1',
        parkingLotId: bookingInput.parkingLotId,
        slotId: bookingInput.parkingSlotId,
        vehicleId: bookingInput.vehicleId,
        bookingDate: bookingInput.bookingDate,
        startTime: bookingInput.startTime,
        endTime: bookingInput.endTime,
        durationHours: 2,
        parkingFee: (lot?.pricePerHour || 50) * 2,
        serviceFee: 10,
        discount: 0,
        totalAmount: (lot?.pricePerHour || 50) * 2 + 10 + 5,
        status: 'Confirmed',
        paymentMethod: (bookingInput.paymentMethod as any) || 'Card',
        paymentStatus: 'Successful',
        createdAt: new Date().toISOString(),
        parkingLotName: lot?.name || 'ParkEase Location',
        slotNumber: 'A01',
        vehicleNumber: vehicle?.vehicleNumber || 'KA-01-MJ-4321',
        userName: auth.currentUser?.displayName || 'Arun Kumar',
        userEmail: auth.currentUser?.email || 'arun@example.com',
      }
      localBookings.unshift(newBooking)
      return { success: true, booking: newBooking }
    }
  },

  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/bookings/my`, { headers })
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (err) {}
    const uid = auth.currentUser?.uid || 'user-customer-1'
    return localBookings.filter((b) => b.userId === uid || b.userId === 'user-customer-1')
  },

  getAllBookingsAdmin: async (): Promise<{ success: boolean; data?: Booking[]; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/bookings/admin/all`, { headers })
      const data = await res.json()
      if (res.ok) return { success: true, data: data.data }
      if (res.status === 403) return { success: false, error: 'HTTP 403 Forbidden: Admin access required.' }
      return { success: false, error: data.message }
    } catch (err) {
      return { success: true, data: localBookings }
    }
  },

  getBookingById: async (id: string): Promise<Booking | null> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { headers })
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (err) {}
    return localBookings.find((b) => b.id === id || b.bookingReference === id) || localBookings[0] || null
  },

  cancelBooking: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers,
      })
      if (res.ok) return { success: true }
    } catch (err) {}

    const booking = localBookings.find((b) => b.id === id)
    if (booking) {
      booking.status = 'Cancelled'
      booking.paymentStatus = 'Refunded'
      return { success: true }
    }
    return { success: false, message: 'Booking not found.' }
  },
}

// --- VEHICLES API ---
export const apiVehicles = {
  getUserVehicles: async (): Promise<Vehicle[]> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/vehicles`, { headers })
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (err) {}
    return localVehicles
  },

  addVehicle: async (v: Partial<Vehicle>): Promise<{ success: boolean; data?: Vehicle }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers,
        body: JSON.stringify(v),
      })
      if (res.ok) {
        const data = await res.json()
        localVehicles.unshift(data.data)
        return { success: true, data: data.data }
      }
    } catch (err) {}

    const newV: Vehicle = {
      id: `v-${Date.now()}`,
      userId: auth.currentUser?.uid || 'user-customer-1',
      vehicleNumber: v.vehicleNumber?.toUpperCase() || 'KA-01-AB-1234',
      vehicleType: v.vehicleType || 'Car',
      model: v.model || 'Model X',
      color: v.color || 'Silver',
      isDefault: Boolean(v.isDefault),
    }
    localVehicles.unshift(newV)
    return { success: true, data: newV }
  },

  deleteVehicle: async (id: string): Promise<{ success: boolean }> => {
    try {
      const headers = await getAuthHeader()
      await fetch(`${API_BASE_URL}/vehicles/${id}`, { method: 'DELETE', headers })
    } catch (err) {}
    localVehicles = localVehicles.filter((v) => v.id !== id)
    return { success: true }
  },
}

// --- ADMIN USERS & DASHBOARD API ---
export const apiAdmin = {
  getAllUsers: async (): Promise<{ success: boolean; data?: User[]; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/users/admin/all`, { headers })
      const data = await res.json()
      if (res.ok) return { success: true, data: data.data }
      if (res.status === 403) return { success: false, error: 'HTTP 403 Forbidden: Admin access required.' }
      return { success: false, error: data.message }
    } catch (err) {
      return { success: true, data: localUsers }
    }
  },

  toggleUserStatus: async (userId: string, status: 'active' | 'inactive'): Promise<{ success: boolean }> => {
    try {
      const headers = await getAuthHeader()
      await fetch(`${API_BASE_URL}/users/admin/${userId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      })
    } catch (e) {}

    const user = localUsers.find((u) => u.id === userId)
    if (user) user.status = status
    return { success: true }
  },

  getDashboardStats: async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers })
      const data = await res.json()
      if (res.ok) return { success: true, data: data.data }
      if (res.status === 403) return { success: false, error: 'HTTP 403 Forbidden: Admin access required.' }
    } catch (err) {}

    return {
      success: true,
      data: {
        stats: {
          totalLots: localParkingLots.length,
          totalSlots: 96,
          availableSlots: 66,
          todayBookings: 8,
          activeBookings: 5,
          todayRevenue: 980,
          totalRevenue: 14500,
          registeredCustomers: localUsers.length,
          occupancyRate: 31,
        },
        recentBookings: localBookings,
      },
    }
  },

  getReports: async (range: string = 'month'): Promise<{ success: boolean; data?: any }> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${API_BASE_URL}/admin/reports?range=${range}`, { headers })
      if (res.ok) {
        const data = await res.json()
        return { success: true, data: data.data }
      }
    } catch (err) {}

    return {
      success: true,
      data: {
        totalRevenue: 14500,
        totalBookings: 120,
        averageBookingValue: 120,
        chartData: [
          { date: 'Mon', bookings: 12, revenue: 1440 },
          { date: 'Tue', bookings: 18, revenue: 2160 },
          { date: 'Wed', bookings: 25, revenue: 3200 },
          { date: 'Thu', bookings: 22, revenue: 2860 },
          { date: 'Fri', bookings: 30, revenue: 4100 },
          { date: 'Sat', bookings: 35, revenue: 4800 },
          { date: 'Sun', bookings: 28, revenue: 3900 },
        ],
      },
    }
  },

  getPricing: async (): Promise<PricingConfig> => {
    try {
      const res = await fetch(`${API_BASE_URL}/pricing`)
      if (res.ok) {
        const data = await res.json()
        return data.data
      }
    } catch (e) {}
    return localPricing
  },

  updatePricing: async (pricing: Partial<PricingConfig>): Promise<{ success: boolean }> => {
    try {
      const headers = await getAuthHeader()
      await fetch(`${API_BASE_URL}/pricing`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(pricing),
      })
    } catch (e) {}
    localPricing = { ...localPricing, ...pricing }
    return { success: true }
  },
}

// --- NOTIFICATIONS API ---
export const apiNotifications = {
  getUserNotifications: (userId?: string): Notification[] => {
    return localNotifications
  },
  markAsRead: (id: string) => {
    const notif = localNotifications.find((n) => n.id === id)
    if (notif) notif.isRead = true
  },
  markAllAsRead: (userId?: string) => {
    localNotifications.forEach((n) => (n.isRead = true))
  },
}
