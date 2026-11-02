const express = require("express");

const router = express.Router();

const {
    getAllVenues,
    getVenueById,
    getVenueImage
} = require("../controllers/venueController");

router.get("/", getAllVenues);
router.get("/:id/image", getVenueImage);
router.get("/:id", getVenueById);

module.exports = router;