const express = require("express");
const router = express.Router();

const {
    getAllVendors,
    updateVendorStatus,
    getAllCustomers,
    getAllBookings,
    updateBookingStatus,
    updatePaymentStatus,
    getAllRefunds,
    createRefund,
    updateRefundStatus,
    getAllAdmins,
    updateAdminRole,
    getAdminOverview
} = require("../controllers/adminController");

// Vendor Management
router.get("/vendors", getAllVendors);
router.put("/vendors/:id/status", updateVendorStatus);

// Customer Management
router.get("/customers", getAllCustomers);

// Booking Management
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);
router.put("/bookings/:id/payment", updatePaymentStatus);

// Refund Management
router.get("/refunds", getAllRefunds);
router.post("/refunds", createRefund);
router.put("/refunds/:id/status", updateRefundStatus);

// Admin Management
router.get("/admins", getAllAdmins);
router.put("/admins/:id/role", updateAdminRole);


router.get("/overview", getAdminOverview);
module.exports = router;