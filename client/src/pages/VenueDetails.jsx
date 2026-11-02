import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import "../styles/venueDetails.css";

function VenueDetails() {

    const { id } = useParams();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // FETCH VENUE
    // =========================

    useEffect(() => {

        const fetchVenue = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:5000/api/venues/${id}`
                );

                setVenue(response.data.venue);

            } catch (error) {

                console.log(
                    "Venue Details Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load venue details."
                );

            } finally {

                setLoading(false);

            }

        };

        void fetchVenue();

    }, [id]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="venue-details-page">

                    <div className="venue-details-status">

                        <div className="venue-loading-spinner"></div>

                        <p>
                            Loading venue details...
                        </p>

                    </div>

                </main>
            </>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (error || !venue) {

        return (
            <>
                <Navbar />

                <main className="venue-details-page">

                    <div className="venue-details-error">

                        <div className="venue-error-icon">
                            !
                        </div>

                        <h2>
                            {error || "Venue not found"}
                        </h2>

                        <p>
                            The venue you're looking for
                            could not be found.
                        </p>

                        <Link
                            to="/venues"
                            className="back-venues-btn"
                        >
                            ← Back to Venues
                        </Link>

                    </div>

                </main>
            </>
        );

    }


    // =========================
    // RENDER
    // =========================

    return (
        <>
            <Navbar />

            <main className="venue-details-page">

                <div className="venue-details-container">


                    {/* =========================
                        BACK LINK
                    ========================= */}

                    <Link
                        to="/venues"
                        className="venue-back-link"
                    >
                        ← Back to Venues
                    </Link>


                    {/* =========================
                        MAIN VENUE CARD
                    ========================= */}

                    <section className="venue-details-card">


                        {/* IMAGE */}

                        <div className="venue-details-image">

                            {venue.image ? (
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="venue-detail-img"
                                />
                            ) : (
                                <div className="venue-image-placeholder">
                                    🏛️
                                </div>
                            )}

                            <div className="venue-image-overlay"></div>

                            <span className="venue-image-label">
                                    Event Venue
                             </span>

                        </div>


                        {/* CONTENT */}

                        <div className="venue-details-content">

                            <span className="venue-details-badge">
                                {venue.category}
                            </span>


                            <h1>
                                {venue.name}
                            </h1>


                            <div className="venue-details-rating">

                                <span>
                                    ★
                                </span>

                                {venue.rating} / 5

                            </div>


                            <p className="venue-details-location">
                                📍 {venue.city}, {venue.state}
                            </p>


                            {/* VENUE INFO */}

                            <div className="venue-details-info">


                                <div className="venue-detail-box">

                                    <span className="venue-detail-icon">
                                        👥
                                    </span>

                                    <div>

                                        <small>
                                            Capacity
                                        </small>

                                        <strong>
                                            {venue.capacity} Guests
                                        </strong>

                                    </div>

                                </div>


                                <div className="venue-detail-box">

                                    <span className="venue-detail-icon">
                                        📅
                                    </span>

                                    <div>

                                        <small>
                                            Pricing
                                        </small>

                                        <strong>
                                            Per Day
                                        </strong>

                                    </div>

                                </div>


                                <div className="venue-detail-box">

                                    <span className="venue-detail-icon">
                                        ⭐
                                    </span>

                                    <div>

                                        <small>
                                            Rating
                                        </small>

                                        <strong>
                                            {venue.rating} / 5
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* PRICE */}

                            <div className="venue-details-price-section">

                                <div>

                                    <span>
                                        Venue Price
                                    </span>

                                    <h2>
                                        {venue.price}
                                    </h2>

                                    <small>
                                        {venue.priceUnit}
                                    </small>

                                </div>


                                <Link
                                    to={`/booking?venueId=${venue.id}`}
                                    className="venue-book-btn"
                                >
                                    Book This Venue
                                    <span>→</span>
                                </Link>

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        ABOUT + AMENITIES
                    ========================= */}

                    <section className="venue-details-info-section">


                        {/* ABOUT */}

                        <div className="venue-about">

                            <span className="venue-section-eyebrow">
                                VENUE OVERVIEW
                            </span>

                            <h2>
                                About This Venue
                            </h2>

                            <p>
                                {venue.description}
                            </p>

                            <p>
                                This venue is suitable for
                                different types of events and
                                provides a convenient space for
                                hosting your special occasion.
                            </p>

                        </div>


                        {/* AMENITIES */}

                        <div className="venue-amenities-section">

                            <span className="venue-section-eyebrow">
                                VENUE FEATURES
                            </span>

                            <h2>
                                Amenities
                            </h2>

                            <div className="venue-amenities-grid">

                                {venue.amenities?.map(
                                    (amenity, index) => (

                                        <div
                                            className="venue-amenity-item"
                                            key={index}
                                        >

                                            <span className="venue-check">
                                                ✓
                                            </span>

                                            <span>
                                                {amenity}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        EVENT TYPES
                    ========================= */}

                    <section className="venue-event-section">

                        <span className="venue-section-eyebrow">
                            PERFECT FOR
                        </span>

                        <h2>
                            Suitable Events
                        </h2>

                        <p>
                            This venue can be used for a variety
                            of events and celebrations.
                        </p>


                        <div className="venue-event-tags">

                            {venue.eventTypes?.map(
                                (eventType, index) => (

                                    <span
                                        className="venue-event-tag"
                                        key={index}
                                    >
                                        {eventType}
                                    </span>

                                )
                            )}

                        </div>

                    </section>


                    {/* =========================
                        WHY CHOOSE
                    ========================= */}

                    <section className="venue-why-section">

                        <div className="venue-why-heading">

                            <span className="venue-section-eyebrow">
                                EVENT HUB
                            </span>

                            <h2>
                                Why Choose This Venue?
                            </h2>

                            <p>
                                A comfortable and convenient
                                location for your special event.
                            </p>

                        </div>


                        <div className="venue-benefits">


                            <div className="venue-benefit">

                                <span className="venue-benefit-icon">
                                    👥
                                </span>

                                <div>

                                    <h3>
                                        Spacious Capacity
                                    </h3>

                                    <p>
                                        Suitable for events with
                                        up to {venue.capacity} guests.
                                    </p>

                                </div>

                            </div>


                            <div className="venue-benefit">

                                <span className="venue-benefit-icon">
                                    📍
                                </span>

                                <div>

                                    <h3>
                                        Convenient Location
                                    </h3>

                                    <p>
                                        Located in {venue.city},
                                        {` ${venue.state}`}.
                                    </p>

                                </div>

                            </div>


                            <div className="venue-benefit">

                                <span className="venue-benefit-icon">
                                    ★
                                </span>

                                <div>

                                    <h3>
                                        Highly Rated
                                    </h3>

                                    <p>
                                        Rated {venue.rating} out of 5
                                        by Event Hub.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>






                </div>

            </main>
        </>
    );
}

export default VenueDetails;