
const User = require("../models/User");
const Booking = require("../models/Booking");
const Refund = require("../models/Refund");

// ==========================================
// GET ALL VENDORS
// ==========================================
const getAllVendors = async (req, res) => {
    try {
        const vendors = await User.find({ role: "vendor" })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            vendors
        });
    } catch (error) {
        console.error("Get Vendors Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch vendors"
        });
    }
};

// ==========================================
// GET ALL BOOKINGS
// ==========================================
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error("Get All Bookings Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
};

// ==========================================
// UPDATE BOOKING STATUS
// ==========================================
const updateBookingStatus = async (req, res) => {
    try {
        const bookingStatus = req.body?.bookingStatus;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(bookingStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        booking.bookingStatus = bookingStatus;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking
        });
    } catch (error) {
        console.error("Update Booking Status Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update booking status"
        });
    }
};

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
const updatePaymentStatus = async (req, res) => {
    try {
        const paymentStatus = req.body?.paymentStatus;

        const allowedStatuses = [
            "Pending",
            "Completed"
        ];

        if (!allowedStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status"
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        booking.paymentStatus = paymentStatus;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            booking
        });
    } catch (error) {
        console.error("Update Payment Status Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update payment status"
        });
    }
};

// ==========================================
// UPDATE VENDOR STATUS
// ==========================================
const updateVendorStatus = async (req, res) => {
    try {
        const vendorStatus = req.body?.vendorStatus;

        const allowedStatuses = [
            "pending",
            "approved",
            "rejected"
        ];

        if (!allowedStatuses.includes(vendorStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vendor status"
            });
        }

        const vendor = await User.findOne({
            _id: req.params.id,
            role: "vendor"
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        vendor.vendorStatus = vendorStatus;
        await vendor.save();

        return res.status(200).json({
            success: true,
            message: `Vendor ${vendorStatus} successfully`,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                vendorStatus: vendor.vendorStatus
            }
        });
    } catch (error) {
        console.error("Update Vendor Status Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update vendor status"
        });
    }
};

// ==========================================
// GET ALL CUSTOMERS
// ==========================================
const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "customer" })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            customers
        });
    } catch (error) {
        console.error("Get Customers Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch customers"
        });
    }
};

// ==========================================
// GET ALL REFUNDS
// ==========================================
const getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find()
            .populate("userId", "name email")
            .populate(
                "bookingId",
                "bookingStatus paymentStatus totalAmount createdAt"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            refunds
        });
    } catch (error) {
        console.error("Get Refunds Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch refunds"
        });
    }
};

// ==========================================
// CREATE REFUND REQUEST
// ==========================================
const createRefund = async (req, res) => {
    try {
        const { bookingId, reason } = req.body || {};

        if (
            !bookingId ||
            typeof reason !== "string" ||
            !reason.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Booking ID and refund reason are required"
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.bookingStatus !== "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Only cancelled bookings can be submitted for refund review"
            });
        }

        if (booking.paymentStatus !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Refund review requires a completed payment"
            });
        }

        const existingRefund = await Refund.findOne({ bookingId });

        if (existingRefund) {
            return res.status(409).json({
                success: false,
                message: "A refund record already exists for this booking",
                refund: existingRefund
            });
        }

        const refund = await Refund.create({
            bookingId: booking._id,
            userId: booking.userId,
            amount: booking.totalAmount,
            reason: reason.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Refund request created for admin review",
            refund
        });
    } catch (error) {
        console.error("Create Refund Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create refund request"
        });
    }
};

// ==========================================
// UPDATE REFUND STATUS
// ==========================================
const updateRefundStatus = async (req, res) => {
    try {
        const { status, adminNote } = req.body || {};

        const allowedStatuses = [
            "Approved",
            "Rejected",
            "Refunded"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid refund status"
            });
        }

        const refund = await Refund.findById(req.params.id);

        if (!refund) {
            return res.status(404).json({
                success: false,
                message: "Refund record not found"
            });
        }

        if (
            refund.status !== "Pending" &&
            refund.status !== "Approved"
        ) {
            return res.status(400).json({
                success: false,
                message: "This refund record can no longer be updated"
            });
        }

        if (status === "Refunded" && refund.status !== "Approved") {
            return res.status(400).json({
                success: false,
                message: "Approve the refund before marking it as refunded"
            });
        }

        refund.status = status;

        if (adminNote !== undefined) {
            refund.adminNote = String(adminNote).trim();
        }

        refund.reviewedAt = new Date();

        await refund.save();

        return res.status(200).json({
            success: true,
            message: `Refund status updated to ${status}`,
            refund
        });
    } catch (error) {
        console.error("Update Refund Status Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update refund status"
        });
    }
};

// ==========================================
// ADMIN MANAGEMENT: GET ALL ADMINS
// ==========================================
const getAllAdmins = async (req, res) => {
    try {
        const adminRoles = [
            "super_admin",
            "onboarding_manager",
            "finance_manager",
            "customer_support"
        ];

        const admins = await User.find({
            role: { $in: adminRoles }
        })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            admins
        });
    } catch (error) {
        console.error("Get Admins Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admins"
        });
    }
};

// ==========================================
// ADMIN MANAGEMENT: UPDATE ADMIN ROLE
// ==========================================
const updateAdminRole = async (req, res) => {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request Body:", req.body);

    try {
        const role = req.body?.role;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required. Send role in JSON body."
            });
        }

        const allowedRoles = [
            "super_admin",
            "onboarding_manager",
            "finance_manager",
            "customer_support"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid admin role"
            });
        }

        const admin = await User.findOne({
            _id: req.params.id,
            role: { $in: allowedRoles }
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        admin.role = role;
        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin role updated successfully",
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Update Admin Role Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update admin role"
        });
    }
};


const getAdminOverview = async (req, res) => {
    try {
        const now = new Date();

        const thisMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const lastMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const nextMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const [
            totalVendors,
            totalCustomers,
            totalBookings,
            lastMonthVendors,
            lastMonthCustomers,
            lastMonthBookings,
            paidBookings,
            lastMonthPaidBookings
        ] = await Promise.all([
            User.countDocuments({ role: "vendor" }),
            User.countDocuments({ role: "customer" }),
            Booking.countDocuments(),
            User.countDocuments({
                role: "vendor",
                createdAt: { $lt: thisMonthStart }
            }),
            User.countDocuments({
                role: "customer",
                createdAt: { $lt: thisMonthStart }
            }),
            Booking.countDocuments({
                createdAt: { $lt: thisMonthStart }
            }),
            Booking.find({ paymentStatus: "Completed" }).select(
                "totalAmount createdAt"
            ).lean(),
            Booking.find({
                paymentStatus: "Completed",
                createdAt: {
                    $gte: lastMonthStart,
                    $lt: thisMonthStart
                }
            }).select("totalAmount").lean()
        ]);

        const thisMonthBookings = await Booking.countDocuments({
            createdAt: {
                $gte: thisMonthStart,
                $lt: nextMonthStart
            }
        });

        const thisMonthCustomers = await User.countDocuments({
            role: "customer",
            createdAt: {
                $gte: thisMonthStart,
                $lt: nextMonthStart
            }
        });

        const thisMonthVendors = await User.countDocuments({
            role: "vendor",
            createdAt: {
                $gte: thisMonthStart,
                $lt: nextMonthStart
            }
        });

        const platformRevenue = paidBookings.reduce(
            (sum, booking) => sum + (Number(booking.totalAmount) || 0),
            0
        );

        const thisMonthRevenue = paidBookings
            .filter((booking) => new Date(booking.createdAt) >= thisMonthStart)
            .reduce(
                (sum, booking) => sum + (Number(booking.totalAmount) || 0),
                0
            );

        const lastMonthRevenue = lastMonthPaidBookings.reduce(
            (sum, booking) => sum + (Number(booking.totalAmount) || 0),
            0
        );

        return res.status(200).json({
            success: true,
            stats: {
                totalVendors,
                totalCustomers,
                totalBookings,
                platformRevenue,
                thisMonth: {
                    vendors: thisMonthVendors,
                    customers: thisMonthCustomers,
                    bookings: thisMonthBookings,
                    revenue: thisMonthRevenue
                },
                previousMonth: {
                    vendors: totalVendors - thisMonthVendors,
                    customers: lastMonthCustomers - 0,
                    bookings: lastMonthBookings - 0,
                    revenue: lastMonthRevenue
                }
            }
        });
    } catch (error) {
        console.error("Admin Overview Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load admin overview"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
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
    getAdminOverview,
};
