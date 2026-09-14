"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
// GET /api/auth/me - Verify current user profile
router.get('/me', auth_middleware_1.authenticateUser, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const userDoc = await firebase_1.db.collection('users').doc(req.user.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User profile not found in database' });
        }
        return res.status(200).json({
            success: true,
            user: userDoc.data(),
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// POST /api/auth/sync-profile - Sync user profile on first login/register
router.post('/sync-profile', auth_middleware_1.authenticateUser, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const { name, phone, photoURL } = req.body;
        const userRef = firebase_1.db.collection('users').doc(req.user.uid);
        const userDoc = await userRef.get();
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
            };
            await userRef.set(newUser);
            return res.status(201).json({ success: true, user: newUser });
        }
        else {
            // Update profile fields (preserves existing role)
            const existingData = userDoc.data();
            const updatedUser = {
                ...existingData,
                name: name || existingData.name,
                phone: phone !== undefined ? phone : existingData.phone,
                photoURL: photoURL !== undefined ? photoURL : existingData.photoURL,
                updatedAt: new Date().toISOString(),
            };
            await userRef.update(updatedUser);
            return res.status(200).json({ success: true, user: updatedUser });
        }
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
