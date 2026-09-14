const express = require('express')
const router = express.Router()
const { getReports } = require('../controllers/adminController')
const { verifyToken } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/roleGuard')

router.get('/reports', verifyToken, requireAdmin, getReports)

module.exports = router
