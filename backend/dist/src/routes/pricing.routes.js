"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
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
};
// GET /api/pricing - Get pricing configuration
router.get('/', async (req, res) => {
    try {
        const doc = await firebase_1.db.collection('pricing').doc('global-config').get();
        if (!doc.exists) {
            return res.status(200).json({
                success: true,
                data: DEFAULT_PRICING,
            });
        }
        return res.status(200).json({
            success: true,
            data: doc.data(),
        });
    }
    catch (err) {
        return res.status(200).json({ success: true, data: DEFAULT_PRICING });
    }
});
// PUT /api/pricing - Update pricing configuration (Admin only)
router.put('/', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const { baseHourlyRate, weekendMultiplier, peakHourMultiplier, serviceFee, taxRate, vehicleRates } = req.body;
        const updatedPricing = {
            baseHourlyRate: Number(baseHourlyRate) || 50,
            weekendMultiplier: Number(weekendMultiplier) || 1.2,
            peakHourMultiplier: Number(peakHourMultiplier) || 1.5,
            serviceFee: Number(serviceFee) || 10,
            taxRate: Number(taxRate) || 5,
            vehicleRates: vehicleRates || DEFAULT_PRICING.vehicleRates,
            updatedAt: new Date().toISOString(),
        };
        await firebase_1.db.collection('pricing').doc('global-config').set(updatedPricing, { merge: true });
        return res.status(200).json({
            success: true,
            message: 'Pricing configuration updated successfully.',
            data: updatedPricing,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
