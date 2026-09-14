"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.requireAdmin = requireAdmin;
const firebase_1 = require("../config/firebase");
async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Authentication token missing or invalid format.',
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        // 1. Verify Firebase ID Token via Admin SDK
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        // 2. Fetch User Profile from Firestore to get authoritative role
        const userDoc = await firebase_1.db.collection('users').doc(uid).get();
        let role = 'CUSTOMER';
        let name = decodedToken.name || decodedToken.email?.split('@')[0] || 'User';
        let phone = '';
        if (userDoc.exists) {
            const data = userDoc.data();
            role = data?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
            name = data?.name || name;
            phone = data?.phone || '';
        }
        else {
            // Fallback role check from token custom claims if Firestore doc not yet created
            if (decodedToken.role === 'ADMIN') {
                role = 'ADMIN';
            }
        }
        req.user = {
            uid,
            email: decodedToken.email || '',
            name,
            phone,
            role,
        };
        next();
    }
    catch (err) {
        console.error('Authentication Error:', err.message);
        return res.status(401).json({
            success: false,
            message: 'Session expired or invalid authentication token. Please log in again.',
        });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
        });
    }
    // Strict role check: CUSTOMER users MUST NOT access admin endpoints
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'HTTP 403 Forbidden: You do not have administrator permissions to perform this action.',
        });
    }
    next();
}
