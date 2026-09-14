export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: 'active' | 'inactive'
  avatar?: string
  createdAt: string
}

export type ParkingType = 'Covered' | 'Open' | 'Basement'

export interface ParkingLot {
  id: string
  name: string
  address: string
  area: string
  city: string
  description: string
  latitude: number
  longitude: number
  openingTime: string
  closingTime: string
  pricePerHour: number
  parkingType: ParkingType
  amenities: string[]
  totalSlots: number
  availableSlots: number
  rating: number
  image: string
  status: 'active' | 'maintenance' | 'closed'
}

export type SlotStatus = 'Available' | 'Occupied' | 'Disabled' | 'Maintenance'
export type VehicleType = 'Car' | 'Bike' | 'SUV' | 'EV'

export interface ParkingSlot {
  id: string
  parkingLotId: string
  slotNumber: string // e.g. "A-01", "B-12"
  section: string // "A", "B", "C"
  slotType: 'Standard' | 'EV' | 'Accessible' | 'VIP'
  vehicleType: VehicleType
  status: SlotStatus
  pricePerHour: number
}

export interface Vehicle {
  id: string
  userId: string
  vehicleNumber: string
  vehicleType: VehicleType
  model: string
  color: string
  isDefault: boolean
}

export type BookingStatus = 'Booked' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled'
export type PaymentMethod = 'Cash' | 'UPI' | 'Card'
export type PaymentStatus = 'Pending' | 'Processing' | 'Successful' | 'Failed' | 'Refunded'

export interface Booking {
  id: string
  bookingReference: string // e.g. "PK-20260913-001"
  userId: string
  parkingLotId: string
  slotId: string
  vehicleId: string
  bookingDate: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  durationHours: number
  parkingFee: number
  serviceFee: number
  discount: number
  totalAmount: number
  status: BookingStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
  // Populated fields for quick UI rendering
  parkingLotName?: string
  slotNumber?: string
  vehicleNumber?: string
  userName?: string
  userEmail?: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionReference: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'booking' | 'reminder' | 'cancellation' | 'payment' | 'system'
  isRead: boolean
  createdAt: string
}

export interface PricingConfig {
  baseHourlyRate: number
  weekendMultiplier: number
  peakHourMultiplier: number
  serviceFee: number
  vehicleRates: Record<VehicleType, number> // multiplier
}

export interface ReportStats {
  totalSlots: number
  availableSlots: number
  occupiedSlots: number
  todayBookings: number
  todayRevenue: number
  monthlyRevenue: number
  occupancyRate: number
  popularLocation: string
}
