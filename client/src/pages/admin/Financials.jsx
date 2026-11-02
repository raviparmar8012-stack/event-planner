
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/admin/financials.css";

const API_URL = "http://localhost:5000/api/admin/bookings";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

function Financials() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [period, setPeriod] = useState("6");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);

            if (response.data.success) {
                setBookings(response.data.bookings || []);
            } else {
                setError("Failed to load financial records.");
            }
        } catch (err) {
            console.error("Financials Error:", err);
            setError("Unable to fetch financial data. Check your backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const activeBookings = useMemo(
        () =>
            bookings.filter(
                (booking) =>
                    booking.bookingStatus?.toLowerCase() !== "cancelled"
            ),
        [bookings]
    );

    const totalBookingValue = activeBookings.reduce(
        (sum, booking) => sum + (Number(booking.totalAmount) || 0),
        0
    );

    const paymentsReceived = activeBookings
        .filter(
            (booking) =>
                booking.paymentStatus?.toLowerCase() === "completed"
        )
        .reduce(
            (sum, booking) => sum + (Number(booking.totalAmount) || 0),
            0
        );

    const pendingPayments = activeBookings
        .filter(
            (booking) =>
                booking.paymentStatus?.toLowerCase() === "pending"
        )
        .reduce(
            (sum, booking) => sum + (Number(booking.totalAmount) || 0),
            0
        );

    const monthlySummary = useMemo(() => {
        const count = Number(period);
        const now = new Date();

        return Array.from({ length: count }, (_, index) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - count + 1 + index,
                1
            );

            const monthBookings = activeBookings.filter((booking) => {
                if (!booking.createdAt) return false;

                const created = new Date(booking.createdAt);

                return (
                    created.getFullYear() === date.getFullYear() &&
                    created.getMonth() === date.getMonth()
                );
            });

            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: date.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                }),
                value: monthBookings.reduce(
                    (sum, booking) =>
                        sum + (Number(booking.totalAmount) || 0),
                    0
                ),
                count: monthBookings.length,
            };
        });
    }, [activeBookings, period]);

    const maxValue = Math.max(
        ...monthlySummary.map((month) => month.value),
        1
    );

    const filteredBookings = useMemo(() => {
        const term = search.trim().toLowerCase();

        return [...bookings]
            .filter((booking) => {
                const customer =
                    typeof booking.userId === "object"
                        ? booking.userId?.name
                        : booking.name;

                const email =
                    typeof booking.userId === "object"
                        ? booking.userId?.email
                        : booking.email;

                const matchesSearch =
                    !term ||
                    String(customer || "").toLowerCase().includes(term) ||
                    String(email || "").toLowerCase().includes(term) ||
                    String(booking.eventType || "").toLowerCase().includes(term) ||
                    String(booking._id || "").toLowerCase().includes(term);

                const matchesPayment =
                    paymentFilter === "All" ||
                    (booking.paymentStatus || "Pending").toLowerCase() ===
                    paymentFilter.toLowerCase();

                return matchesSearch && matchesPayment;
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );
    }, [bookings, search, paymentFilter]);

    return (
        <div className="financials-page">
            <div className="financials-heading">
                <div>
                    <p className="financials-kicker">EVENT HUB / FINANCE</p>
                    <h2>Financial Overview</h2>
                    <p className="financials-subtitle">
                        Monitor booking values and payment collections.
                    </p>
                </div>

                <button
                    className="financials-refresh"
                    onClick={fetchBookings}
                    disabled={loading}
                >
                    ↻ {loading ? "Loading..." : "Refresh Data"}
                </button>
            </div>

            {error && (
                <div className="financials-error">
                    {error}
                    <button onClick={fetchBookings}>Retry</button>
                </div>
            )}

            <div className="financials-stats">
                <div className="financial-stat-card">
                    <div className="financial-stat-top">
                        <span>Total Booking Value</span>
                        <span className="financial-stat-icon orange">₹</span>
                    </div>
                    <h3>{loading ? "—" : formatCurrency(totalBookingValue)}</h3>
                    <p>Non-cancelled bookings</p>
                </div>

                <div className="financial-stat-card">
                    <div className="financial-stat-top">
                        <span>Payments Received</span>
                        <span className="financial-stat-icon green">✓</span>
                    </div>
                    <h3 className="received-amount">
                        {loading ? "—" : formatCurrency(paymentsReceived)}
                    </h3>
                    <p>Payments marked completed</p>
                </div>

                <div className="financial-stat-card">
                    <div className="financial-stat-top">
                        <span>Pending Payments</span>
                        <span className="financial-stat-icon blue">◷</span>
                    </div>
                    <h3 className="pending-amount">
                        {loading ? "—" : formatCurrency(pendingPayments)}
                    </h3>
                    <p>Awaiting payment completion</p>
                </div>

                <div className="financial-stat-card">
                    <div className="financial-stat-top">
                        <span>Active Bookings</span>
                        <span className="financial-stat-icon navy">▤</span>
                    </div>
                    <h3>{loading ? "—" : activeBookings.length}</h3>
                    <p>Excluding cancelled bookings</p>
                </div>
            </div>

            <section className="financials-panel">
                <div className="financials-panel-header">
                    <div>
                        <p className="financials-kicker">PERFORMANCE</p>
                        <h3>Monthly Booking Summary</h3>
                    </div>

                    <select
                        className="financials-period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="3">Last 3 months</option>
                        <option value="6">Last 6 months</option>
                        <option value="12">Last 12 months</option>
                    </select>
                </div>

                {loading ? (
                    <div className="financials-empty">Loading summary...</div>
                ) : (
                    <div className="monthly-chart">
                        {monthlySummary.map((month) => (
                            <div className="monthly-chart-item" key={month.key}>
                                <div className="monthly-bar-area">
                                    <span className="monthly-value">
                                        {formatCurrency(month.value)}
                                    </span>
                                    <div
                                        className="monthly-bar"
                                        style={{
                                            height: `${
                                                month.value
                                                    ? Math.max(
                                                        (month.value / maxValue) * 100,
                                                        5
                                                    )
                                                    : 2
                                            }%`,
                                        }}
                                    />
                                </div>
                                <span className="monthly-label">
                                    {month.label}
                                </span>
                                <span className="monthly-count">
                                    {month.count} booking
                                    {month.count === 1 ? "" : "s"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="financials-panel">
                <div className="financials-panel-header">
                    <div>
                        <p className="financials-kicker">TRANSACTION RECORDS</p>
                        <h3>Booking Financial Records</h3>
                    </div>
                    <span className="records-count">
                        {filteredBookings.length} records
                    </span>
                </div>

                <div className="financials-filters">
                    <div className="financial-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search customer, event or booking ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="financials-period"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="All">All payments</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                {loading ? (
                    <div className="financials-empty">Loading records...</div>
                ) : error ? (
                    <div className="financials-empty">
                        Financial records could not be loaded.
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="financials-empty">
                        No financial records found.
                    </div>
                ) : (
                    <div className="financials-table-wrap">
                        <table className="financials-table">
                            <thead>
                            <tr>
                                <th>Booking</th>
                                <th>Customer</th>
                                <th>Event Type</th>
                                <th>Booking Date</th>
                                <th>Booking Status</th>
                                <th>Payment Status</th>
                                <th className="amount-column">Amount</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredBookings.map((booking) => {
                                const customer =
                                    typeof booking.userId === "object"
                                        ? booking.userId?.name
                                        : booking.name;

                                const email =
                                    typeof booking.userId === "object"
                                        ? booking.userId?.email
                                        : booking.email;

                                const status =
                                    booking.bookingStatus || "Pending";

                                const payment =
                                    booking.paymentStatus || "Pending";

                                return (
                                    <tr key={booking._id}>
                                        <td>
                                                <span className="booking-id">
                                                    #
                                                    {String(booking._id || "")
                                                        .slice(-6)
                                                        .toUpperCase()}
                                                </span>
                                        </td>
                                        <td>
                                            <div className="financial-customer">
                                                <strong>
                                                    {customer || "Unknown"}
                                                </strong>
                                                <span>{email || "—"}</span>
                                            </div>
                                        </td>
                                        <td>{booking.eventType || "—"}</td>
                                        <td>
                                            {booking.createdAt
                                                ? new Date(
                                                    booking.createdAt
                                                ).toLocaleDateString("en-IN")
                                                : "—"}
                                        </td>
                                        <td>
                                                <span
                                                    className={`financial-status ${status.toLowerCase()}`}
                                                >
                                                    {status}
                                                </span>
                                        </td>
                                        <td>
                                                <span
                                                    className={`financial-status payment-${payment.toLowerCase()}`}
                                                >
                                                    {payment}
                                                </span>
                                        </td>
                                        <td className="amount-column">
                                            <strong className="financial-amount">
                                                {formatCurrency(
                                                    booking.totalAmount
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div className="financials-note">
                <span>ⓘ</span>
                <p>
                    Figures represent stored booking values and payment
                    statuses, not platform profit or vendor payouts.
                </p>
            </div>
        </div>
    );
}

export default Financials;
