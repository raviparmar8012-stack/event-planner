const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        reason: {
            type: String,
            trim: true,
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Refunded"],
            default: "Pending",
        },

        adminNote: {
            type: String,
            trim: true,
            default: "",
        },

        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Refund", refundSchema);