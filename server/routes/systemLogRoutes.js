const express = require("express");
const router = express.Router();

const {
    getSystemLogs
} = require("../controllers/systemLogController");

router.get("/", getSystemLogs);

module.exports = router;    