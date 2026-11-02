const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema(
    {
        method: {
            type: String,
            required: true
        },
        endpoint: {
            type: String,
            required: true
        },
        statusCode: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 0
        },
        level: {
            type: String,
            enum: ["info", "warning", "error"],
            default: "info"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SystemLog", systemLogSchema);