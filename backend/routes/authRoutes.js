const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const {
  customerRegister,
  customerLogin,
  adminLogin,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController')

// Express Rate Limiter specifically for admin login (max 5 attempts per 15 mins per IP)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many admin login attempts from this IP address. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/customer/register', customerRegister)
router.post('/customer/login', customerLogin)
router.post('/admin/login', adminLoginLimiter, adminLogin)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router
