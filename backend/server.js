const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const seedAdmin = require('./utils/seedAdmin')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect MongoDB Database
connectDB()

// Run Admin Seed (Single admin from .env if Admin collection empty, 0 dummy records)
seedAdmin()

// Middlewares
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'ParkEase Node.js REST API Backend',
    database: 'MongoDB + Mongoose',
    timestamp: new Date().toISOString(),
  })
})

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/slots', require('./routes/slotRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/customers', require('./routes/customerRoutes'))
app.use('/api/reports', require('./routes/adminRoutes'))
app.use('/api/contact', require('./routes/contactRoutes'))
app.use('/api/payments', require('./routes/paymentRoutes'))

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Backend Error:', err)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 ParkEase MongoDB REST API Server running on port ${PORT}`)
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
  })
}

module.exports = app
