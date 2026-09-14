const express = require('express')
const router = express.Router()
const {
  getProfile,
  updateProfile,
  getAllCustomers,
  toggleBlockCustomer,
} = require('../controllers/customerController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')

router.get('/me', verifyToken, getProfile)
router.put('/me', verifyToken, updateProfile)

// Admin Customer Management
router.get('/', verifyToken, requireAdmin, getAllCustomers)
router.put('/:id/status', verifyToken, requireAdmin, toggleBlockCustomer)

module.exports = router
