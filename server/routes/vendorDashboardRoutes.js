
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Vendor dashboard route is working!",
    });
});

const {
    getVendorDashboard,
} = require("../controllers/vendorDashboardController");

router.get("/:vendorId", getVendorDashboard);

module.exports = router;
