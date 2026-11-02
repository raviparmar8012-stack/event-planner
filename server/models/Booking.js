const mongoose = require("mongoose");

const bookingItemSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["vendor", "package", "venue"],
            required: true
        },

        itemId: {
            type: Number,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        category: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        state: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        priceUnit: {
            type: String,
            enum: ["per day", "full package"],
            required: true
        },

        calculatedAmount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);


const bookingSchema = new mongoose.Schema(
    {
        // =========================
        // CUSTOMER
        // =========================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },


        // =========================
        // EVENT DETAILS
        // =========================

        eventType: {
            type: String,
            required: true,
            trim: true
        },

        startDate: {
            type: String,
            required: true
        },

        endDate: {
            type: String,
            required: true
        },

        guests: {
            type: Number,
            required: true,
            min: 1
        },

        eventLocation: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            default: "",
            trim: true
        },


        // =========================
        // BOOKED SERVICES
        // =========================

        items: {
            type: [bookingItemSchema],
            default: []
        },


        // =========================
        // TOTAL
        // =========================

        totalAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        // =========================
        // PAYMENT
        // =========================

        paymentStatus: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        },


        // =========================
        // BOOKING STATUS
        // =========================

        bookingStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Booking",
    bookingSchema
);