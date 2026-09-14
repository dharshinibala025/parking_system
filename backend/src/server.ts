import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes'
import parkingRoutes from './routes/parking.routes'
import slotsRoutes from './routes/slots.routes'
import bookingsRoutes from './routes/bookings.routes'
import vehiclesRoutes from './routes/vehicles.routes'
import usersRoutes from './routes/users.routes'
import pricingRoutes from './routes/pricing.routes'
import adminRoutes from './routes/admin.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'ParkEase REST API Backend',
    backend: 'Firebase Admin SDK',
    timestamp: new Date().toISOString(),
  })
})

// Register API Routes
app.use('/api/auth', authRoutes)
app.use('/api/parking', parkingRoutes)
app.use('/api', slotsRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/vehicles', vehiclesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/admin', adminRoutes)

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  })
})

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 ParkEase Backend REST API running on port ${PORT}`)
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
  })
}

export default app
