"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const parking_routes_1 = __importDefault(require("./routes/parking.routes"));
const slots_routes_1 = __importDefault(require("./routes/slots.routes"));
const bookings_routes_1 = __importDefault(require("./routes/bookings.routes"));
const vehicles_routes_1 = __importDefault(require("./routes/vehicles.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const pricing_routes_1 = __importDefault(require("./routes/pricing.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use(express_1.default.json());
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'ParkEase REST API Backend',
        backend: 'Firebase Admin SDK',
        timestamp: new Date().toISOString(),
    });
});
// Register API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/parking', parking_routes_1.default);
app.use('/api', slots_routes_1.default);
app.use('/api/bookings', bookings_routes_1.default);
app.use('/api/vehicles', vehicles_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/pricing', pricing_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 ParkEase Backend REST API running on port ${PORT}`);
        console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    });
}
exports.default = app;
