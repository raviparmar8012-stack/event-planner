
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/bookingSummary.css";

function BookingSummary() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchBooking = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/bookings/${id}`
                );

                if (!response.data?.success || !response.data?.booking) {
                    throw new Error("Booking details not found.");
                }

                if (!cancelled) {
                    setBooking(response.data.booking);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to load booking details."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchBooking();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatMoney = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    if (loading) {
        return (
            <div className="booking-summary-state">
                <div className="summary-spinner" />
                <h2>Preparing your event summary...</h2>
                <p>Please wait while we load your booking.</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="booking-summary-state">
                <div className="summary-state-icon">!</div>
                <h2>Booking details unavailable</h2>
                <p>{error || "We couldn't find this booking."}</p>
                <button
                    className="summary-primary-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const items = booking.items || [];

    return (
        <main className="booking-summary-page">
            <div className="summary-container">
                <div className="summary-success-banner">
                    <div className="summary-success-icon">✓</div>

                    <div>
                        <span className="summary-eyebrow">
                            BOOKING RECEIVED
                        </span>
                        <h1>Your event journey starts here!</h1>
                        <p>
                            Your booking has been saved successfully.
                            Keep your booking ID for reference.
                        </p>
                    </div>
                </div>

                <div className="summary-layout">
                    <section className="summary-main">
                        <div className="summary-card">
                            <div className="summary-card-heading">
                                <div>
                                    <span className="summary-eyebrow">
                                        BOOKING REFERENCE
                                    </span>
                                    <h2>Booking details</h2>
                                </div>

                                <span className={`summary-status status-${String(
                                    booking.bookingStatus || "Pending"
                                ).toLowerCase()}`}>
                                    {booking.bookingStatus || "Pending"}
                                </span>
                            </div>

                            <div className="summary-reference">
                                <span>{booking._id}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (navigator.clipboard) {
                                            void navigator.clipboard.writeText(
                                                booking._id
                                            );
                                        }
                                    }}
                                >
                                    Copy ID
                                </button>
                            </div>

                            <div className="summary-details-grid">
                                <div className="summary-detail">
                                    <span>Event type</span>
                                    <strong>
                                        {booking.eventType || "—"}
                                    </strong>
                                </div>

                                <div className="summary-detail">
                                    <span>Guests</span>
                                    <strong>
                                        {booking.guests ?? "—"} guests
                                    </strong>
                                </div>

                                <div className="summary-detail">
                                    <span>Start date</span>
                                    <strong>
                                        {formatDate(booking.startDate)}
                                    </strong>
                                </div>

                                <div className="summary-detail">
                                    <span>End date</span>
                                    <strong>
                                        {formatDate(booking.endDate)}
                                    </strong>
                                </div>

                                <div className="summary-detail summary-full-width">
                                    <span>Event location</span>
                                    <strong>
                                        {booking.eventLocation || "—"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-card-heading">
                                <div>
                                    <span className="summary-eyebrow">
                                        YOUR SELECTION
                                    </span>
                                    <h2>Booked services</h2>
                                </div>

                                <span className="summary-count">
                                    {items.length} item{items.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {items.length > 0 ? (
                                <div className="summary-items">
                                    {items.map((item, index) => (
                                        <div
                                            className="summary-item"
                                            key={`${item.type}-${item.itemId}-${index}`}
                                        >
                                            <div className="summary-item-icon">
                                                {item.type === "vendor"
                                                    ? "✦"
                                                    : item.type === "venue"
                                                        ? "⌂"
                                                        : "◇"}
                                            </div>

                                            <div className="summary-item-info">
                                                <span className="summary-item-type">
                                                    {item.type}
                                                </span>
                                                <h3>{item.name}</h3>
                                                <p>
                                                    {[item.city, item.state]
                                                        .filter(Boolean)
                                                        .join(", ") || "Location not specified"}
                                                </p>
                                            </div>

                                            <div className="summary-item-price">
                                                <strong>
                                                    {formatMoney(item.calculatedAmount)}
                                                </strong>
                                                <span>
                                                    {item.priceUnit === "per day"
                                                        ? "For event duration"
                                                        : "Package total"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No services were found in this booking.</p>
                            )}

                            {booking.message && (
                                <div className="summary-message">
                                    <span>Additional requirements</span>
                                    <p>{booking.message}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="summary-sidebar">
                        <div className="summary-card summary-total-card">
                            <span className="summary-eyebrow">
                                COST OVERVIEW
                            </span>
                            <h2>Booking total</h2>

                            <div className="summary-total-amount">
                                {formatMoney(booking.totalAmount)}
                            </div>

                            <p className="summary-total-note">
                                Total for the services currently included
                                in this booking.
                            </p>

                            <div className="summary-divider" />

                            <div className="summary-total-row">
                                <span>Services</span>
                                <strong>{items.length}</strong>
                            </div>

                            <div className="summary-total-row">
                                <span>Payment status</span>
                                <strong className="summary-payment-status">
                                    {booking.paymentStatus || "Pending"}
                                </strong>
                            </div>

                            <div className="summary-divider" />

                            <p className="summary-payment-note">
                                No online payment is processed on this page.
                            </p>
                        </div>

                        <div className="summary-next-card">
                            <span className="summary-eyebrow">
                                WHAT'S NEXT?
                            </span>
                            <h3>Make your event complete</h3>
                            <p>
                                You can explore more services for your event.
                                We’ll connect them to this booking in the next
                                step of the booking flow.
                            </p>

                            <button
                                className="summary-primary-btn"
                                onClick={() => navigate("/")}
                            >
                                Explore Event Hub
                            </button>

                            <button
                                className="summary-secondary-btn"
                                onClick={() => navigate("/my-bookings")}
                            >
                                View My Bookings
                            </button>
                        </div>
                    </aside>
                </div>

                <button
                    className="summary-back-link"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>
        </main>
    );
}

export default BookingSummary;
