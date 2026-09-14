const ParkingSlot = require('../models/ParkingSlot')

// GET /api/slots/availability
const getPublicAvailability = async (req, res) => {
  try {
    const { zone, vehicleType } = req.query
    const filter = {}
    if (zone && zone !== 'All') filter.zone = zone
    if (vehicleType && vehicleType !== 'All') filter.vehicleType = vehicleType

    let slots = await ParkingSlot.find(filter)

    // Default sample fallback if database has zero slots created yet
    if (slots.length === 0) {
      slots = [
        { _id: 's1', slotNumber: 'A101', zone: 'Zone A', vehicleType: '4-wheeler', hourlyRate: 5.0, status: 'available' },
        { _id: 's2', slotNumber: 'A102', zone: 'Zone A', vehicleType: '4-wheeler', hourlyRate: 5.0, status: 'occupied' },
        { _id: 's3', slotNumber: 'A103', zone: 'Zone A', vehicleType: '4-wheeler', hourlyRate: 5.0, status: 'available' },
        { _id: 's4', slotNumber: 'A104', zone: 'Zone A', vehicleType: '2-wheeler', hourlyRate: 3.0, status: 'available' },
        { _id: 's5', slotNumber: 'B201', zone: 'Zone B', vehicleType: '4-wheeler', hourlyRate: 6.0, status: 'available' },
        { _id: 's6', slotNumber: 'B202', zone: 'Zone B', vehicleType: '4-wheeler', hourlyRate: 6.0, status: 'maintenance' },
      ]
    }

    res.status(200).json({ success: true, data: slots })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching slot availability.' })
  }
}

// GET /api/slots
const getAllSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find()
    res.status(200).json({ success: true, data: slots })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching parking slots.' })
  }
}

// POST /api/slots (Admin)
const createSlot = async (req, res) => {
  try {
    const { slotNumber, zone, vehicleType, hourlyRate, status } = req.body

    if (!slotNumber) {
      return res.status(400).json({ success: false, message: 'Slot number is required.' })
    }

    const existing = await ParkingSlot.findOne({ slotNumber: slotNumber.toUpperCase() })
    if (existing) {
      return res.status(400).json({ success: false, message: `Slot number ${slotNumber} already exists.` })
    }

    const slot = new ParkingSlot({
      slotNumber: slotNumber.toUpperCase(),
      zone: zone || 'Zone A',
      vehicleType: vehicleType || '4-wheeler',
      hourlyRate: hourlyRate || 5.0,
      status: status || 'available',
    })

    await slot.save()
    res.status(201).json({ success: true, data: slot })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error creating parking slot.' })
  }
}

// PUT /api/slots/:id (Admin)
const updateSlot = async (req, res) => {
  try {
    const { slotNumber, zone, vehicleType, hourlyRate, status } = req.body
    const slot = await ParkingSlot.findByIdAndUpdate(
      req.params.id,
      { slotNumber, zone, vehicleType, hourlyRate, status },
      { new: true }
    )

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Parking slot not found.' })
    }

    res.status(200).json({ success: true, data: slot })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error updating parking slot.' })
  }
}

// DELETE /api/slots/:id (Admin)
const deleteSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndDelete(req.params.id)
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Parking slot not found.' })
    }
    res.status(200).json({ success: true, message: 'Parking slot deleted successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting parking slot.' })
  }
}

module.exports = {
  getPublicAvailability,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
}
