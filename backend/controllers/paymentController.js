const Payment = require('../models/Payment')

const processPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body

    const payment = new Payment({
      booking: bookingId,
      amount: amount || 10.0,
      method: method || 'Card',
      status: 'paid',
      transactionId: `TXN-${Date.now()}`,
    })

    await payment.save()

    res.status(201).json({ success: true, data: payment })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error processing payment transaction.' })
  }
}

module.exports = { processPayment }
