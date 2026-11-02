
const mongoose = require("mongoose");
const User = require("../models/User");
const Booking = require("../models/Booking");

const getVendorDashboard = async (req, res) => {
    try {
        const { vendorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vendor ID",
            });
        }

        const vendor = await User.findById(vendorId).select(
            "name email role vendorStatus vendorListingId"
        );

        if (!vendor || vendor.role !== "vendor") {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        if (vendor.vendorStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Vendor account is not approved",
            });
        }

        if (vendor.vendorListingId == null) {
            return res.json({
                success: true,
                vendor: {
                    id: vendor._id,
                    name: vendor.name,
                    email: vendor.email,
                    vendorStatus: vendor.vendorStatus,
                    vendorListingId: null,
                },
                stats: {
                    totalBookings: 0,
                    pendingBookings: 0,
                    confirmedBookings: 0,
                    revenue: 0,
                },
                bookings: [],
                message:
                    "Link this vendor account to a public vendor listing to load bookings.",
            });
        }

        // Only return bookings containing this vendor's listing.
        const bookings = await Booking.find({
            "items.type": "vendor",
            "items.itemId": vendor.vendorListingId,
        }).sort({ createdAt: -1 });

        const vendorBookings = bookings.map((booking) => {
            const vendorItems = booking.items.filter(
                (item) =>
                    item.type === "vendor" &&
                    Number(item.itemId) === Number(vendor.vendorListingId)
            );

            const vendorAmount = vendorItems.reduce(
                (sum, item) =>
                    sum + Number(item.calculatedAmount ?? item.price ?? 0),
                0
            );

            return {
                _id: booking._id,
                eventType: booking.eventType,
                startDate: booking.startDate,
                endDate: booking.endDate,
                customerName: booking.name,
                bookingStatus: booking.bookingStatus,
                paymentStatus: booking.paymentStatus,
                vendorAmount,
                items: vendorItems,
                createdAt: booking.createdAt,
            };
        });

        const pendingBookings = vendorBookings.filter(
            (booking) => booking.bookingStatus === "Pending"
        ).length;

        const confirmedBookings = vendorBookings.filter(
            (booking) => booking.bookingStatus === "Confirmed"
        ).length;

        // Count completed/confirmed vendor item amounts only when payment is completed.
        const revenue = bookings.reduce((total, booking) => {
            if (booking.paymentStatus !== "Completed") return total;

            const matchingItems = booking.items.filter(
                (item) =>
                    item.type === "vendor" &&
                    Number(item.itemId) === Number(vendor.vendorListingId)
            );

            return (
                total +
                matchingItems.reduce(
                    (sum, item) =>
                        sum + Number(item.calculatedAmount ?? item.price ?? 0),
                    0
                )
            );
        }, 0);

        return res.json({
            success: true,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                vendorStatus: vendor.vendorStatus,
                vendorListingId: vendor.vendorListingId,
            },
            stats: {
                totalBookings: vendorBookings.length,
                pendingBookings,
                confirmedBookings,
                revenue,
            },
            bookings: vendorBookings,
        });
    } catch (error) {
        console.error("Vendor dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load vendor dashboard",
        });
    }
};

module.exports = { getVendorDashboard };
