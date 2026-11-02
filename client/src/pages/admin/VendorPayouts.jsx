import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/admin/vendorPayouts.css";

const API_URL = "http://localhost:5000/api/admin/bookings";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

function VendorPayouts() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);

            if (response.data.success) {
                setBookings(response.data.bookings || []);
            } else {
                setError("Unable to load booking records.");
            }
        } catch (err) {
            console.error("Vendor Payouts Error:", err);
            setError("Could not fetch booking data. Check your backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Build a vendor-wise summary from booking items.
    // These are booking values, not confirmed vendor payouts.
    const vendorRecords = useMemo(() => {
        const records = [];

        bookings.forEach((booking) => {
            if (booking.bookingStatus?.toLowerCase() === "cancelled") {
                return;
            }

            (booking.items || []).forEach((item, index) => {
                if (item.type !== "vendor") return;

                records.push({
                    id: `${booking._id}-${item.itemId}-${index}`,
                    bookingId: booking._id,
                    vendorId: item.itemId,
                    vendorName: item.name || "Unknown Vendor",
                    category: item.category || "—",
                    city: item.city || "—",
                    eventType: booking.eventType || "—",
                    customerName:
                        typeof booking.userId === "object"
                            ? booking.userId?.name || booking.name
                            : booking.name,
                    bookingDate: booking.createdAt,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    amount:
                        Number(item.calculatedAmount) ||
                        Number(item.price) ||
                        0,
                    paymentStatus: booking.paymentStatus || "Pending",
                    bookingStatus: booking.bookingStatus || "Pending",
                });
            });
        });

        return records;
    }, [bookings]);

    const totalBookingValue = vendorRecords.reduce(
        (sum, record) => sum + record.amount,
        0
    );

    const paidBookingValue = vendorRecords
        .filter(
            (record) =>
                record.paymentStatus.toLowerCase() === "completed"
        )
        .reduce((sum, record) => sum + record.amount, 0);

    const pendingBookingValue = vendorRecords
        .filter(
            (record) =>
                record.paymentStatus.toLowerCase() === "pending"
        )
        .reduce((sum, record) => sum + record.amount, 0);

    const filteredRecords = vendorRecords.filter((record) => {
        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term ||
            record.vendorName.toLowerCase().includes(term) ||
            record.category.toLowerCase().includes(term) ||
            record.city.toLowerCase().includes(term) ||
            String(record.customerName || "").toLowerCase().includes(term) ||
            String(record.bookingId || "").toLowerCase().includes(term);

        const matchesStatus =
            statusFilter === "All" ||
            record.paymentStatus.toLowerCase() ===
            statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="vendor-payouts-page">
            <div className="payouts-heading">
                <div>
                    <p className="payouts-kicker">EVENT HUB / PAYOUTS</p>
                    <h2>Vendor Payouts</h2>
                    <p className="payouts-subtitle">
                        Review vendor booking values and associated payment
                        statuses.
                    </p>
                </div>

                <button
                    className="payouts-refresh"
                    onClick={fetchBookings}
                    disabled={loading}
                >
                    ↻ {loading ? "Loading..." : "Refresh Data"}
                </button>
            </div>

            {error && (
                <div className="payouts-error">
                    <span>{error}</span>
                    <button onClick={fetchBookings}>Retry</button>
                </div>
            )}

            <div className="payouts-stats">
                <div className="payout-stat-card">
                    <div className="payout-stat-top">
                        <span>Vendor Booking Value</span>
                        <span className="payout-stat-icon orange">₹</span>
                    </div>
                    <h3>
                        {loading ? "—" : formatCurrency(totalBookingValue)}
                    </h3>
                    <p>Values assigned to vendor items</p>
                </div>

                <div className="payout-stat-card">
                    <div className="payout-stat-top">
                        <span>Associated Paid Value</span>
                        <span className="payout-stat-icon green">✓</span>
                    </div>
                    <h3 className="payout-paid">
                        {loading ? "—" : formatCurrency(paidBookingValue)}
                    </h3>
                    <p>Booking payments marked completed</p>
                </div>

                <div className="payout-stat-card">
                    <div className="payout-stat-top">
                        <span>Associated Pending Value</span>
                        <span className="payout-stat-icon blue">◷</span>
                    </div>
                    <h3 className="payout-pending">
                        {loading ? "—" : formatCurrency(pendingBookingValue)}
                    </h3>
                    <p>Booking payments marked pending</p>
                </div>

                <div className="payout-stat-card">
                    <div className="payout-stat-top">
                        <span>Vendor Booking Items</span>
                        <span className="payout-stat-icon navy">▤</span>
                    </div>
                    <h3>{loading ? "—" : vendorRecords.length}</h3>
                    <p>Non-cancelled booking items</p>
                </div>
            </div>

            <section className="payouts-panel">
                <div className="payouts-panel-header">
                    <div>
                        <p className="payouts-kicker">VENDOR TRANSACTIONS</p>
                        <h3>Vendor Booking Records</h3>
                    </div>

                    <span className="payouts-record-count">
                        {filteredRecords.length} records
                    </span>
                </div>

                <div className="payouts-filters">
                    <div className="payouts-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search vendor, category, customer or booking..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="payouts-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All payment statuses</option>
                        <option value="Completed">Payment completed</option>
                        <option value="Pending">Payment pending</option>
                    </select>
                </div>

                {loading ? (
                    <div className="payouts-empty">
                        Loading vendor records...
                    </div>
                ) : error ? (
                    <div className="payouts-empty">
                        Vendor records could not be loaded.
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="payouts-empty">
                        No vendor booking records found.
                    </div>
                ) : (
                    <div className="payouts-table-wrap">
                        <table className="payouts-table">
                            <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Category</th>
                                <th>City</th>
                                <th>Customer</th>
                                <th>Booking Date</th>
                                <th>Payment Status</th>
                                <th className="payout-amount-column">
                                    Booking Value
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <div className="payout-vendor">
                                            <strong>
                                                {record.vendorName}
                                            </strong>
                                            <span>
                                                    ID: {record.vendorId ?? "—"}
                                                </span>
                                        </div>
                                    </td>

                                    <td>{record.category}</td>
                                    <td>{record.city}</td>
                                    <td>
                                        {record.customerName || "—"}
                                    </td>
                                    <td>
                                        {record.bookingDate
                                            ? new Date(
                                                record.bookingDate
                                            ).toLocaleDateString("en-IN")
                                            : "—"}
                                    </td>
                                    <td>
                                            <span
                                                className={`payout-status payment-${record.paymentStatus.toLowerCase()}`}
                                            >
                                                {record.paymentStatus}
                                            </span>
                                    </td>
                                    <td className="payout-amount-column">
                                        <strong className="payout-amount">
                                            {formatCurrency(record.amount)}
                                        </strong>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div className="payouts-note">
                <span>ⓘ</span>
                <p>
                    These amounts represent vendor items within customer
                    bookings. They are not confirmed vendor payouts. Actual
                    payouts require a separate payout and commission workflow.
                </p>
            </div>
        </div>
    );
}

export default VendorPayouts;