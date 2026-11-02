const SystemLog = require("../models/SystemLog");

const getSystemLogs = async (req, res) => {
    try {
        const logs = await SystemLog.find()
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();

        return res.status(200).json({
            success: true,
            total: logs.length,
            logs
        });
    } catch (error) {
        console.error("Get System Logs Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch system logs"
        });
    }
};

module.exports = { getSystemLogs };