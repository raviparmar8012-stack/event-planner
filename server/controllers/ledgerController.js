const Booking = require("../models/Booking");
const Refund = require("../models/Refund");

// GET /api/admin/ledger
const getLedger = async (req, res) => {
    try {
        const [paidBookings, completedRefunds] = await Promise.all([
            Booking.find({ paymentStatus: "Completed" })
                .populate("userId", "name email")
                .lean(),

            Refund.find({ status: "Refunded" })
                .populate("userId", "name email")
                .lean()
        ]);

        const credits = paidBookings.map((booking) => ({
            id: `PAY-${booking._id}`,
            referenceId: booking._id,
            date: booking.updatedAt || booking.createdAt,
            type: "Credit",
            category: "Booking Payment",
            description: `Payment for ${booking.eventType || "Event Booking"}`,
            customer:
                booking.customerName ||
                booking.name ||
                booking.userId?.name ||
                "Customer",
            amount: Number(booking.totalAmount) || 0,
            status: "Completed"
        }));

        const debits = completedRefunds.map((refund) => ({
            id: `REF-${refund._id}`,
            referenceId: refund.bookingId,
            date: refund.reviewedAt || refund.updatedAt || refund.createdAt,
            type: "Debit",
            category: "Customer Refund",
            description: refund.reason || "Booking refund",
            customer: refund.userId?.name || "Customer",
            amount: Number(refund.amount) || 0,
            status: "Refunded"
        }));

        const transactions = [...credits, ...debits].sort(
            (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
        );

        const totalCredits = credits.reduce(
            (total, item) => total + item.amount,
            0
        );

        const totalDebits = debits.reduce(
            (total, item) => total + item.amount,
            0
        );

        return res.status(200).json({
            success: true,
            summary: {
                totalCredits,
                totalDebits,
                netBalance: totalCredits - totalDebits,
                totalTransactions: transactions.length
            },
            transactions
        });
    } catch (error) {
        console.error("Ledger Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load ledger records."
        });
    }
};


module.exports = { getLedger };