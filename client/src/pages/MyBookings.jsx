import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar.jsx";
import vendorImages from "../assets/Data/vendorImages";
import packageImages from "../assets/Data/packageImages";

import "../styles/myBookings.css";

const API = "http://localhost:5000/api";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState("");

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    })();

    const fetchBookings = async () => {
        if (!user?.id) {
            setError("Please log in to view your bookings.");
            setLoading(false);
            return;
        }

        try {
            const [bookingResponse, vendorResponse, packageResponse] =
                await Promise.all([
                    axios.get(`${API}/bookings/user/${user.id}`),
                    axios.get(`${API}/vendors`),
                    axios.get(`${API}/packages`)
                ]);

            setBookings(bookingResponse.data.bookings || []);
            setVendors(vendorResponse.data.vendors || []);
            setPackages(packageResponse.data.packages || []);
            setError("");
        } catch (err) {
            console.error("My Bookings Error:", err);
            setError("We couldn't load your bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user?.id]);

    const getVendor = (id) =>
        vendors.find((vendor) => Number(vendor.id) === Number(id));

    const getPackage = (id) =>
        packages.find((pkg) => Number(pkg.id) === Number(id));

    const getPackageImage = (pkg) => {
        if (!pkg) return "";

        const images = packageImages[pkg.category];
        if (!images?.length) return "";

        const imageIndexMap = {
            Wedding: pkg.id - 1,
            Birthday: pkg.id - 5,
            Corporate: pkg.id - 8,
            Engagement: pkg.id - 11,
            "College & Farewell": pkg.id - 14,
            "Garba & Navratri": pkg.id - 17
        };

        return images[imageIndexMap[pkg.category]] || images[0];
    };

    const getVendorImage = (vendor) => {
        if (!vendor) return "";

        const images = vendorImages[vendor.category];
        if (!images?.length) return "";

        return images[vendor.id % images.length];
    };

    const getItemDetails = (booking) => {
        const item = booking.items?.[0];

        if (!item) {
            return {
                title: "Event Booking",
                category: booking.eventType || "Event Service",
                image: "",
                type: "Booking"
            };
        }

        if (item.type === "package") {
            const pkg = getPackage(item.itemId);

            return {
                title: item.name || pkg?.title || `Package #${item.itemId}`,
                category: item.category || pkg?.category || "Package",
                image: getPackageImage(pkg),
                type: "Package"
            };
        }

        if (item.type === "vendor") {
            const vendor = getVendor(item.itemId);

            return {
                title: item.name || vendor?.name || `Vendor #${item.itemId}`,
                category: item.category || vendor?.category || "Vendor",
                image: getVendorImage(vendor),
                type: "Vendor"
            };
        }

        return {
            title: item.name || "Event Venue",
            category: item.category || "Venue",
            image: "",
            type: item.type === "venue" ? "Venue" : "Service"
        };
    };

    const getDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 1;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return 1;
        }

        return Math.max(
            1,
            Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
        );
    };

    const formatAmount = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    const formatDate = (date) => {
        if (!date) return "Not specified";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return date;

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const handleCancelBooking = async (booking) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        setActionLoading(`${booking._id}-cancel`);

        try {
            const response = await axios.put(
                `${API}/bookings/${booking._id}/cancel`,
                { userId: user.id }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Failed to cancel the booking."
                );
            }

            await fetchBookings();
            window.alert("Your booking has been cancelled successfully.");
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                err.message ||
                "Unable to cancel the booking. Please try again."
            );
        } finally {
            setActionLoading("");
        }
    };

    const handleRefundRequest = async (booking) => {
        const reason = window.prompt(
            "Please enter the reason for your refund request:"
        );

        if (reason === null) return;

        if (!reason.trim()) {
            window.alert("Please enter a reason for the refund request.");
            return;
        }

        setActionLoading(`${booking._id}-refund`);

        try {
            const response = await axios.post(`${API}/admin/refunds`, {
                bookingId: booking._id,
                reason: reason.trim()
            });

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to submit the refund request."
                );
            }

            window.alert("Your refund request has been submitted successfully.");
            await fetchBookings();
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                err.message ||
                "Unable to submit the refund request. Please try again."
            );
        } finally {
            setActionLoading("");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="my-bookings-page">
                    <div className="my-bookings-status">
                        <div className="loading-spinner">✦</div>
                        <h2>Loading Your Bookings</h2>
                        <p>Your event details are on their way.</p>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="my-bookings-page">
                    <div className="my-bookings-status">
                        <div className="status-icon">!</div>
                        <h2>Something Went Wrong</h2>
                        <p>{error}</p>
                        <button
                            className="booking-action-btn retry-btn"
                            onClick={() => {
                                setLoading(true);
                                fetchBookings();
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </>
        );
    }

    const activeBookings = bookings.filter(
        (booking) =>
            !["Cancelled", "Completed"].includes(booking.bookingStatus)
    ).length;

    const completedPayments = bookings.filter(
        (booking) => booking.paymentStatus === "Completed"
    ).length;

    return (
        <>
            <Navbar />

            <main className="my-bookings-page">
                <div className="my-bookings-container">

                    <section className="my-bookings-header">
                        <div className="premium-eyebrow">
                            <span className="eyebrow-line"></span>
                            YOUR EVENT DASHBOARD
                            <span className="eyebrow-line"></span>
                        </div>

                        <h1>
                            Every Event,
                            <span> One Place.</span>
                        </h1>

                        <p>
                            Keep track of your celebrations, bookings and
                            event details — all in one place.
                        </p>
                    </section>

                    <section className="booking-summary">
                        <div className="summary-box">
                            <div className="summary-icon">▤</div>
                            <div>
                                <small>Total Bookings</small>
                                <strong>{bookings.length}</strong>
                                <span className="summary-caption">
                                    All your reservations
                                </span>
                            </div>
                        </div>

                        <div className="summary-box">
                            <div className="summary-icon">✦</div>
                            <div>
                                <small>Active Bookings</small>
                                <strong>{activeBookings}</strong>
                                <span className="summary-caption">
                                    Currently in progress
                                </span>
                            </div>
                        </div>

                        <div className="summary-box">
                            <div className="summary-icon">₹</div>
                            <div>
                                <small>Completed Payments</small>
                                <strong>{completedPayments}</strong>
                                <span className="summary-caption">
                                    Successfully paid
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="bookings-section">
                        <div className="bookings-section-heading">
                            <div>
                                <span className="section-kicker">YOUR RESERVATIONS</span>
                                <h2>My Bookings</h2>
                                <p>
                                    Your events, carefully planned and organised.
                                </p>
                            </div>

                            <span className="booking-count">
                                {bookings.length}{" "}
                                {bookings.length === 1 ? "BOOKING" : "BOOKINGS"}
                            </span>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="no-bookings">
                                <div className="empty-icon">✦</div>
                                <span className="section-kicker">
                                    YOUR NEXT CHAPTER
                                </span>
                                <h2>Your celebrations start here.</h2>
                                <p>
                                    You haven't made any bookings yet.
                                    Explore our services and plan your next event.
                                </p>
                            </div>
                        ) : (
                            <div className="bookings-list">
                                {bookings.map((booking) => {
                                    const details = getItemDetails(booking);
                                    const duration = getDuration(
                                        booking.startDate,
                                        booking.endDate
                                    );

                                    const bookingStatus =
                                        booking.bookingStatus || "Pending";

                                    const paymentStatus =
                                        booking.paymentStatus || "Pending";

                                    const canCancel =
                                        bookingStatus === "Pending";

                                    const canRequestRefund =
                                        bookingStatus === "Cancelled" &&
                                        paymentStatus === "Completed";

                                    const cancelLoading =
                                        actionLoading === `${booking._id}-cancel`;

                                    const refundLoading =
                                        actionLoading === `${booking._id}-refund`;

                                    const statusClass = bookingStatus
                                        .toLowerCase()
                                        .replace(/\s+/g, "-");

                                    return (
                                        <article
                                            className="my-booking-card"
                                            key={booking._id}
                                        >
                                            <div className="my-booking-image">
                                                {details.image ? (
                                                    <img
                                                        src={details.image}
                                                        alt={details.title}
                                                    />
                                                ) : (
                                                    <div className="booking-image-placeholder">
                                                        <span>✦</span>
                                                        <small>EVENT HUB</small>
                                                    </div>
                                                )}

                                                <span className="booking-type-badge">
                                                    {details.type}
                                                </span>

                                                <div className="image-gradient"></div>
                                            </div>

                                            <div className="my-booking-content">
                                                <div className="booking-card-top">
                                                    <div>
                                                        <span className="my-booking-category">
                                                            {details.category}
                                                        </span>
                                                        <h3>{details.title}</h3>
                                                    </div>

                                                    <span
                                                        className={`booking-status-badge ${statusClass}`}
                                                    >
                                                        <span className="status-dot"></span>
                                                        {bookingStatus}
                                                    </span>
                                                </div>

                                                <div className="booking-details-grid">
                                                    <div className="booking-detail">
                                                        <span className="detail-icon">✦</span>
                                                        <div>
                                                            <small>Event Type</small>
                                                            <strong>
                                                                {booking.eventType || "Not specified"}
                                                            </strong>
                                                        </div>
                                                    </div>

                                                    <div className="booking-detail">
                                                        <span className="detail-icon">▦</span>
                                                        <div>
                                                            <small>Event Date</small>
                                                            <strong>
                                                                {formatDate(booking.startDate)}
                                                            </strong>
                                                        </div>
                                                    </div>

                                                    <div className="booking-detail">
                                                        <span className="detail-icon">◷</span>
                                                        <div>
                                                            <small>Duration</small>
                                                            <strong>{duration} Days</strong>
                                                        </div>
                                                    </div>

                                                    <div className="booking-detail">
                                                        <span className="detail-icon">♧</span>
                                                        <div>
                                                            <small>Guests</small>
                                                            <strong>
                                                                {booking.guests ?? "Not specified"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-card-bottom">
                                                    <div className="booking-reference">
                                                        <small>BOOKING REFERENCE</small>
                                                        <strong>#{booking._id.slice(-6).toUpperCase()}</strong>

                                                        <span
                                                            className={`payment-status ${
                                                                paymentStatus === "Completed"
                                                                    ? "paid"
                                                                    : "pending"
                                                            }`}
                                                        >
                                                            {paymentStatus === "Completed"
                                                                ? "✓ Payment Completed"
                                                                : "◷ Payment Pending"}
                                                        </span>
                                                    </div>

                                                    <div className="booking-total">
                                                        <small>TOTAL AMOUNT</small>
                                                        <strong>
                                                            {formatAmount(booking.totalAmount)}
                                                        </strong>
                                                    </div>
                                                </div>

                                                {(canCancel || canRequestRefund) && (
                                                    <div className="booking-actions">
                                                        {canCancel && (
                                                            <button
                                                                type="button"
                                                                className="booking-action-btn cancel-booking-btn"
                                                                disabled={Boolean(actionLoading)}
                                                                onClick={() =>
                                                                    handleCancelBooking(booking)
                                                                }
                                                            >
                                                                {cancelLoading
                                                                    ? "Cancelling..."
                                                                    : "Cancel Booking"}
                                                            </button>
                                                        )}

                                                        {canRequestRefund && (
                                                            <button
                                                                type="button"
                                                                className="booking-action-btn refund-booking-btn"
                                                                disabled={Boolean(actionLoading)}
                                                                onClick={() =>
                                                                    handleRefundRequest(booking)
                                                                }
                                                            >
                                                                {refundLoading
                                                                    ? "Submitting..."
                                                                    : "Request Refund"}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

export default MyBookings;