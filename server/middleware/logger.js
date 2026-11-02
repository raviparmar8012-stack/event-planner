const SystemLog = require("../models/SystemLog");

const logger = (req, res, next) => {
    const startTime = Date.now();

    console.log(`${req.method} ${req.originalUrl}`);

    // Avoid logging requests that fetch system logs
    if (req.originalUrl.startsWith("/api/admin/system-logs")) {
        return next();
    }

    res.on("finish", async () => {
        const statusCode = res.statusCode;

        const level =
            statusCode >= 500
                ? "error"
                : statusCode >= 400
                    ? "warning"
                    : "info";

        try {
            await SystemLog.create({
                method: req.method,
                endpoint: req.originalUrl,
                statusCode,
                duration: Date.now() - startTime,
                level
            });
        } catch (error) {
            console.error("System Log Save Error:", error.message);
        }
    });

    next();
};

module.exports = logger;