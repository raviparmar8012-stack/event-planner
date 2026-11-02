import {
    useSearchParams,
    useNavigate,
    useLocation
} from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";

import vendorImages from "../assets/Data/vendorImages";
import packageImages from "../assets/Data/packageImages";
import "../styles/booking.css";


function Booking() {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const location = useLocation();


    // =====================================================
    // USER
    // =====================================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // =====================================================
    // URL PARAMETERS
    // =====================================================

    const vendorId =
        searchParams.get("vendorId");

    const packageId =
        searchParams.get("packageId");

    const venueId =
        searchParams.get("venueId");


    // =====================================================
    // ITEM STATES
    // =====================================================

    const [vendor, setVendor] =
        useState(null);

    const [pkg, setPkg] =
        useState(null);

    const [venue, setVenue] =
        useState(null);


    // =====================================================
    // LOADING
    // =====================================================

    const [bookingLoading, setBookingLoading] = useState(
        Boolean(vendorId || packageId || venueId)
    );


    // =====================================================
    // SUBMITTING
    // =====================================================

    const [submitting, setSubmitting] =
        useState(false);


    // =====================================================
    // MESSAGES
    // =====================================================

    const [errorMessage, setErrorMessage] =
        useState("");


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] =
        useState({

            name:
                user?.name || "",

            email:
                user?.email || "",

            countryCode:
                "+91",

            phone:
                "",

            eventType:
                "",

            startDate:
                "",

            endDate:
                "",

            guests:
                "",

            eventLocation:
                "",

            message:
                ""

        });


    // =====================================================
    // VALIDATION
    // =====================================================

    const [errors, setErrors] =
        useState({});


    // =====================================================
    // COUNTRIES
    // =====================================================

    const countries = [

        {
            code: "+91",
            country: "India",
            min: 10,
            max: 10
        },

        {
            code: "+1",
            country: "USA / Canada",
            min: 10,
            max: 10
        },

        {
            code: "+44",
            country: "UK",
            min: 10,
            max: 10
        },

        {
            code: "+971",
            country: "UAE",
            min: 9,
            max: 9
        },

        {
            code: "+61",
            country: "Australia",
            min: 9,
            max: 9
        },

        {
            code: "+65",
            country: "Singapore",
            min: 8,
            max: 8
        }

    ];


    // =====================================================
    // EVENT TYPES
    // =====================================================

    const eventTypes = [

        "Wedding",

        "Reception",

        "Engagement",

        "Birthday",

        "Corporate Event",

        "Anniversary",

        "Baby Shower",

        "Pre-Wedding",

        "Festival",

        "Conference",

        "Party",

        "College Event"

    ];


    // =====================================================
    // LOGIN CHECK
    // =====================================================

    useEffect(() => {

        if (!user) {

            navigate(
                "/login",
                {
                    state: {
                        from:
                            location.pathname +
                            location.search
                    },

                    replace: true
                }
            );

        }

    }, [
        user,
        navigate,
        location
    ]);


    // =====================================================
    // FETCH SELECTED ITEM
    // =====================================================
    useEffect(() => {
        let cancelled = false;

        const fetchItem = async () => {
            try {
                if (vendorId) {
                    const response = await axios.get(
                        `http://localhost:5000/api/vendors/${vendorId}`
                    );

                    if (!cancelled) {
                        setVendor(response.data.vendor || response.data);
                    }
                } else if (packageId) {
                    const response = await axios.get(
                        `http://localhost:5000/api/packages/${packageId}`
                    );

                    if (!cancelled) {
                        setPkg(response.data.package || response.data);
                    }
                } else if (venueId) {
                    const response = await axios.get(
                        `http://localhost:5000/api/venues/${venueId}`
                    );

                    if (!cancelled) {
                        setVenue(response.data.venue || response.data);
                    }
                }
            } catch (error) {
                console.log("Booking Item Error:", error);

                if (!cancelled) {
                    setErrorMessage("Unable to load booking item.");
                }
            } finally {
                if (!cancelled) {
                    setBookingLoading(false);
                }
            }
        };

        if (vendorId || packageId || venueId) {
            void fetchItem();
        }

        return () => {
            cancelled = true;
        };
    }, [vendorId, packageId, venueId]);


    // =====================================================
    // SELECTED ITEM
    // =====================================================

    const selectedItem =
        vendor ||
        pkg ||
        venue;


    // =====================================================
    // ITEM TYPE
    // =====================================================

    const itemType =
        vendorId
            ? "vendor"
            : packageId
                ? "package"
                : venueId
                    ? "venue"
                    : "";


    // =====================================================
    // ITEM NAME
    // =====================================================

    const itemName =
        vendor?.name ||
        pkg?.title ||
        venue?.name ||
        "";


    // =====================================================
    // ITEM CATEGORY
    // =====================================================

    const itemCategory =
        vendor?.category ||
        pkg?.category ||
        venue?.category ||
        "";


    // =====================================================
    // ITEM CITY
    // =====================================================

    const itemCity =
        selectedItem?.city ||
        "";


    // =====================================================
    // ITEM STATE
    // =====================================================

    const itemState =
        selectedItem?.state ||
        "";


    // =====================================================
    // ITEM PRICE
    // =====================================================

    const getNumericPrice = () => {

        if (!selectedItem?.price) {

            return 0;

        }

        return Number(
            String(
                selectedItem.price
            ).replace(
                /[^0-9.]/g,
                ""
            )
        ) || 0;

    };


    const itemPrice =
        getNumericPrice();


    // =====================================================
    // PRICE UNIT
    // =====================================================

    const priceUnit =
        itemType === "package"
            ? "full package"
            : "per day";


    // =====================================================
    // CAPACITY
    // =====================================================

    const itemCapacity =
        Number(
            selectedItem?.capacity ||
            selectedItem?.guests ||
            0
        );


    // =====================================================
    // NUMBER OF DAYS
    // =====================================================

    const calculateDays = () => {

        if (
            !formData.startDate ||
            !formData.endDate
        ) {

            return 0;

        }

        const start =
            new Date(
                `${formData.startDate}T00:00:00`
            );

        const end =
            new Date(
                `${formData.endDate}T00:00:00`
            );

        const difference =
            Math.round(
                (
                    end - start
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) + 1;

        return Math.max(
            0,
            difference
        );

    };


    const numberOfDays =
        calculateDays();


    // =====================================================
    // LIVE PRICE
    // =====================================================

    const calculateLiveTotal = () => {

        if (!itemPrice) {

            return 0;

        }

        if (
            priceUnit ===
            "full package"
        ) {

            return itemPrice;

        }

        if (!numberOfDays) {

            return 0;

        }

        return (
            itemPrice *
            numberOfDays
        );

    };


    const liveTotal =
        calculateLiveTotal();


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatPrice = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(amount);

    };


    // =====================================================
    // IMAGE
    // =====================================================

    const getPackageImage = () => {

        if (!pkg) {

            return "";

        }

        const images =
            packageImages?.[
                pkg.category
                ];

        if (
            !images ||
            images.length === 0
        ) {

            return "";

        }

        return images[
        Number(pkg.id) %
        images.length
            ];

    };


    const getVendorImage = () => {

        if (!vendor) {

            return "";

        }

        const images =
            vendorImages?.[
                vendor.category
                ];

        if (
            !images ||
            images.length === 0
        ) {

            return "";

        }

        return images[
        Number(vendor.id) %
        images.length
            ];

    };


    const getVenueImage = () => {

        if (!venueId) {

            return "";

        }

        return `http://localhost:5000/api/venues/${venueId}/image`;

    };


    // =====================================================
    // ITEM IMAGE
    // =====================================================

    const itemImage =
        itemType === "vendor"
            ? getVendorImage()
            : itemType === "package"
                ? getPackageImage()
                : getVenueImage();


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );


        if (errors[name]) {

            setErrors(
                (previous) => ({
                    ...previous,
                    [name]: ""
                })
            );

        }


        if (errorMessage) {

            setErrorMessage("");

        }

    };


    // =====================================================
    // PHONE CHANGE
    // =====================================================

    const handlePhoneChange = (e) => {

        const value =
            e.target.value.replace(
                /\D/g,
                ""
            );


        setFormData({
            ...formData,
            phone: value
        });


        if (errors.phone) {

            setErrors(
                (previous) => ({
                    ...previous,
                    phone: ""
                })
            );

        }

    };


    // =====================================================
    // TODAY
    // =====================================================

    const getToday = () => {

        const date =
            new Date();

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${year}-${month}-${day}`;

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        const newErrors = {};


        // -----------------------------------------
        // NAME
        // -----------------------------------------

        const name =
            formData.name.trim();

        if (!name) {

            newErrors.name =
                "Name is required";

        }

        else if (
            name.length < 2
        ) {

            newErrors.name =
                "Name must contain at least 2 characters";

        }

        else if (
            name.length > 50
        ) {

            newErrors.name =
                "Name cannot exceed 50 characters";

        }

        else if (
            !/^[A-Za-z ]+$/.test(name)
        ) {

            newErrors.name =
                "Name can contain only letters and spaces";

        }


        // -----------------------------------------
        // EMAIL
        // -----------------------------------------

        const email =
            formData.email
                .trim()
                .toLowerCase();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {

            newErrors.email =
                "Email is required";

        }

        else if (
            !emailRegex.test(email)
        ) {

            newErrors.email =
                "Enter a valid email address";

        }

        else if (
            user?.email &&
            email !==
            user.email
                .trim()
                .toLowerCase()
        ) {

            newErrors.email =
                "Email must match your logged-in account";

        }


        // -----------------------------------------
        // PHONE
        // -----------------------------------------

        const selectedCountry =
            countries.find(
                (country) =>
                    country.code ===
                    formData.countryCode
            ) ||
            countries[0];


        const phone =
            formData.phone.trim();


        if (!phone) {

            newErrors.phone =
                "Phone number is required";

        }

        else if (
            phone.length <
            selectedCountry.min ||
            phone.length >
            selectedCountry.max
        ) {

            newErrors.phone =
                `${selectedCountry.country} phone number must contain ${selectedCountry.min} digits`;

        }


        // India-specific
        if (
            formData.countryCode ===
            "+91" &&
            phone &&
            !/^[6-9]\d{9}$/.test(phone)
        ) {

            newErrors.phone =
                "Indian mobile number must be 10 digits and start with 6-9";

        }


        // -----------------------------------------
        // EVENT TYPE
        // -----------------------------------------

        if (
            !formData.eventType.trim()
        ) {

            newErrors.eventType =
                "Event type is required";

        }


        // -----------------------------------------
        // START DATE
        // -----------------------------------------

        if (
            !formData.startDate
        ) {

            newErrors.startDate =
                "Start date is required";

        }

        else if (
            formData.startDate <
            getToday()
        ) {

            newErrors.startDate =
                "Start date cannot be in the past";

        }


        // -----------------------------------------
        // END DATE
        // -----------------------------------------

        if (
            !formData.endDate
        ) {

            newErrors.endDate =
                "End date is required";

        }

        else if (
            formData.startDate &&
            formData.endDate <
            formData.startDate
        ) {

            newErrors.endDate =
                "End date cannot be before start date";

        }


        // -----------------------------------------
        // GUESTS
        // -----------------------------------------

        if (
            formData.guests === ""
        ) {

            newErrors.guests =
                "Number of guests is required";

        }

        else if (
            !/^\d+$/.test(
                String(
                    formData.guests
                )
            )
        ) {

            newErrors.guests =
                "Guests must be a whole number";

        }

        else if (
            Number(
                formData.guests
            ) < 1
        ) {

            newErrors.guests =
                "At least 1 guest is required";

        }

        else if (
            itemCapacity > 0 &&
            Number(formData.guests) >
            itemCapacity
        ) {

            newErrors.guests =
                `This item supports maximum ${itemCapacity} guests`;

        }


        // -----------------------------------------
        // EVENT LOCATION
        // -----------------------------------------

        const eventLocation =
            formData.eventLocation.trim();

        if (!eventLocation) {

            newErrors.eventLocation =
                "Event location is required";

        }

        else if (
            eventLocation.length < 10
        ) {

            newErrors.eventLocation =
                "Please enter a more complete event address";

        }

        else if (
            eventLocation.length > 300
        ) {
            newErrors.eventLocation =
                "Event location cannot exceed 300 characters";
        }


        // -----------------------------------------
        // MESSAGE
        // -----------------------------------------

        if (
            formData.message.length >
            500
        ) {

            newErrors.message =
                "Message cannot exceed 500 characters";

        }


        setErrors(
            newErrors
        );


        return (
            Object.keys(
                newErrors
            ).length === 0
        );

    };


    // =====================================================
    // CREATE BOOKING
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (submitting) {

            return;

        }


        setErrorMessage("");


        const isValid =
            validateForm();


        if (!isValid) {

            return;

        }


        if (!selectedItem) {

            setErrorMessage(
                "Booking item not found."
            );

            return;

        }


        try {

            setSubmitting(true);


            const currentUser =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );


            if (!currentUser?.id) {

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;

            }


            // =========================================
            // CREATE ITEM SNAPSHOT
            // =========================================

            const bookingItem = {

                type:
                itemType,

                itemId:
                    Number(
                        selectedItem.id
                    ),

                name:
                itemName,

                category:
                itemCategory,

                city:
                itemCity,

                state:
                itemState,

                price:
                itemPrice,

                priceUnit:
                priceUnit

            };


            // =========================================
            // CREATE EVENT
            // =========================================

            const response =
                await axios.post(
                    "http://localhost:5000/api/bookings",
                    {

                        userId:
                        currentUser.id,

                        name:
                            formData.name.trim(),

                        email:
                            formData.email
                                .trim()
                                .toLowerCase(),

                        phone:
                            formData.phone.trim(),

                        countryCode:
                        formData.countryCode,

                        eventType:
                        formData.eventType,

                        startDate:
                        formData.startDate,

                        endDate:
                        formData.endDate,

                        guests:
                            Number(
                                formData.guests
                            ),

                        eventLocation:
                            formData.eventLocation
                                .trim(),

                        message:
                            formData.message
                                .trim(),

                        items: [
                            bookingItem
                        ]

                    }
                );


            if (!response.data?.success || !response.data?.booking) {
                setErrorMessage("Booking was not created. Please try again.");
                return;
            }



            const booking =
                response.data.booking;


            // =========================================
            // GO TO SUMMARY
            // =========================================

            navigate(
                `/booking-summary/${booking._id}`,
                {
                    state: {
                        newlyCreated: true
                    }
                }
            );

        }

        catch (error) {

            console.log(
                "Create Booking Error:",
                error
            );


            setErrorMessage(
                error.response?.data?.message ||
                "Something went wrong while creating your booking."
            );

        }

        finally {

            setSubmitting(false);

        }

    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (bookingLoading) {

        return (

            <div className="booking-loading">

                <p>
                    Loading booking details...
                </p>

            </div>

        );

    }


    // =====================================================
    // INVALID ITEM
    // =====================================================

    if (
        !selectedItem
    ) {

        return (

            <div className="booking-loading">

                <p>
                    {errorMessage ||
                        "Booking item not found."}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Go Back
                </button>

            </div>

        );

    }


    // =====================================================
    // PAGE TITLE
    // =====================================================

    const pageTitle =
        itemType === "vendor"
            ? "Book This Vendor"
            : itemType === "package"
                ? "Book This Package"
                : "Book This Venue";


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="booking-page">

            <div className="booking-container">


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="booking-header">

                    <h1>
                        {pageTitle}
                    </h1>

                    <p>
                        Plan your event with
                        complete details and
                        confirm your booking.
                    </p>

                </div>


                {/* =========================================
                    MAIN
                ========================================= */}

                <div className="booking-main">


                    {/* =====================================
                        LEFT ITEM CARD
                    ===================================== */}

                    <div className="booking-vendor-card">


                        {/* IMAGE */}

                        <div className="booking-vendor-image">

                            {itemImage && (

                                <img
                                    src={itemImage}
                                    alt={itemName}
                                />

                            )}

                        </div>


                        {/* CONTENT */}

                        <div className="booking-vendor-content">


                            <span className="booking-vendor-category">

                                {itemCategory}

                            </span>


                            <h2>

                                {itemName}

                            </h2>


                            <p className="booking-vendor-location">

                                📍 {itemCity}

                                {itemState &&
                                    `, ${itemState}`}

                            </p>


                            {selectedItem.rating && (

                                <p className="booking-vendor-rating">

                                    ⭐ {
                                    selectedItem.rating
                                }

                                </p>

                            )}


                            <p className="booking-vendor-price">

                                {formatPrice(
                                    itemPrice
                                )}

                                {" "}

                                <span>

                                    {priceUnit ===
                                    "per day"
                                        ? "/ day"
                                        : "full package"}

                                </span>

                            </p>


                            {/* HIGHLIGHTS */}

                            <div className="booking-vendor-highlights">

                                <p>
                                    ✓ Professional
                                    Services
                                </p>

                                <p>
                                    ✓ Customized
                                    Event Requirements
                                </p>

                                {itemCapacity > 0 && (

                                    <p>
                                        ✓ Capacity:
                                        {" "}
                                        {itemCapacity}
                                        {" "}
                                        Guests
                                    </p>

                                )}

                                {itemType ===
                                    "vendor" && (

                                        <p>
                                            ✓ Per-day
                                            pricing
                                        </p>

                                    )}

                                {itemType ===
                                    "venue" && (

                                        <p>
                                            ✓ Venue
                                            available
                                            per day
                                        </p>

                                    )}

                                {itemType ===
                                    "package" && (

                                        <p>
                                            ✓ Complete
                                            event package
                                        </p>

                                    )}

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        RIGHT FORM
                    ===================================== */}

                    <div className="booking-form-card">


                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* =================================
                                PERSONAL DETAILS
                            ================================= */}

                            <div className="booking-section">

                                <h3>
                                    Your Details
                                </h3>


                                {/* NAME */}

                                <div className="booking-field">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your full name"
                                        maxLength="50"
                                    />

                                    {errors.name && (

                                        <p className="field-error">
                                            {
                                                errors.name
                                            }
                                        </p>

                                    )}

                                </div>


                                {/* EMAIL */}

                                <div className="booking-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your email"
                                    />

                                    {errors.email && (

                                        <p className="field-error">
                                            {
                                                errors.email
                                            }
                                        </p>

                                    )}

                                </div>


                                {/* PHONE */}

                                <div className="booking-field">

                                    <label>
                                        Phone Number
                                    </label>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "8px"
                                        }}
                                    >

                                        <select
                                            name="countryCode"
                                            value={
                                                formData.countryCode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={{
                                                width:
                                                    "145px"
                                            }}
                                        >

                                            {countries.map(
                                                (
                                                    country
                                                ) => (

                                                    <option
                                                        key={
                                                            country.code
                                                        }
                                                        value={
                                                            country.code
                                                        }
                                                    >
                                                        {
                                                            country.code
                                                        }
                                                        {" "}
                                                        {
                                                            country.country
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handlePhoneChange
                                            }
                                            placeholder="Enter phone number"
                                            inputMode="numeric"
                                        />

                                    </div>


                                    {errors.phone && (

                                        <p className="field-error">
                                            {
                                                errors.phone
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>


                            {/* =================================
                                EVENT DETAILS
                            ================================= */}

                            <div className="booking-section">

                                <h3>
                                    Event Details
                                </h3>


                                {/* EVENT TYPE */}

                                <div className="booking-field">

                                    <label>
                                        Event Type
                                    </label>

                                    <select
                                        name="eventType"
                                        value={
                                            formData.eventType
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select event type
                                        </option>

                                        {eventTypes.map(
                                            (
                                                type
                                            ) => (

                                                <option
                                                    key={
                                                        type
                                                    }
                                                    value={
                                                        type
                                                    }
                                                >
                                                    {
                                                        type
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>


                                    {errors.eventType && (

                                        <p className="field-error">
                                            {
                                                errors.eventType
                                            }
                                        </p>

                                    )}

                                </div>


                                {/* DATES */}

                                <div
                                    className="booking-row"
                                >


                                    <div className="booking-field">

                                        <label>
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            name="startDate"
                                            min={
                                                getToday()
                                            }
                                            value={
                                                formData.startDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        {errors.startDate && (

                                            <p className="field-error">
                                                {
                                                    errors.startDate
                                                }
                                            </p>

                                        )}

                                    </div>


                                    <div className="booking-field">

                                        <label>
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            name="endDate"
                                            min={
                                                formData.startDate ||
                                                getToday()
                                            }
                                            value={
                                                formData.endDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        {errors.endDate && (

                                            <p className="field-error">
                                                {
                                                    errors.endDate
                                                }
                                            </p>

                                        )}

                                    </div>


                                </div>


                                {/* DAYS */}

                                {numberOfDays > 0 && (

                                    <div
                                        style={{
                                            marginBottom:
                                                "18px",
                                            padding:
                                                "12px 15px",
                                            background:
                                                "#f8f5f0",
                                            borderRadius:
                                                "8px"
                                        }}
                                    >

                                        <strong>
                                            Event Duration:
                                        </strong>

                                        {" "}

                                        {numberOfDays}

                                        {" "}

                                        {numberOfDays ===
                                        1
                                            ? "Day"
                                            : "Days"}

                                    </div>

                                )}


                                {/* GUESTS */}

                                <div className="booking-field">

                                    <label>
                                        Number of Guests
                                    </label>

                                    <input
                                        type="number"
                                        name="guests"
                                        min="1"
                                        value={
                                            formData.guests
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter number of guests"
                                    />

                                    {itemCapacity > 0 && (

                                        <small>
                                            Maximum
                                            capacity:
                                            {" "}
                                            {itemCapacity}
                                            {" "}
                                            guests
                                        </small>

                                    )}

                                    {errors.guests && (

                                        <p className="field-error">
                                            {
                                                errors.guests
                                            }
                                        </p>

                                    )}

                                </div>



                                {/* EVENT LOCATION */}

                                {itemType !== "venue" && (
                                    <div className="booking-field">
                                        <label>Event Location</label>

                                        <textarea
                                            name="eventLocation"
                                            value={formData.eventLocation}
                                            onChange={handleChange}
                                            placeholder="Enter complete event address..."
                                            rows="3"
                                            maxLength="300"
                                        />

                                        <small>
                                            {formData.eventLocation.length}/300
                                        </small>

                                        {errors.eventLocation && (
                                            <p className="field-error">
                                                {errors.eventLocation}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {itemType === "venue" && (
                                    <div className="booking-venue-location">
                                        <strong>Event Location</strong>
                                        <p>
                                            {selectedItem.address ||
                                                [selectedItem.city, selectedItem.state]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                "Selected venue location"}
                                        </p>
                                        <small>
                                            Your selected venue will be used as the event location.
                                        </small>
                                    </div>
                                )}



                                {/* MESSAGE */}

                                <div className="booking-field">

                                    <label>
                                        Additional Message
                                        <span>
                                            {" "}
                                            (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        name="message"
                                        value={
                                            formData.message
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Any special requirements..."
                                        rows="4"
                                        maxLength="500"
                                    />

                                    <small>
                                        {
                                            formData
                                                .message
                                                .length
                                        }
                                        /500
                                    </small>

                                    {errors.message && (

                                        <p className="field-error">
                                            {
                                                errors.message
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>


                            {/* =================================
                                PRICE SUMMARY
                            ================================= */}

                            <div
                                className="booking-price-summary"
                            >

                                <div>

                                    <span>
                                        {itemName}
                                    </span>

                                    <span>

                                        {priceUnit ===
                                        "per day"
                                            ? `${formatPrice(itemPrice)} × ${numberOfDays || 0} day(s)`
                                            : "Full package"}

                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Estimated Total
                                    </strong>

                                    <strong>
                                        {
                                            formatPrice(
                                                liveTotal
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* =================================
                                ERROR
                            ================================= */}

                            {errorMessage && (

                                <div
                                    className="booking-error"
                                >
                                    {errorMessage}
                                </div>

                            )}


                            {/* =================================
                                SUBMIT
                            ================================= */}

                            <button
                                type="submit"
                                className="booking-submit-btn"
                                disabled={
                                    submitting
                                }
                            >

                                {submitting
                                    ? "Creating Event..."
                                    : "Confirm Booking 🎉"}

                            </button>


                            <p
                                style={{
                                    marginTop:
                                        "12px",
                                    textAlign:
                                        "center",
                                    fontSize:
                                        "13px",
                                    color:
                                        "#777"
                                }}
                            >
                                Your final amount will
                                be calculated and saved
                                securely with your event.
                            </p>


                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Booking;