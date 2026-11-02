const bcrypt = require("bcrypt");
const User = require("../models/User");

// ==========================================
// CUSTOMER REGISTER
// ==========================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "customer",
            vendorStatus: "approved"
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Customer Register Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};


// ==========================================
// VENDOR REGISTER
// ==========================================

const registerVendor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const vendor = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "vendor",
            vendorStatus: "pending"
        });

        res.status(201).json({
            success: true,
            message:
                "Vendor registration submitted. Waiting for admin approval.",
            user: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                vendorStatus: vendor.vendorStatus
            }
        });

    } catch (error) {
        console.log("Vendor Register Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Vendor registration failed"
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // ==========================================
        // VENDOR APPROVAL CHECK
        // ==========================================

        if (
            user.role === "vendor" &&
            user.vendorStatus !== "approved"
        ) {
            if (user.vendorStatus === "rejected") {
                return res.status(403).json({
                    success: false,
                    message:
                        "Your vendor application has been rejected"
                });
            }

            return res.status(403).json({
                success: false,
                message:
                    "Your vendor account is waiting for admin approval"
            });
        }


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        res.json({
            success: true,
            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vendorStatus: user.vendorStatus
            }
        });

    } catch (error) {
        console.log("Login Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};


// ==========================================
// CREATE SUPER ADMIN
// ==========================================
// Temporary endpoint.
// Use this once to create the Super Admin.
// Later this endpoint should be protected/removed.
// ==========================================

const createSuperAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "super_admin",
            vendorStatus: "approved"
        });

        res.status(201).json({
            success: true,
            message: "Super Admin created successfully",

            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.log("Super Admin Creation Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create Super Admin"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    registerUser,
    registerVendor,
    loginUser,
    createSuperAdmin
};