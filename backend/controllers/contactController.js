const Message = require('../models/Message')

// POST /api/contact
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' })
    }

    const newMessage = new Message({
      name,
      email: email.toLowerCase(),
      message,
    })

    await newMessage.save()

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting ParkEase! Your inquiry has been received.',
      data: newMessage,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error processing contact form submission.' })
  }
}

module.exports = { submitContactMessage }
