    const Booking = require("../models/Booking");
    
    
    // =====================================================
    // HELPER: CALCULATE NUMBER OF DAYS
    // =====================================================
    
    const calculateDays = (startDate, endDate) => {
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);
    
        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return 1;
        }
    
        const difference =
            Math.round(
                (end - start) / (1000 * 60 * 60 * 24)
            ) + 1;
    
        return Math.max(1, difference);
    };
    
    
    // =====================================================
    // HELPER: CALCULATE TOTAL
    // =====================================================
    
    const calculateBookingTotal = (
        items,
        startDate,
        endDate
    ) => {
        const days = calculateDays(
            startDate,
            endDate
        );
    
        return items.reduce(
            (total, item) => {
                if (item.priceUnit === "per day") {
                    return (
                        total +
                        Number(item.price || 0) * days
                    );
                }
    
                return (
                    total +
                    Number(item.price || 0)
                );
            },
            0
        );
    };
    
    
    // =====================================================
    // CREATE NEW EVENT BOOKING
    // =====================================================
    
    const createBooking = async (req, res) => {
        try {
            const {
                userId,
                name,
                email,
                phone,
                eventType,
                startDate,
                endDate,
                guests,
                eventLocation,
                message,
                items
            } = req.body;
    
    
            // =========================
            // BASIC VALIDATION
            // =========================
    
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required"
                });
            }
    
    
            if (!name || !email || !phone) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Name, email and phone are required"
                });
            }
    
    
            if (
                !eventType ||
                !startDate ||
                !endDate
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Event type and dates are required"
                });
            }
    
    
            if (!guests || Number(guests) < 1) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Valid number of guests is required"
                });
            }
    
    
            if (!eventLocation) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Event location is required"
                });
            }
    
    
            if (
                new Date(endDate) <
                new Date(startDate)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "End date cannot be before start date"
                });
            }
    
    
            // =========================
            // ITEMS VALIDATION
            // =========================
    
            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "At least one booking item is required"
                });
            }
    
    
            // =========================
            // CHECK ITEM TYPES
            // =========================
    
            const vendors = items.filter(
                (item) =>
                    item.type === "vendor"
            );
    
            const packages = items.filter(
                (item) =>
                    item.type === "package"
            );
    
            const venues = items.filter(
                (item) =>
                    item.type === "venue"
            );
    
    
            // Multiple vendors allowed
    
            // Only one package allowed
            if (packages.length > 1) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Only one package can be added to an event"
                });
            }
    
    
            // Only one venue allowed
            if (venues.length > 1) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Only one venue can be added to an event"
                });
            }
    
    
            // =========================
            // PREVENT DUPLICATE ITEMS
            // =========================
    
            const uniqueKeys = new Set();
    
            for (const item of items) {
                const key =
                    `${item.type}-${item.itemId}`;
    
                if (uniqueKeys.has(key)) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Duplicate booking item is not allowed"
                    });
                }
    
                uniqueKeys.add(key);
            }
    
    
            // =========================
            // NORMALIZE ITEMS
            // =========================
    
            const normalizedItems =
                items.map((item) => ({
                    type: item.type,
                    itemId: Number(item.itemId),
                    name: item.name,
                    category:
                        item.category || "",
                    city:
                        item.city || "",
                    state:
                        item.state || "",
                    price:
                        Number(item.price || 0),
                    priceUnit:
                        item.priceUnit === "full package"
                            ? "full package"
                            : "per day",
                    calculatedAmount:
                        item.priceUnit === "full package"
                            ? Number(item.price || 0)
                            : Number(item.price || 0) *
                            calculateDays(
                                startDate,
                                endDate
                            )
                }));
    
    
            // =========================
            // CALCULATE TOTAL
            // =========================
    
            const totalAmount =
                calculateBookingTotal(
                    normalizedItems,
                    startDate,
                    endDate
                );
    
    
            // =========================
            // AVAILABILITY CHECK
            // =========================
    
            const requestedVendorIds =
                vendors.map(
                    (item) => Number(item.itemId)
                );
    
            const requestedPackageId =
                packages[0]
                    ? Number(packages[0].itemId)
                    : null;
    
            const requestedVenueId =
                venues[0]
                    ? Number(venues[0].itemId)
                    : null;
    
    
            const overlappingBookings =
                await Booking.find({
                    bookingStatus: {
                        $ne: "Cancelled"
                    },
    
                    startDate: {
                        $lte: endDate
                    },
    
                    endDate: {
                        $gte: startDate
                    },
    
                    items: {
                        $exists: true,
                        $ne: []
                    }
                });
    
    
            for (
                const existingBooking
                of overlappingBookings
                ) {
                for (
                    const existingItem
                    of existingBooking.items
                    ) {
    
                    // Vendor conflict
                    if (
                        existingItem.type ===
                        "vendor" &&
                        requestedVendorIds.includes(
                            Number(
                                existingItem.itemId
                            )
                        )
                    ) {
                        return res.status(400).json({
                            success: false,
                            message:
                                `${existingItem.name} is already booked for the selected dates`
                        });
                    }
    
    
                    // Package conflict
                    if (
                        existingItem.type ===
                        "package" &&
                        requestedPackageId &&
                        Number(
                            existingItem.itemId
                        ) === requestedPackageId
                    ) {
                        return res.status(400).json({
                            success: false,
                            message:
                                `${existingItem.name} is already booked for the selected dates`
                        });
                    }
    
    
                    // Venue conflict
                    if (
                        existingItem.type ===
                        "venue" &&
                        requestedVenueId &&
                        Number(
                            existingItem.itemId
                        ) === requestedVenueId
                    ) {
                        return res.status(400).json({
                            success: false,
                            message:
                                `${existingItem.name} is already booked for the selected dates`
                        });
                    }
                }
            }
    
    
            // =========================
            // CREATE BOOKING
            // =========================
    
            const booking =
                await Booking.create({
                    userId,
    
                    name:
                        name.trim(),
    
                    email:
                        email.trim().toLowerCase(),
    
                    phone:
                        phone.trim(),
    
                    eventType:
                        eventType.trim(),
    
                    startDate,
    
                    endDate,
    
                    guests:
                        Number(guests),
    
                    eventLocation:
                        eventLocation.trim(),
    
                    message:
                        message
                            ? message.trim()
                            : "",
    
                    items:
                    normalizedItems,
    
                    totalAmount,
    
                    paymentStatus:
                        "Pending",
    
                    bookingStatus:
                        "Pending"
                });
    
    
            res.status(201).json({
                success: true,
                message:
                    "Event booking created successfully 🚀",
                booking
            });
    
        } catch (error) {
    
            console.log(
                "Create Booking Error:",
                error.message
            );
    
            res.status(500).json({
                success: false,
                message:
                    "Booking failed",
                error:
                error.message
            });
        }
    };
    
    
    // =====================================================
    // GET USER BOOKINGS
    // =====================================================
    
    const getUserBookings = async (
        req,
        res
    ) => {
        try {
    
            const bookings =
                await Booking.find({
                    userId:
                    req.params.userId
                })
                    .sort({
                        createdAt: -1
                    });
    
    
            res.json({
                success: true,
                bookings
            });
    
        } catch (error) {
    
            console.log(
                "Get Bookings Error:",
                error.message
            );
    
            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch bookings"
            });
        }
    };
    
    
    // =====================================================
    // GET SINGLE BOOKING
    // =====================================================
    
    const getBookingById = async (
        req,
        res
    ) => {
        try {
    
            const booking =
                await Booking.findById(
                    req.params.id
                );
    
    
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Booking not found"
                });
            }
    
    
            res.json({
                success: true,
                booking
            });
    
        } catch (error) {
    
            console.log(
                "Get Booking Error:",
                error.message
            );
    
            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch booking"
            });
        }
    };
    
    
    // =====================================================
    // ADD ITEM TO EXISTING EVENT
    // =====================================================
    
    const addBookingItem = async (
        req,
        res
    ) => {
        try {
    
            const {
                type,
                itemId,
                name,
                category,
                city,
                state,
                price,
                priceUnit
            } = req.body;
    
    
            // =========================
            // VALIDATION
            // =========================
    
            if (
                !type ||
                !itemId ||
                !name ||
                price === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Complete item details are required"
                });
            }
    
    
            if (
                ![
                    "vendor",
                    "package",
                    "venue"
                ].includes(type)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid booking item type"
                });
            }
    
    
            const booking =
                await Booking.findById(
                    req.params.id
                );
    
    
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Booking not found"
                });
            }
    
    
            if (
                booking.bookingStatus ===
                "Cancelled"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cancelled booking cannot be modified"
                });
            }
    
    
            // =========================
            // CHECK DUPLICATE
            // =========================
    
            const alreadyExists =
                booking.items.some(
                    (item) =>
                        item.type === type &&
                        Number(item.itemId) ===
                        Number(itemId)
                );
    
    
            if (alreadyExists) {
                return res.status(400).json({
                    success: false,
                    message:
                        "This item is already added to the event"
                });
            }
    
    
            // =========================
            // PACKAGE LIMIT
            // =========================
    
            if (type === "package") {
    
                const packageExists =
                    booking.items.some(
                        (item) =>
                            item.type ===
                            "package"
                    );
    
                if (packageExists) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "A package is already added to this event"
                    });
                }
            }
    
    
            // =========================
            // VENUE LIMIT
            // =========================
    
            if (type === "venue") {
    
                const venueExists =
                    booking.items.some(
                        (item) =>
                            item.type ===
                            "venue"
                    );
    
                if (venueExists) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "A venue is already added to this event"
                    });
                }
            }
    
    
            // =========================
            // AVAILABILITY
            // =========================
    
            const overlappingBookings =
                await Booking.find({
                    _id: {
                        $ne:
                        booking._id
                    },
    
                    bookingStatus: {
                        $ne: "Cancelled"
                    },
    
                    startDate: {
                        $lte:
                        booking.endDate
                    },
    
                    endDate: {
                        $gte:
                        booking.startDate
                    },
    
                    "items.type":
                    type,
    
                    "items.itemId":
                        Number(itemId)
                });
    
    
            if (
                overlappingBookings.length >
                0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${name} is already booked for the selected dates`
                });
            }
    
    
            // =========================
            // CALCULATED AMOUNT
            // =========================
    
            const normalizedPrice =
                Number(price || 0);
    
            const normalizedPriceUnit =
                priceUnit ===
                "full package"
                    ? "full package"
                    : "per day";
    
    
            const calculatedAmount =
                normalizedPriceUnit ===
                "full package"
                    ? normalizedPrice
                    : normalizedPrice *
                    calculateDays(
                        booking.startDate,
                        booking.endDate
                    );
    
    
            // =========================
            // ADD ITEM
            // =========================
    
            booking.items.push({
                type,
                itemId:
                    Number(itemId),
                name,
                category:
                    category || "",
                city:
                    city || "",
                state:
                    state || "",
                price:
                normalizedPrice,
                priceUnit:
                normalizedPriceUnit,
                calculatedAmount
            });
    
    
            // =========================
            // RECALCULATE TOTAL
            // =========================
    
            booking.totalAmount =
                calculateBookingTotal(
                    booking.items,
                    booking.startDate,
                    booking.endDate
                );
    
    
            await booking.save();
    
    
            res.json({
                success: true,
                message:
                    "Item added to event successfully 🎉",
                booking
            });
    
        } catch (error) {
    
            console.log(
                "Add Booking Item Error:",
                error.message
            );
    
            res.status(500).json({
                success: false,
                message:
                    "Failed to add item"
            });
        }
    };
    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    const cancelBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required."
                });
            }

            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: "Booking not found."
                });
            }

            if (booking.userId.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot cancel another user's booking."
                });
            }

            if (booking.bookingStatus === "Cancelled") {
                return res.status(400).json({
                    success: false,
                    message: "Booking is already cancelled."
                });
            }

            if (
                booking.bookingStatus === "Completed" ||
                booking.bookingStatus === "Confirmed"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "This booking cannot be cancelled."
                });
            }

            booking.bookingStatus = "Cancelled";
            await booking.save();

            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully.",
                booking
            });
        } catch (error) {
            console.error("Cancel booking error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to cancel booking."
            });
        }
    };
    
    module.exports = {
        createBooking,
        getUserBookings,
        getBookingById,
        addBookingItem,
        cancelBooking
    };