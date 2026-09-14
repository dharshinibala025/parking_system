const express = require('express')
const router = express.Router()
const { processPayment } = require('../controllers/paymentController')
const { verifyToken } = require('../middleware/auth')

router.post('/', verifyToken, processPayment)

module.exports = router
