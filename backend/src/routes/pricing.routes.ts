import { Router, Request, Response } from 'express'
import { authenticateUser, requireAdmin, AuthRequest } from '../middlewares/auth.middleware'
import { db } from '../config/firebase'

const router = Router()

const DEFAULT_PRICING = {
  id: 'global-config',
  baseHourlyRate: 50,
  weekendMultiplier: 1.2,
  peakHourMultiplier: 1.5,
  serviceFee: 10,
  taxRate: 5,
  vehicleRates: {
    Car: 1.0,
    Bike: 0.5,
    SUV: 1.3,
    EV: 1.1,
  },
  updatedAt: new Date().toISOString(),
}

// GET /api/pricing - Get pricing configuration
router.get('/', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('pricing').doc('global-config').get()

    if (!doc.exists) {
      return res.status(200).json({
        success: true,
        data: DEFAULT_PRICING,
      })
    }

    return res.status(200).json({
      success: true,
      data: doc.data(),
    })
  } catch (err: any) {
    return res.status(200).json({ success: true, data: DEFAULT_PRICING })
  }
})

// PUT /api/pricing - Update pricing configuration (Admin only)
router.put('/', authenticateUser, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { baseHourlyRate, weekendMultiplier, peakHourMultiplier, serviceFee, taxRate, vehicleRates } = req.body

    const updatedPricing = {
      baseHourlyRate: Number(baseHourlyRate) || 50,
      weekendMultiplier: Number(weekendMultiplier) || 1.2,
      peakHourMultiplier: Number(peakHourMultiplier) || 1.5,
      serviceFee: Number(serviceFee) || 10,
      taxRate: Number(taxRate) || 5,
      vehicleRates: vehicleRates || DEFAULT_PRICING.vehicleRates,
      updatedAt: new Date().toISOString(),
    }

    await db.collection('pricing').doc('global-config').set(updatedPricing, { merge: true })

    return res.status(200).json({
      success: true,
      message: 'Pricing configuration updated successfully.',
      data: updatedPricing,
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

export default router
