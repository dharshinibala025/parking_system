const rateLimit = require('express-rate-limit')

// Admin login rate limiter middleware (5 attempts per 15 min per IP)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many admin authentication attempts from this IP address. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// General API rate limiter (100 requests per 15 min per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('API Error Stack:', err.stack || err)

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = {
  adminLoginLimiter,
  apiLimiter,
  errorHandler,
}
