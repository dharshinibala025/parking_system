const Customer = require('../models/Customer')

// GET /api/customers/me
const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-passwordHash')
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found.' })
    }
    res.status(200).json({ success: true, data: customer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching profile.' })
  }
}

// PUT /api/customers/me
const updateProfile = async (req, res) => {
  try {
    const { name, phone, vehicles } = req.body
    const customer = await Customer.findById(req.user.id)
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found.' })
    }

    if (name) customer.name = name
    if (phone !== undefined) customer.phone = phone
    if (vehicles) customer.vehicles = vehicles

    await customer.save()

    const userObj = customer.toObject()
    delete userObj.passwordHash

    res.status(200).json({ success: true, data: userObj })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error updating profile.' })
  }
}

// GET /api/customers (Admin)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-passwordHash').sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: customers })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching customer list.' })
  }
}

// PUT /api/customers/:id/status (Admin)
const toggleBlockCustomer = async (req, res) => {
  try {
    const { status } = req.body
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' })
    }

    customer.status = status || (customer.status === 'active' ? 'blocked' : 'active')
    await customer.save()

    res.status(200).json({
      success: true,
      message: `Customer account is now ${customer.status}.`,
      data: { id: customer._id, status: customer.status },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error updating customer status.' })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getAllCustomers,
  toggleBlockCustomer,
}
