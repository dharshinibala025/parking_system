const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  passwordHash: {
    type: String,
    required: true,
  },
  vehicles: [
    {
      vehicleNumber: String,
      type: {
        type: String,
        enum: ['2-wheeler', '4-wheeler'],
        default: '4-wheeler',
      },
    },
  ],
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
