const express = require('express')
const router = express.Router()
const {
  getPublicAvailability,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')

// Public slot availability preview
router.get('/availability', getPublicAvailability)

// Slot listing & management
router.get('/', getAllSlots)
router.post('/', verifyToken, requireAdmin, createSlot)
router.put('/:id', verifyToken, requireAdmin, updateSlot)
router.delete('/:id', verifyToken, requireAdmin, deleteSlot)

module.exports = router
