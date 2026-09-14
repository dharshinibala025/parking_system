import { Router, Request, Response } from 'express'
import { authenticateUser, requireAdmin, AuthRequest } from '../middlewares/auth.middleware'
import { db } from '../config/firebase'

const router = Router()

// GET /api/parking - Get all parking lots
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, search, parkingType, vehicleType } = req.query
    const snapshot = await db.collection('parkingLots').get()
    let parkingLots: any[] = []

    snapshot.forEach((doc: any) => {
      parkingLots.push({ id: doc.id, ...doc.data() })
    })

    // Filter results dynamically
    if (city) {
      parkingLots = parkingLots.filter(
        (lot) => lot.city?.toLowerCase() === (city as string).toLowerCase()
      )
    }

    if (search) {
      const term = (search as string).toLowerCase()
      parkingLots = parkingLots.filter(
        (lot) =>
          lot.name?.toLowerCase().includes(term) ||
          lot.address?.toLowerCase().includes(term) ||
          lot.city?.toLowerCase().includes(term)
      )
    }

    if (parkingType) {
      parkingLots = parkingLots.filter(
        (lot) => lot.parkingType?.toLowerCase() === (parkingType as string).toLowerCase()
      )
    }

    if (vehicleType) {
      parkingLots = parkingLots.filter(
        (lot) =>
          Array.isArray(lot.vehicleTypes) &&
          lot.vehicleTypes.some((v: string) => v.toLowerCase() === (vehicleType as string).toLowerCase())
      )
    }

    return res.status(200).json({
      success: true,
      count: parkingLots.length,
      data: parkingLots,
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/parking/:id - Get parking lot details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const doc = await db.collection('parkingLots').doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Parking lot not found.' })
    }

    return res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/parking - Create parking lot (Admin only)
router.post('/', authenticateUser, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      address,
      city,
      latitude,
      longitude,
      imageUrl,
      totalSlots,
      pricePerHour,
      parkingType,
      vehicleTypes,
      amenities,
      openingTime,
      closingTime,
      status,
    } = req.body

    if (!name || !address || !city || !pricePerHour) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, city, and price per hour are required.',
      })
    }

    const newLot = {
      name,
      description: description || '',
      address,
      city,
      latitude: Number(latitude) || 12.9716,
      longitude: Number(longitude) || 77.5946,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
      totalSlots: Number(totalSlots) || 20,
      availableSlots: Number(totalSlots) || 20,
      pricePerHour: Number(pricePerHour),
      parkingType: parkingType || 'Public',
      vehicleTypes: vehicleTypes || ['Car', 'Bike', 'SUV', 'EV'],
      amenities: amenities || ['CCTV', 'Security'],
      openingTime: openingTime || '06:00 AM',
      closingTime: closingTime || '11:00 PM',
      status: status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await db.collection('parkingLots').add(newLot)

    return res.status(201).json({
      success: true,
      message: 'Parking lot created successfully.',
      data: { id: docRef.id, ...newLot },
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/parking/:id - Update parking lot (Admin only)
router.put('/:id', authenticateUser, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const lotRef = db.collection('parkingLots').doc(id)
    const doc = await lotRef.get()

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Parking lot not found.' })
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    }

    await lotRef.update(updateData)

    return res.status(200).json({
      success: true,
      message: 'Parking lot updated successfully.',
      data: { id, ...doc.data(), ...updateData },
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/parking/:id - Delete/Deactivate parking lot (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const lotRef = db.collection('parkingLots').doc(id)
    const doc = await lotRef.get()

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Parking lot not found.' })
    }

    await lotRef.delete()

    return res.status(200).json({
      success: true,
      message: 'Parking lot deleted successfully.',
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

export default router
