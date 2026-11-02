import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/vendorManagement.css";

function VendorManagement() {
    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [message, setMessage] = useState("");

    const fetchVendors = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:5000/api/admin/vendors"
            );

            setVendors(response.data.vendors || []);
        } catch (error) {
            console.log("Fetch Vendors Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load vendors"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchVendors();
    }, []);

    const updateVendorStatus = async (vendorId, status) => {
        try {
            setActionLoading(vendorId);
            setMessage("");

            await axios.put(
                `http://localhost:5000/api/admin/vendors/${vendorId}/status`,
                {
                    vendorStatus: status
                }
            );

            setMessage(
                status === "approved"
                    ? "Vendor approved successfully."
                    : "Vendor rejected successfully."
            );

            await fetchVendors();
        } catch (error) {
            console.log("Vendor Status Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to update vendor status"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const filteredVendors = vendors.filter((vendor) => {
        const matchesSearch =
            vendor.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            vendor.email
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" ||
            vendor.vendorStatus === filter;

        return matchesSearch && matchesFilter;
    });

    const pendingCount = vendors.filter(
        (vendor) => vendor.vendorStatus === "pending"
    ).length;

    const approvedCount = vendors.filter(
        (vendor) => vendor.vendorStatus === "approved"
    ).length;

    const rejectedCount = vendors.filter(
        (vendor) => vendor.vendorStatus === "rejected"
    ).length;

    return (
        <div className="vendor-management-page">

            {/* ================= HEADER ================= */}

            <div className="vendor-page-header">

                <div>

                    <button
                        className="back-dashboard-btn"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <p className="vendor-page-kicker">
                        ADMINISTRATION
                    </p>

                    <h1>Vendor Management</h1>

                    <p>
                        Review, approve and manage Event Hub vendors.
                    </p>

                </div>

            </div>


            {/* ================= STATS ================= */}

            <div className="vendor-management-stats">

                <div className="vendor-stat-card">
                    <span>Total Vendors</span>
                    <strong>{vendors.length}</strong>
                </div>

                <div className="vendor-stat-card pending">
                    <span>Pending</span>
                    <strong>{pendingCount}</strong>
                </div>

                <div className="vendor-stat-card approved">
                    <span>Approved</span>
                    <strong>{approvedCount}</strong>
                </div>

                <div className="vendor-stat-card rejected">
                    <span>Rejected</span>
                    <strong>{rejectedCount}</strong>
                </div>

            </div>


            {/* ================= MESSAGE ================= */}

            {message && (
                <div className="vendor-message">
                    {message}
                </div>
            )}


            {/* ================= TABLE PANEL ================= */}

            <div className="vendor-management-panel">

                <div className="vendor-panel-header">

                    <div>
                        <p className="panel-label">
                            VENDOR DIRECTORY
                        </p>

                        <h2>
                            All Vendors
                        </h2>
                    </div>

                    <div className="vendor-controls">

                        <input
                            type="text"
                            placeholder="Search vendor..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                        >
                            <option value="all">
                                All Vendors
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>
                        </select>

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="vendor-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading vendors...</p>
                    </div>

                ) : filteredVendors.length === 0 ? (

                    <div className="vendor-empty">
                        <div>◈</div>

                        <h3>
                            No vendors found
                        </h3>

                        <p>
                            Try changing your search or filter.
                        </p>
                    </div>

                ) : (

                    <div className="vendor-table-wrapper">

                        <table className="vendor-table">

                            <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Registered</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {filteredVendors.map((vendor) => (

                                <tr key={vendor._id}>

                                    <td>

                                        <div className="vendor-name-cell">

                                            <div className="vendor-avatar">
                                                {vendor.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {vendor.name}
                                                </strong>

                                                <span>
                                                        Vendor Account
                                                    </span>
                                            </div>

                                        </div>

                                    </td>


                                    <td>
                                        {vendor.email}
                                    </td>


                                    <td>
                                            <span className="role-text">
                                                Vendor
                                            </span>
                                    </td>


                                    <td>

                                            <span
                                                className={`vendor-status ${vendor.vendorStatus}`}
                                            >
                                                {vendor.vendorStatus}
                                            </span>

                                    </td>


                                    <td>
                                        {vendor.createdAt
                                            ? new Date(
                                                vendor.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )
                                            : "—"}
                                    </td>


                                    <td>

                                        <div className="vendor-actions">

                                            {vendor.vendorStatus ===
                                                "pending" && (
                                                    <>
                                                        <button
                                                            className="approve-btn"
                                                            disabled={
                                                                actionLoading ===
                                                                vendor._id
                                                            }
                                                            onClick={() =>
                                                                updateVendorStatus(
                                                                    vendor._id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            {actionLoading ===
                                                            vendor._id
                                                                ? "..."
                                                                : "Approve"}
                                                        </button>

                                                        <button
                                                            className="reject-btn"
                                                            disabled={
                                                                actionLoading ===
                                                                vendor._id
                                                            }
                                                            onClick={() =>
                                                                updateVendorStatus(
                                                                    vendor._id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                            {vendor.vendorStatus ===
                                                "approved" && (
                                                    <span className="action-complete">
                                                            Approved
                                                        </span>
                                                )}

                                            {vendor.vendorStatus ===
                                                "rejected" && (
                                                    <button
                                                        className="approve-btn"
                                                        disabled={
                                                            actionLoading ===
                                                            vendor._id
                                                        }
                                                        onClick={() =>
                                                            updateVendorStatus(
                                                                vendor._id,
                                                                "approved"
                                                            )
                                                        }
                                                    >
                                                        Approve Again
                                                    </button>
                                                )}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default VendorManagement;