
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        legacyId: {
            type: String,
        },
    },
    { timestamps: true }
);

expenseSchema.index(
    { vendorId: 1, legacyId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            legacyId: { $type: "string" },
        },
    }
);

module.exports = mongoose.model("Expense", expenseSchema);
