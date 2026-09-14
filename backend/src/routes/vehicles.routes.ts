import { Router, Response } from 'express'
import { authenticateUser, AuthRequest } from '../middlewares/auth.middleware'
import { db } from '../config/firebase'

const router = Router()

// GET /api/vehicles - Get user's vehicles
router.get('/', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized.' })

    const snapshot = await db.collection('vehicles').where('userId', '==', req.user.uid).get()

    const vehicles: any[] = []
    snapshot.forEach((doc: any) => {
      vehicles.push({ id: doc.id, ...doc.data() })
    })

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/vehicles - Add vehicle
router.post('/', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized.' })

    const { vehicleNumber, vehicleType = 'Car', model = '', color = '', isDefault = false } = req.body

    if (!vehicleNumber) {
      return res.status(400).json({ success: false, message: 'Vehicle number is required.' })
    }

    // If setting as default, un-default other vehicles
    if (isDefault) {
      const snapshot = await db.collection('vehicles').where('userId', '==', req.user.uid).get()
      const batch = db.batch()
      snapshot.forEach((doc: any) => {
        batch.update(doc.ref, { isDefault: false })
      })
      await batch.commit()
    }

    const newVehicle = {
      userId: req.user.uid,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleType,
      model,
      color,
      isDefault: Boolean(isDefault),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await db.collection('vehicles').add(newVehicle)

    return res.status(201).json({
      success: true,
      message: 'Vehicle added successfully.',
      data: { id: docRef.id, ...newVehicle },
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const vehicleRef = db.collection('vehicles').doc(id)
    const doc = await vehicleRef.get()

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' })
    }

    const vehicleData = doc.data()!
    if (vehicleData.userId !== req.user?.uid && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'HTTP 403 Forbidden.' })
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    }

    await vehicleRef.update(updateData)

    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully.',
      data: { id, ...vehicleData, ...updateData },
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const vehicleRef = db.collection('vehicles').doc(id)
    const doc = await vehicleRef.get()

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' })
    }

    const vehicleData = doc.data()!
    if (vehicleData.userId !== req.user?.uid && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'HTTP 403 Forbidden.' })
    }

    await vehicleRef.delete()

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully.',
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

export default router
