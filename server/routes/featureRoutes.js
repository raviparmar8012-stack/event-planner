const express = require("express");

const router = express.Router();

const { getFeatures } = require("../controllers/featureController");

router.get("/", getFeatures);

module.exports = router;