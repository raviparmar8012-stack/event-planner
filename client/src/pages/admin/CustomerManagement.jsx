import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/customerManagement.css";

function CustomerManagement() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:5000/api/admin/customers"
            );

            setCustomers(response.data.customers || []);
        } catch (error) {
            console.log("Fetch Customers Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load customers"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter((customer) => {
        const searchText = search.toLowerCase();

        return (
            customer.name?.toLowerCase().includes(searchText) ||
            customer.email?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="customer-management-page">

            {/* ================= HEADER ================= */}

            <div className="customer-page-header">

                <div>

                    <button
                        className="back-dashboard-btn"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <p className="customer-page-kicker">
                        ADMINISTRATION
                    </p>

                    <h1>Customer Management</h1>

                    <p>
                        View and manage registered Event Hub customers.
                    </p>

                </div>

            </div>


            {/* ================= STATS ================= */}

            <div className="customer-management-stats">

                <div className="customer-stat-card">

                    <span>Total Customers</span>

                    <strong>
                        {customers.length}
                    </strong>

                </div>

                <div className="customer-stat-card">

                    <span>Active Accounts</span>

                    <strong>
                        {customers.length}
                    </strong>

                </div>

                <div className="customer-stat-card">

                    <span>Customer Role</span>

                    <strong>
                        Customer
                    </strong>

                </div>

            </div>


            {/* ================= MESSAGE ================= */}

            {message && (
                <div className="customer-message">
                    {message}
                </div>
            )}


            {/* ================= MAIN PANEL ================= */}

            <div className="customer-management-panel">

                <div className="customer-panel-header">

                    <div>

                        <p className="panel-label">
                            CUSTOMER DIRECTORY
                        </p>

                        <h2>
                            All Customers
                        </h2>

                    </div>


                    <div className="customer-search">

                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="customer-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading customers...
                        </p>

                    </div>

                ) : filteredCustomers.length === 0 ? (

                    <div className="customer-empty">

                        <div>♙</div>

                        <h3>
                            No customers found
                        </h3>

                        <p>
                            {search
                                ? "Try a different search."
                                : "No customer accounts are registered yet."}
                        </p>

                    </div>

                ) : (

                    <div className="customer-table-wrapper">

                        <table className="customer-table">

                            <thead>

                            <tr>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Registered
                                </th>

                                <th>
                                    Account ID
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {filteredCustomers.map(
                                (customer) => (

                                    <tr key={customer._id}>

                                        <td>

                                            <div className="customer-name-cell">

                                                <div className="customer-avatar">

                                                    {customer.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {customer.name}
                                                    </strong>

                                                    <span>
                                                            Customer Account
                                                        </span>

                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            {customer.email}
                                        </td>


                                        <td>

                                                <span className="customer-role">

                                                    {customer.role}

                                                </span>

                                        </td>


                                        <td>

                                            {customer.createdAt
                                                ? new Date(
                                                    customer.createdAt
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

                                                <span className="customer-id">

                                                    {customer._id}

                                                </span>

                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default CustomerManagement;