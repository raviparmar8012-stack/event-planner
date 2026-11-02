
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/bookingManagement.css";

function BookingManagement() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [message, setMessage] = useState("");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await axios.get(
                "http://localhost:5000/api/admin/bookings"
            );

            setBookings(response.data.bookings || []);
        } catch (error) {
            console.error("Fetch Bookings Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchBookings();
    }, []);

    // UPDATE BOOKING STATUS
    const handleBookingStatus = async (id, bookingStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/bookings/${id}/status`,
                { bookingStatus }
            );

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking._id === id
                        ? { ...booking, bookingStatus }
                        : booking
                )
            );
        } catch (error) {
            console.error("Update Booking Status Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update booking status"
            );
        }
    };

    // UPDATE PAYMENT STATUS
    const handlePaymentStatus = async (id, paymentStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/bookings/${id}/payment`,
                { paymentStatus }
            );

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking._id === id
                        ? { ...booking, paymentStatus }
                        : booking
                )
            );
        } catch (error) {
            console.error("Update Payment Status Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update payment status"
            );
        }
    };

    // FILTER BOOKINGS
    const filteredBookings = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return bookings.filter((booking) => {
            const matchesSearch =
                booking.name?.toLowerCase().includes(searchText) ||
                booking.email?.toLowerCase().includes(searchText) ||
                booking.eventType?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                booking.bookingStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, search, statusFilter]);

    // BOOKING STATISTICS
    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
        (booking) => booking.bookingStatus === "Pending"
    ).length;

    const confirmedBookings = bookings.filter(
        (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    const completedBookings = bookings.filter(
        (booking) => booking.bookingStatus === "Completed"
    ).length;

    // FORMAT CURRENCY
    const formatAmount = (amount) => {
        if (amount === null || amount === undefined || amount === "") {
            return "Amount unavailable";
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount)) {
            return "Amount unavailable";
        }

        return `₹${numericAmount.toLocaleString("en-IN")}`;
    };

    // FORMAT DATE
    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN");
    };

    return (
        <div className="booking-management">

            {/* HEADER */}
            <div className="booking-page-header">
                <div>
                    <button
                        className="back-dashboard-btn"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <p className="booking-eyebrow">
                        ADMIN / BOOKINGS
                    </p>

                    <h1>Booking Management</h1>

                    <p>
                        View and manage all customer bookings from one place.
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="booking-stats">
                <div className="booking-stat-card">
                    <span>Total Bookings</span>
                    <strong>{totalBookings}</strong>
                </div>

                <div className="booking-stat-card">
                    <span>Pending</span>
                    <strong>{pendingBookings}</strong>
                </div>

                <div className="booking-stat-card">
                    <span>Confirmed</span>
                    <strong>{confirmedBookings}</strong>
                </div>

                <div className="booking-stat-card">
                    <span>Completed</span>
                    <strong>{completedBookings}</strong>
                </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="booking-controls">
                <input
                    type="text"
                    placeholder="Search customer, email or event..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* ERROR MESSAGE */}
            {message && (
                <div className="booking-message">
                    {message}
                </div>
            )}

            {/* BOOKINGS TABLE */}
            <div className="booking-table-wrapper">
                {loading ? (
                    <div className="booking-loading">
                        Loading bookings...
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="booking-empty">
                        <h3>No bookings found</h3>
                        <p>Customer bookings will appear here.</p>
                    </div>
                ) : (
                    <table className="booking-table">
                        <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Event</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Guests</th>
                            <th>Total Amount</th>
                            <th>Booking Status</th>
                            <th>Payment</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredBookings.map((booking) => (
                            <tr key={booking._id}>
                                {/* CUSTOMER */}
                                <td>
                                    <div className="customer-cell">
                                        <strong>
                                            {booking.name || "N/A"}
                                        </strong>
                                        <span>
                                                {booking.email || "N/A"}
                                            </span>
                                    </div>
                                </td>

                                {/* EVENT */}
                                <td>
                                        <span className="event-type">
                                            {booking.eventType || "N/A"}
                                        </span>
                                </td>

                                {/* START DATE */}
                                <td>
                                    <div className="date-cell">
                                            <span>
                                                {formatDate(booking.startDate)}
                                            </span>
                                    </div>
                                </td>

                                {/* END DATE */}
                                <td>
                                    <div className="date-cell">
                                            <span>
                                                {formatDate(booking.endDate)}
                                            </span>
                                    </div>
                                </td>

                                {/* GUESTS */}
                                <td>
                                    {booking.guests ?? "N/A"}
                                </td>

                                {/* TOTAL AMOUNT */}
                                <td>
                                    <strong className="booking-total-amount">
                                        {formatAmount(booking.totalAmount)}
                                    </strong>
                                </td>

                                {/* BOOKING STATUS */}
                                <td>
                                    <select
                                        className={`status-select ${(booking.bookingStatus || "Pending").toLowerCase()}`}
                                        value={booking.bookingStatus || "Pending"}
                                        onChange={(e) =>
                                            handleBookingStatus(
                                                booking._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>

                                {/* PAYMENT STATUS */}
                                <td>
                                    <select
                                        className={`payment-select ${(booking.paymentStatus || "Pending").toLowerCase()}`}
                                        value={booking.paymentStatus || "Pending"}
                                        onChange={(e) =>
                                            handlePaymentStatus(
                                                booking._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default BookingManagement;
