require("dotenv").config();

const express = require("express");
const cors = require("cors");
const packageRoutes = require("./routes/packageRoutes");
const logger = require("./middleware/logger");
const vendorRoutes = require("./routes/vendorRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const featureRoutes = require("./routes/featureRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const venueRoutes = require("./routes/venueRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const systemLogRoutes = require("./routes/systemLogRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/admin/system-logs", systemLogRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/admin/ledger", ledgerRoutes);
app.use("/api/vendor-dashboard", require("./routes/vendorDashboardRoutes"));
app.use("/api/expenses", expenseRoutes);

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "College Event Planner Backend Running 🚀",
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
