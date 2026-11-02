import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/admin/refunds.css";

const API = "http://localhost:5000/api/admin/refunds";

function Refunds() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [updatingId, setUpdatingId] = useState("");
    const [notice, setNotice] = useState("");

    const fetchRefunds = async () => {
        try {
            setError("");

            const response = await axios.get(API);

            if (response.data.success) {
                setRefunds(response.data.refunds || []);
            } else {
                setError("Unable to load refund records.");
            }
        } catch (err) {
            console.error("Refund data error:", err);
            setError("Failed to load refunds. Please check the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);

    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredRefunds = useMemo(() => {
        return refunds.filter((refund) => {
            const customer =
                refund.userId?.name ||
                refund.bookingId?.customerName ||
                "N/A";

            const email = refund.userId?.email || "";
            const bookingId =
                typeof refund.bookingId === "object"
                    ? refund.bookingId?._id
                    : refund.bookingId;

            const matchesSearch = [
                refund._id,
                bookingId,
                customer,
                email,
                refund.reason,
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesFilter =
                filter === "All" || refund.status === filter;

            return matchesSearch && matchesFilter;
        });
    }, [refunds, searchTerm, filter]);

    const totalRefundValue = refunds.reduce(
        (total, refund) => total + (Number(refund.amount) || 0),
        0
    );

    const pendingCount = refunds.filter(
        (refund) => refund.status === "Pending"
    ).length;

    const approvedCount = refunds.filter(
        (refund) => refund.status === "Approved"
    ).length;

    const refundedValue = refunds
        .filter((refund) => refund.status === "Refunded")
        .reduce(
            (total, refund) => total + (Number(refund.amount) || 0),
            0
        );

    const updateStatus = async (refund, status) => {
        const actionMessage =
            status === "Approved"
                ? "approve this refund request?"
                : status === "Rejected"
                    ? "reject this refund request?"
                    : "mark this refund as refunded? Only do this after the refund has actually been processed.";

        if (!window.confirm(`Are you sure you want to ${actionMessage}`)) {
            return;
        }

        try {
            setUpdatingId(refund._id);
            setNotice("");
            setError("");

            const response = await axios.put(`${API}/${refund._id}/status`, {
                status,
            });

            if (response.data.success) {
                setNotice(response.data.message || "Refund status updated.");
                await fetchRefunds();
            } else {
                setError(response.data.message || "Unable to update status.");
            }
        } catch (err) {
            console.error("Refund update error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to update refund status."
            );
        } finally {
            setUpdatingId("");
        }
    };

    return (
        <div className="refunds-page">
            <div className="refunds-header">
                <div>
                    <span className="refunds-eyebrow">
                        FINANCE MANAGEMENT
                    </span>
                    <h1>Refund Management</h1>
                    <p>
                        Review refund requests and manage their recorded
                        statuses.
                    </p>
                </div>

                <div className="refunds-header-icon">↩</div>
            </div>

            <div className="refunds-notice">
                <span className="refunds-notice-icon">i</span>
                <div>
                    <strong>Refund processing notice</strong>
                    <p>
                        Status updates are saved to the database. Mark a
                        request as Refunded only after the money has actually
                        been returned to the customer.
                    </p>
                </div>
            </div>

            {notice && (
                <div className="refunds-notice">
                    <span className="refunds-notice-icon">✓</span>
                    <div>
                        <strong>{notice}</strong>
                    </div>
                </div>
            )}

            {error && (
                <div className="refunds-state refunds-error">
                    {error}
                </div>
            )}

            <div className="refunds-stats">
                <div className="refunds-stat-card">
                    <div className="refunds-stat-top">
                        <span>Total Requests</span>
                        <span className="refunds-stat-icon orange">↩</span>
                    </div>
                    <h2>{refunds.length}</h2>
                    <p>Recorded refund requests</p>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-top">
                        <span>Request Value</span>
                        <span className="refunds-stat-icon blue">₹</span>
                    </div>
                    <h2>{formatCurrency(totalRefundValue)}</h2>
                    <p>Total value of refund records</p>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-top">
                        <span>Pending Requests</span>
                        <span className="refunds-stat-icon red">!</span>
                    </div>
                    <h2>{pendingCount}</h2>
                    <p>Awaiting admin review</p>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-top">
                        <span>Refunded Value</span>
                        <span className="refunds-stat-icon green">✓</span>
                    </div>
                    <h2>{formatCurrency(refundedValue)}</h2>
                    <p>Records marked as refunded</p>
                </div>
            </div>

            <div className="refunds-table-card">
                <div className="refunds-table-heading">
                    <div>
                        <h2>Refund Records</h2>
                        <p>
                            Approve, reject or update existing refund requests
                        </p>
                    </div>

                    <span className="refunds-record-count">
                        {filteredRefunds.length} records
                    </span>
                </div>

                <div className="refunds-toolbar">
                    <div className="refunds-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search booking, customer or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Refunded">Refunded</option>
                    </select>
                </div>

                {loading ? (
                    <div className="refunds-state">
                        Loading refund records...
                    </div>
                ) : filteredRefunds.length === 0 ? (
                    <div className="refunds-state">
                        <div className="refunds-empty-icon">↩</div>
                        <h3>No refund records found</h3>
                        <p>
                            Refund requests will appear here after they are
                            created in the backend.
                        </p>
                    </div>
                ) : (
                    <div className="refunds-table-wrapper">
                        <table className="refunds-table">
                            <thead>
                            <tr>
                                <th>REFUND ID</th>
                                <th>CUSTOMER</th>
                                <th>AMOUNT</th>
                                <th>REASON</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredRefunds.map((refund) => {
                                const booking =
                                    typeof refund.bookingId === "object"
                                        ? refund.bookingId
                                        : null;

                                const customer =
                                    refund.userId?.name ||
                                    booking?.customerName ||
                                    "N/A";

                                const statusClass =
                                    refund.status?.toLowerCase() || "pending";

                                return (
                                    <tr key={refund._id}>
                                        <td>
                                                <span className="refunds-booking-id">
                                                    #{String(refund._id).slice(-8)}
                                                </span>
                                        </td>

                                        <td>
                                            <div className="refunds-customer">
                                                <strong>{customer}</strong>
                                                <span>
                                                        {refund.userId?.email ||
                                                            "No email"}
                                                    </span>
                                            </div>
                                        </td>

                                        <td className="refunds-amount">
                                            {formatCurrency(refund.amount)}
                                        </td>

                                        <td>
                                            {refund.reason || "N/A"}
                                        </td>

                                        <td>
                                            {formatDate(refund.createdAt)}
                                        </td>

                                        <td>
                                                <span
                                                    className={`refunds-payment-badge ${statusClass}`}
                                                >
                                                    {refund.status}
                                                </span>
                                        </td>

                                        <td>
                                            <div className="refunds-actions">
                                                {refund.status === "Pending" && (
                                                    <>
                                                        <button
                                                            className="refunds-action-btn approve"
                                                            disabled={updatingId === refund._id}
                                                            onClick={() =>
                                                                updateStatus(refund, "Approved")
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            className="refunds-action-btn reject"
                                                            disabled={updatingId === refund._id}
                                                            onClick={() =>
                                                                updateStatus(refund, "Rejected")
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {refund.status === "Approved" && (
                                                    <button
                                                        className="refunds-action-btn approve"
                                                        disabled={updatingId === refund._id}
                                                        onClick={() =>
                                                            updateStatus(refund, "Refunded")
                                                        }
                                                    >
                                                        Mark Refunded
                                                    </button>
                                                )}

                                                {(refund.status === "Rejected" ||
                                                    refund.status === "Refunded") && (
                                                    <span className="refunds-action-complete">
                                                            No actions
                                                        </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Refunds;