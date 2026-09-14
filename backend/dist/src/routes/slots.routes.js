"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
// GET /api/parking/:parkingId/slots - Get slots for a parking lot
router.get('/parking/:parkingId/slots', async (req, res) => {
    try {
        const { parkingId } = req.params;
        const { floor, vehicleType, status } = req.query;
        const snapshot = await firebase_1.db.collection('parkingSlots').where('parkingLotId', '==', parkingId).get();
        let slots = [];
        snapshot.forEach((doc) => {
            slots.push({ id: doc.id, ...doc.data() });
        });
        if (floor) {
            slots = slots.filter((s) => s.floor === floor);
        }
        if (vehicleType) {
            slots = slots.filter((s) => s.vehicleType?.toLowerCase() === vehicleType.toLowerCase());
        }
        if (status) {
            slots = slots.filter((s) => s.status?.toUpperCase() === status.toUpperCase());
        }
        // Sort by slot number
        slots.sort((a, b) => a.slotNumber.localeCompare(b.slotNumber));
        return res.status(200).json({
            success: true,
            count: slots.length,
            data: slots,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// POST /api/slots - Create parking slot (Admin only)
router.post('/slots', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const { parkingLotId, slotNumber, floor, section, vehicleType, status, isEV, isAccessible } = req.body;
        if (!parkingLotId || !slotNumber) {
            return res.status(400).json({
                success: false,
                message: 'parkingLotId and slotNumber are required.',
            });
        }
        const newSlot = {
            parkingLotId,
            slotNumber,
            floor: floor || 'Ground Floor',
            section: section || 'A',
            vehicleType: vehicleType || 'Car',
            status: status || 'AVAILABLE',
            isEV: Boolean(isEV),
            isAccessible: Boolean(isAccessible),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const docRef = await firebase_1.db.collection('parkingSlots').add(newSlot);
        return res.status(201).json({
            success: true,
            message: 'Parking slot created successfully.',
            data: { id: docRef.id, ...newSlot },
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// PUT /api/slots/:id - Update parking slot (Admin only)
router.put('/slots/:id', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const slotRef = firebase_1.db.collection('parkingSlots').doc(id);
        const doc = await slotRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Parking slot not found.' });
        }
        const updateData = {
            ...req.body,
            updatedAt: new Date().toISOString(),
        };
        await slotRef.update(updateData);
        return res.status(200).json({
            success: true,
            message: 'Parking slot updated successfully.',
            data: { id, ...doc.data(), ...updateData },
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// DELETE /api/slots/:id - Delete slot (Admin only)
router.delete('/slots/:id', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const slotRef = firebase_1.db.collection('parkingSlots').doc(id);
        const doc = await slotRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Parking slot not found.' });
        }
        await slotRef.delete();
        return res.status(200).json({
            success: true,
            message: 'Parking slot deleted successfully.',
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
