import { Router, Response } from 'express'
import { authenticateUser, requireAdmin, AuthRequest } from '../middlewares/auth.middleware'
import { db } from '../config/firebase'

const router = Router()

// GET /api/users/admin/all - Get all users (Admin only)
router.get('/admin/all', authenticateUser, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.collection('users').get()
    const users: any[] = []

    snapshot.forEach((doc: any) => {
      const u = doc.data()
      // Never expose sensitive internal tokens if any
      users.push({
        id: doc.id,
        uid: u.uid,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        photoURL: u.photoURL,
        status: u.status || 'active',
        createdAt: u.createdAt,
      })
    })

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/users/admin/:id/status - Toggle user status (Admin only)
router.patch('/admin/:id/status', authenticateUser, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const { status } = req.body

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value. Allowed: active, inactive.' })
    }

    const userRef = db.collection('users').doc(id)
    const doc = await userRef.get()

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    await userRef.update({
      status,
      updatedAt: new Date().toISOString(),
    })

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
    })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

export default router
