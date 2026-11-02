const express = require("express");

const router = express.Router();

const {
    registerUser,
    registerVendor,
    loginUser,
    createSuperAdmin
} = require("../controllers/userController");


// Customer Registration
router.post("/register", registerUser);


// Vendor Registration
router.post("/vendor/register", registerVendor);


// Login
router.post("/login", loginUser);


// Temporary Super Admin Creation
router.post("/create-super-admin", createSuperAdmin);


module.exports = router;