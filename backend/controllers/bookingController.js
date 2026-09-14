const Booking = require('../models/Booking')
const ParkingSlot = require('../models/ParkingSlot')

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { slotId, date, timeIn, timeOut, durationHours, amount, vehicleNumber } = req.body
    const customerId = req.user.id

    const duration = durationHours || 2
    const totalAmount = amount || duration * 5.0
    const qrString = `PARKEASE:${slotId}:${vehicleNumber || 'CAR'}:${date || new Date().toISOString()}`

    const booking = new Booking({
      customer: customerId,
      slot: slotId,
      date: date ? new Date(date) : new Date(),
      timeIn: timeIn || '10:00',
      timeOut: timeOut || '12:00',
      durationHours: duration,
      amount: totalAmount,
      status: 'active',
      qrCode: qrString,
    })

    await booking.save()

    // Mark slot occupied
    if (slotId) {
      await ParkingSlot.findByIdAndUpdate(slotId, { status: 'occupied' })
    }

    res.status(201).json({ success: true, data: booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error creating booking.' })
  }
}

// GET /api/bookings (Customer)
const getUserBookings = async (req, res) => {
  try {
    const customerId = req.user.id
    const bookings = await Booking.find({ customer: customerId }).populate('slot').sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: bookings })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching user bookings.' })
  }
}

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }

    booking.status = 'cancelled'
    await booking.save()

    // Free up slot
    if (booking.slot) {
      await ParkingSlot.findByIdAndUpdate(booking.slot, { status: 'available' })
    }

    res.status(200).json({ success: true, message: 'Booking cancelled successfully.', data: booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error cancelling booking.' })
  }
}

// GET /api/bookings/all (Admin)
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer', 'name email phone').populate('slot').sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: bookings })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching bookings ledger.' })
  }
}

// PUT /api/bookings/:id/checkin (Admin)
const checkInVehicle = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }
    res.status(200).json({ success: true, message: 'Vehicle checked in successfully.', data: booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error checking in vehicle.' })
  }
}

// PUT /api/bookings/:id/checkout (Admin)
const checkOutVehicle = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }

    if (booking.slot) {
      await ParkingSlot.findByIdAndUpdate(booking.slot, { status: 'available' })
    }

    res.status(200).json({ success: true, message: 'Vehicle checked out successfully.', data: booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error checking out vehicle.' })
  }
}

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookingsAdmin,
  checkInVehicle,
  checkOutVehicle,
}
