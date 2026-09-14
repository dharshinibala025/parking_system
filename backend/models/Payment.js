const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    default: 'Card',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)
