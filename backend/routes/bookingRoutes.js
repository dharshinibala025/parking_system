const express = require('express')
const router = express.Router()
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookingsAdmin,
  checkInVehicle,
  checkOutVehicle,
} = require('../controllers/bookingController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin, requireCustomer } = require('../middleware/roleGuard')

router.post('/', verifyToken, requireCustomer, createBooking)
router.get('/', verifyToken, getUserBookings)
router.put('/:id/cancel', verifyToken, cancelBooking)

// Admin Protected Routes
router.get('/all', verifyToken, requireAdmin, getAllBookingsAdmin)
router.put('/:id/checkin', verifyToken, requireAdmin, checkInVehicle)
router.put('/:id/checkout', verifyToken, requireAdmin, checkOutVehicle)

module.exports = router
