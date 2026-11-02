const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/event_planner");

        console.log("MongoDB Connected Successfully 🚀");
    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
    }
};

module.exports = connectDB;