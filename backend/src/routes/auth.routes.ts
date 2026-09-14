import { Router, Response } from 'express'
import { authenticateUser, AuthRequest } from '../middlewares/auth.middleware'
import { db } from '../config/firebase'

const router = Router()

// GET /api/auth/me - Verify current user profile
router.get('/me', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' })
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get()
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User profile not found in database' })
    }

    return res.status(200).json({
      success: true,
      user: userDoc.data(),
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/sync-profile - Sync user profile on first login/register
router.post('/sync-profile', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' })
    }

    const { name, phone, photoURL } = req.body
    const userRef = db.collection('users').doc(req.user.uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      // Create new user document (Always CUSTOMER for public sync)
      const newUser = {
        uid: req.user.uid,
        name: name || req.user.name,
        email: req.user.email,
        phone: phone || '',
        role: 'CUSTOMER', // Explicit customer role assignment
        photoURL: photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await userRef.set(newUser)
      return res.status(201).json({ success: true, user: newUser })
    } else {
      // Update profile fields (preserves existing role)
      const existingData = userDoc.data()!
      const updatedUser = {
        ...existingData,
        name: name || existingData.name,
        phone: phone !== undefined ? phone : existingData.phone,
        photoURL: photoURL !== undefined ? photoURL : existingData.photoURL,
        updatedAt: new Date().toISOString(),
      }
      await userRef.update(updatedUser)
      return res.status(200).json({ success: true, user: updatedUser })
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

export default router
