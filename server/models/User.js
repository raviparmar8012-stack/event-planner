
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: [
                "customer",
                "vendor",
                "super_admin",
                "onboarding_manager",
                "finance_manager",
                "customer_support",
            ],
            default: "customer",
        },

        vendorStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        // Link registered vendor to a public vendor listing
        vendorListingId: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
