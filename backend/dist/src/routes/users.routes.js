"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
// GET /api/users/admin/all - Get all users (Admin only)
router.get('/admin/all', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const snapshot = await firebase_1.db.collection('users').get();
        const users = [];
        snapshot.forEach((doc) => {
            const u = doc.data();
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
            });
        });
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// PATCH /api/users/admin/:id/status - Toggle user status (Admin only)
router.patch('/admin/:id/status', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { status } = req.body;
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value. Allowed: active, inactive.' });
        }
        const userRef = firebase_1.db.collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        await userRef.update({
            status,
            updatedAt: new Date().toISOString(),
        });
        return res.status(200).json({
            success: true,
            message: `User status updated to ${status}.`,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
