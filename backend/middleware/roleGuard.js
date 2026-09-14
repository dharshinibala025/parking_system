const requireAdmin = (req, res, next) => {
  const role = req.user?.role ? String(req.user.role).toLowerCase() : ''
  if (!req.user || role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access forbidden. Administrator clearance required.' })
  }
  next()
}

const requireCustomer = (req, res, next) => {
  const role = req.user?.role ? String(req.user.role).toLowerCase() : ''
  if (!req.user || (role !== 'customer' && role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Access forbidden. Customer clearance required.' })
  }
  next()
}

module.exports = { requireAdmin, requireCustomer }
