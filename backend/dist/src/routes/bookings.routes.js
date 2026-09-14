"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
// Helper: Calculate duration in hours
function calculateDurationInHours(startTimeStr, endTimeStr, bookingDate) {
    try {
        const start = new Date(`${bookingDate}T${startTimeStr}`);
        const end = new Date(`${bookingDate}T${endTimeStr}`);
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
        return hours;
    }
    catch (e) {
        return 2; // fallback default 2 hours
    }
}
// POST /api/bookings - Create new booking with Server Price Calculation & Race Condition Check
router.post('/', auth_middleware_1.authenticateUser, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        const { parkingLotId, parkingSlotId, vehicleId, bookingDate, startTime, endTime, paymentMethod = 'Card', } = req.body;
        if (!parkingLotId || !parkingSlotId || !vehicleId || !bookingDate || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Missing required booking parameters: parkingLotId, parkingSlotId, vehicleId, bookingDate, startTime, endTime.',
            });
        }
        // 1. Fetch Parking Lot to verify price per hour
        const lotDoc = await firebase_1.db.collection('parkingLots').doc(parkingLotId).get();
        if (!lotDoc.exists) {
            return res.status(404).json({ success: false, message: 'Parking lot not found.' });
        }
        const lotData = lotDoc.data();
        // 2. Fetch Parking Slot to verify existence & vehicle compatibility
        const slotDoc = await firebase_1.db.collection('parkingSlots').doc(parkingSlotId).get();
        if (!slotDoc.exists) {
            return res.status(404).json({ success: false, message: 'Selected parking slot not found.' });
        }
        const slotData = slotDoc.data();
        if (slotData.status === 'MAINTENANCE' || slotData.status === 'DISABLED') {
            return res.status(400).json({
                success: false,
                message: `Slot ${slotData.slotNumber} is currently under maintenance or disabled.`,
            });
        }
        // 3. Double Booking Check (Server-side validation for overlapping confirmed/active bookings)
        const existingBookingsSnapshot = await firebase_1.db
            .collection('bookings')
            .where('parkingSlotId', '==', parkingSlotId)
            .where('bookingDate', '==', bookingDate)
            .get();
        let hasOverlap = false;
        existingBookingsSnapshot.forEach((doc) => {
            const b = doc.data();
            if (['CONFIRMED', 'ACTIVE', 'Booked'].includes(b.bookingStatus)) {
                // Check time interval overlap
                if ((startTime >= b.startTime && startTime < b.endTime) ||
                    (endTime > b.startTime && endTime <= b.endTime) ||
                    (startTime <= b.startTime && endTime >= b.endTime)) {
                    hasOverlap = true;
                }
            }
        });
        if (hasOverlap) {
            return res.status(409).json({
                success: false,
                message: `Conflict: Slot ${slotData.slotNumber} is already booked for the selected time window.`,
            });
        }
        // 4. Server-Side Price Calculation (Never trust frontend amount)
        const durationHours = calculateDurationInHours(startTime, endTime, bookingDate);
        const hourlyRate = lotData.pricePerHour || 50;
        const parkingFee = durationHours * hourlyRate;
        const serviceFee = 10;
        const tax = Math.round(parkingFee * 0.05); // 5% tax
        const totalAmount = parkingFee + serviceFee + tax;
        // 5. Generate Unique Booking Reference
        const randomRefNum = Math.floor(100000 + Math.random() * 900000);
        const bookingReference = `PK-${new Date().getFullYear()}-${randomRefNum}`;
        // 6. Construct Booking Object
        const newBooking = {
            bookingReference,
            userId: req.user.uid,
            userName: req.user.name,
            userEmail: req.user.email,
            parkingLotId,
            parkingLotName: lotData.name,
            parkingLotAddress: lotData.address,
            parkingSlotId,
            slotNumber: slotData.slotNumber,
            vehicleId,
            bookingDate,
            startTime,
            endTime,
            durationHours,
            parkingFee,
            serviceFee,
            tax,
            totalAmount,
            bookingStatus: 'CONFIRMED',
            paymentStatus: 'PAID', // Simulated safe payment
            paymentMethod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const docRef = await firebase_1.db.collection('bookings').add(newBooking);
        // 7. Create Notification for User
        await firebase_1.db.collection('notifications').add({
            userId: req.user.uid,
            title: 'Booking Confirmed!',
            message: `Your booking ${bookingReference} at ${lotData.name} (Slot ${slotData.slotNumber}) is confirmed.`,
            type: 'booking',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        return res.status(201).json({
            success: true,
            message: 'Booking created successfully.',
            data: { id: docRef.id, ...newBooking },
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// GET /api/bookings/my - Get authenticated customer's bookings ONLY
router.get('/my', auth_middleware_1.authenticateUser, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        // Always filter by authenticated user UID
        const snapshot = await firebase_1.db.collection('bookings').where('userId', '==', req.user.uid).get();
        const bookings = [];
        snapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt descending
        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// GET /api/bookings/admin/all - Get all bookings (Admin only)
router.get('/admin/all', auth_middleware_1.authenticateUser, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const snapshot = await firebase_1.db.collection('bookings').get();
        const bookings = [];
        snapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// GET /api/bookings/:id - Get specific booking details
router.get('/:id', auth_middleware_1.authenticateUser, async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const doc = await firebase_1.db.collection('bookings').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        const bookingData = doc.data();
        // Security check: Customer can only view their OWN booking unless Admin
        if (bookingData.userId !== req.user?.uid && req.user?.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'HTTP 403 Forbidden: You do not have permission to view this booking.',
            });
        }
        return res.status(200).json({
            success: true,
            data: { id: doc.id, ...bookingData },
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// PATCH /api/bookings/:id/cancel - Cancel booking
router.patch('/:id/cancel', auth_middleware_1.authenticateUser, async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const bookingRef = firebase_1.db.collection('bookings').doc(id);
        const doc = await bookingRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        const bookingData = doc.data();
        // Security check: Must belong to user or Admin
        if (bookingData.userId !== req.user?.uid && req.user?.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'HTTP 403 Forbidden: You do not have permission to cancel this booking.',
            });
        }
        if (bookingData.bookingStatus === 'CANCELLED') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
        }
        await bookingRef.update({
            bookingStatus: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            updatedAt: new Date().toISOString(),
        });
        // Create Notification
        await firebase_1.db.collection('notifications').add({
            userId: bookingData.userId,
            title: 'Booking Cancelled',
            message: `Your booking ${bookingData.bookingReference} has been cancelled. Refund initiated.`,
            type: 'cancellation',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        return res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully.',
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
