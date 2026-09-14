const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'ParkEase Admin',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
