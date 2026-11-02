const express = require("express");

const router = express.Router();

const {
    createBooking,
    getUserBookings,
    getBookingById,
    addBookingItem,
    cancelBooking
} = require("../controllers/bookingController");




// =====================================================
// CREATE NEW EVENT
// =====================================================

router.post(
    "/",
    createBooking
);


// =====================================================
// GET USER EVENTS
// =====================================================

router.get(
    "/user/:userId",
    getUserBookings
);


// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get(
    "/:id",
    getBookingById
);


// =====================================================
// ADD ITEM TO EXISTING EVENT
// =====================================================

router.put(
    "/:id/items",
    addBookingItem
);

// CANCEL BOOKING
router.put("/:id/cancel", cancelBooking);


module.exports = router;