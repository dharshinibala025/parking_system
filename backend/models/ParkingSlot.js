const mongoose = require('mongoose')

const ParkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  zone: {
    type: String,
    default: 'Zone A',
  },
  vehicleType: {
    type: String,
    enum: ['2-wheeler', '4-wheeler'],
    default: '4-wheeler',
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 5.0,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available',
  },
})

module.exports = mongoose.models.ParkingSlot || mongoose.model('ParkingSlot', ParkingSlotSchema)
