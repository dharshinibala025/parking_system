const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  timeIn: {
    type: String,
    required: true,
  },
  timeOut: {
    type: String,
  },
  durationHours: {
    type: Number,
    default: 2,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  qrCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
