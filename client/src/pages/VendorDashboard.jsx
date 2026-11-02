
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/VendorDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

function getStoredUser() {
    for (const key of ["user", "currentUser", "userInfo"]) {
        try {
            const value = localStorage.getItem(key);
            if (value) return JSON.parse(value);
        } catch {
            // Ignore invalid stored user data
        }
    }
    return {};
}

function formatMoney(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-IN");
}

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState("Overview");
    const [vendor, setVendor] = useState(getStoredUser);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const vendorId = vendor.id || vendor._id;

    const [expenses, setExpenses] = useState([]);
    const [expensesLoading, setExpensesLoading] = useState(false);
    const [expenseBusy, setExpenseBusy] = useState(false);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [expenseError, setExpenseError] = useState("");
    const [expenseMessage, setExpenseMessage] = useState("");

    useEffect(() => {
        if (!vendorId) {
            setError("Vendor login details not found. Please log in again.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadDashboard() {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(
                    `${API_URL}/api/vendor-dashboard/${vendorId}`
                );

                if (!response.data.success) {
                    throw new Error(
                        response.data.message || "Unable to load dashboard."
                    );
                }

                if (cancelled) return;

                setDashboardData(response.data);

                if (response.data.vendor) {
                    setVendor((previous) => ({
                        ...previous,
                        ...response.data.vendor,
                        id:
                            response.data.vendor.id ||
                            previous.id ||
                            previous._id,
                    }));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to connect to the server."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, [vendorId]);

    useEffect(() => {
        if (!vendorId) return;

        let cancelled = false;

        async function loadExpensesAndMigrate() {
            setExpensesLoading(true);
            setExpenseError("");
            setExpenseMessage("");

            const storageKey = `vendorExpenses_${vendorId}`;

            try {
                // Read any existing browser expenses before fetching MongoDB data.
                let oldExpenses = [];

                try {
                    const stored = localStorage.getItem(storageKey);
                    oldExpenses = stored ? JSON.parse(stored) : [];
                } catch {
                    oldExpenses = [];
                }

                if (!Array.isArray(oldExpenses)) {
                    oldExpenses = [];
                }

                const response = await axios.get(
                    `${API_URL}/api/expenses/${vendorId}`
                );

                if (!response.data.success) {
                    throw new Error(
                        response.data.message || "Unable to load expenses."
                    );
                }

                let serverExpenses = response.data.expenses || [];

                // Migrate old browser records only if they have not already
                // been marked as migrated. The server uses legacyId to avoid
                // duplicates if this request is retried.
                if (oldExpenses.length > 0) {
                    const migrationKey = `vendorExpensesMigrated_${vendorId}`;
                    const migrationDone =
                        localStorage.getItem(migrationKey) === "true";

                    if (!migrationDone) {
                        const migrationResponse = await axios.post(
                            `${API_URL}/api/expenses/${vendorId}/migrate`,
                            { expenses: oldExpenses }
                        );

                        if (!migrationResponse.data.success) {
                            throw new Error(
                                migrationResponse.data.message ||
                                "Could not migrate old expenses."
                            );
                        }

                        localStorage.setItem(migrationKey, "true");

                        // Remove the old copy only after the server confirms
                        // that migration succeeded.
                        localStorage.removeItem(storageKey);

                        const refreshed = await axios.get(
                            `${API_URL}/api/expenses/${vendorId}`
                        );

                        if (!refreshed.data.success) {
                            throw new Error(
                                "Migration succeeded, but expenses could not be reloaded."
                            );
                        }

                        serverExpenses = refreshed.data.expenses || [];

                        setExpenseMessage(
                            `${migrationResponse.data.count} old expense record(s) migrated.`
                        );
                    }
                }

                if (!cancelled) {
                    setExpenses(serverExpenses);
                }
            } catch (err) {
                if (!cancelled) {
                    setExpenseError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to load expenses from MongoDB."
                    );
                }
            } finally {
                if (!cancelled) setExpensesLoading(false);
            }
        }

        loadExpensesAndMigrate();

        return () => {
            cancelled = true;
        };
    }, [vendorId]);

    const stats = dashboardData?.stats || {};
    const bookings = dashboardData?.bookings || [];
    const revenue = Number(stats.revenue || 0);

    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
    );

    const netProfit = revenue - totalExpenses;

    const tabs = [
        { name: "Overview", icon: "▦" },
        { name: "My Bookings", icon: "▣" },
        { name: "My Profile", icon: "♙" },
        { name: "Profit & Loss", icon: "₹" },
    ];

    async function addExpense(event) {
        event.preventDefault();
        setExpenseError("");
        setExpenseMessage("");

        const cleanDescription = description.trim();
        const expenseAmount = Number(amount);

        if (
            !cleanDescription ||
            cleanDescription.length > 200 ||
            !Number.isFinite(expenseAmount) ||
            expenseAmount <= 0
        ) {
            setExpenseError("Enter a valid description and amount.");
            return;
        }

        if (!vendorId) {
            setExpenseError("Vendor ID not found. Please log in again.");
            return;
        }

        setExpenseBusy(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/expenses/${vendorId}`,
                {
                    description: cleanDescription,
                    amount: expenseAmount,
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to save expense."
                );
            }

            setExpenses((previous) => [
                response.data.expense,
                ...previous,
            ]);

            setDescription("");
            setAmount("");
            setExpenseMessage("Expense saved to MongoDB successfully.");
        } catch (err) {
            setExpenseError(
                err.response?.data?.message ||
                err.message ||
                "Unable to save expense."
            );
        } finally {
            setExpenseBusy(false);
        }
    }

    async function deleteExpense(id) {
        setExpenseError("");
        setExpenseMessage("");

        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        setExpenseBusy(true);

        try {
            const response = await axios.delete(
                `${API_URL}/api/expenses/${vendorId}/${id}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to delete expense."
                );
            }

            setExpenses((previous) =>
                previous.filter((expense) => expense._id !== id)
            );

            setExpenseMessage("Expense deleted successfully.");
        } catch (err) {
            setExpenseError(
                err.response?.data?.message ||
                err.message ||
                "Unable to delete expense."
            );
        } finally {
            setExpenseBusy(false);
        }
    }

    async function refreshDashboard() {
        if (!vendorId) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${API_URL}/api/vendor-dashboard/${vendorId}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to refresh dashboard."
                );
            }

            setDashboardData(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to refresh dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    async function refreshExpenses() {
        if (!vendorId) return;

        setExpensesLoading(true);
        setExpenseError("");

        try {
            const response = await axios.get(
                `${API_URL}/api/expenses/${vendorId}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to refresh expenses."
                );
            }

            setExpenses(response.data.expenses || []);
        } catch (err) {
            setExpenseError(
                err.response?.data?.message ||
                err.message ||
                "Unable to refresh expenses."
            );
        } finally {
            setExpensesLoading(false);
        }
    }

    return (
        <div className="vd-page">
            <aside className="vd-sidebar">
                <h2>EventHub</h2>
                <p className="vd-sidebar-label">VENDOR PANEL</p>

                <nav>
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.name}
                            className={`vd-nav-item ${
                                activeTab === tab.name ? "active" : ""
                            }`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="vd-sidebar-bottom">
                    <span>Vendor Account</span>
                    <strong>{vendor.name || "Vendor"}</strong>
                </div>
            </aside>

            <main className="vd-main">
                <header className="vd-header">
                    <div>
                        <h1>{activeTab}</h1>
                        <p>Manage your event business in one place.</p>
                    </div>

                    <div className="vd-avatar">
                        {(vendor.name || "V").charAt(0).toUpperCase()}
                    </div>
                </header>

                {error && (
                    <section className="vd-card vd-section">
                        <h3>Dashboard connection issue</h3>
                        <p className="vd-empty">{error}</p>
                        <button
                            type="button"
                            className="vd-expense-form-button"
                            onClick={refreshDashboard}
                        >
                            Try Again
                        </button>
                    </section>
                )}

                {loading && (
                    <section className="vd-card vd-section">
                        <p className="vd-empty">Loading your dashboard...</p>
                    </section>
                )}

                {!loading && !error && dashboardData && (
                    <>
                        {dashboardData.message && (
                            <section className="vd-card vd-section">
                                <p className="vd-empty">
                                    {dashboardData.message}
                                </p>
                            </section>
                        )}

                        {activeTab === "Overview" && (
                            <>
                                <section className="vd-welcome">
                                    <h2>
                                        Welcome back, {vendor.name || "Vendor"}! 👋
                                    </h2>
                                    <p>
                                        Here's your latest business overview.
                                    </p>
                                </section>

                                <section className="vd-stats">
                                    <article className="vd-card">
                                        <span>Total Bookings</span>
                                        <h2>{stats.totalBookings ?? 0}</h2>
                                        <small>Bookings containing your listing</small>
                                    </article>

                                    <article className="vd-card">
                                        <span>Pending Bookings</span>
                                        <h2>{stats.pendingBookings ?? 0}</h2>
                                        <small>Awaiting confirmation</small>
                                    </article>

                                    <article className="vd-card">
                                        <span>Confirmed Bookings</span>
                                        <h2>{stats.confirmedBookings ?? 0}</h2>
                                        <small>Confirmed event bookings</small>
                                    </article>

                                    <article className="vd-card">
                                        <span>Recorded Revenue</span>
                                        <h2>{formatMoney(revenue)}</h2>
                                        <small>From completed payments</small>
                                    </article>
                                </section>

                                <section className="vd-card vd-section">
                                    <h3>Recent Bookings</h3>
                                    {bookings.length === 0 ? (
                                        <p className="vd-empty">
                                            No bookings found for your linked vendor listing.
                                        </p>
                                    ) : (
                                        <BookingTable bookings={bookings.slice(0, 5)} />
                                    )}
                                </section>
                            </>
                        )}

                        {activeTab === "My Bookings" && (
                            <section className="vd-card vd-section">
                                <div className="vd-booking-heading">
                                    <h3>My Bookings</h3>
                                    <button
                                        type="button"
                                        onClick={refreshDashboard}
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {bookings.length === 0 ? (
                                    <p className="vd-empty">
                                        No bookings are currently available for your listing.
                                    </p>
                                ) : (
                                    <BookingTable bookings={bookings} />
                                )}
                            </section>
                        )}

                        {activeTab === "My Profile" && (
                            <section className="vd-card vd-section vd-profile">
                                <div className="vd-profile-avatar">
                                    {(vendor.name || "V").charAt(0).toUpperCase()}
                                </div>

                                <h2>{vendor.name || "Vendor"}</h2>
                                <p>{vendor.email || "Email unavailable"}</p>

                                <div className="vd-profile-row">
                                    <span>Account Role</span>
                                    <strong>{vendor.role || "vendor"}</strong>
                                </div>

                                <div className="vd-profile-row">
                                    <span>Vendor Status</span>
                                    <strong>{vendor.vendorStatus || "Unavailable"}</strong>
                                </div>

                                <div className="vd-profile-row">
                                    <span>Linked Listing ID</span>
                                    <strong>
                                        {vendor.vendorListingId ?? "Not linked"}
                                    </strong>
                                </div>

                                <p className="vd-hint">
                                    Profile details are read-only in this version.
                                </p>
                            </section>
                        )}

                        {activeTab === "Profit & Loss" && (
                            <>
                                <section className="vd-stats">
                                    <article className="vd-card">
                                        <span>Revenue</span>
                                        <h2>{formatMoney(revenue)}</h2>
                                        <small>Recorded completed payments</small>
                                    </article>

                                    <article className="vd-card">
                                        <span>Expenses</span>
                                        <h2>{formatMoney(totalExpenses)}</h2>
                                        <small>Expenses saved in MongoDB</small>
                                    </article>

                                    <article className="vd-card">
                                        <span>Net Profit / Loss</span>
                                        <h2 className={netProfit < 0 ? "vd-loss" : ""}>
                                            {formatMoney(netProfit)}
                                        </h2>
                                        <small>Revenue minus recorded expenses</small>
                                    </article>
                                </section>

                                <section className="vd-card vd-section">
                                    <h3>Add Business Expense</h3>

                                    <form
                                        className="vd-expense-form"
                                        onSubmit={addExpense}
                                    >
                                        <input
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(event.target.value)
                                            }
                                            placeholder="Expense description"
                                            maxLength={200}
                                            required
                                        />

                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={amount}
                                            onChange={(event) =>
                                                setAmount(event.target.value)
                                            }
                                            placeholder="Amount (₹)"
                                            required
                                        />

                                        <button
                                            type="submit"
                                            disabled={expenseBusy}
                                        >
                                            {expenseBusy ? "Please wait..." : "Add Expense"}
                                        </button>
                                    </form>

                                    {expenseError && (
                                        <p className="vd-loss">{expenseError}</p>
                                    )}

                                    {expenseMessage && (
                                        <p className="vd-hint">{expenseMessage}</p>
                                    )}

                                    <p className="vd-hint">
                                        Expenses are saved to your MongoDB database.
                                    </p>
                                </section>

                                <section className="vd-card vd-section">
                                    <div className="vd-booking-heading">
                                        <h3>Expense History</h3>
                                        <button
                                            type="button"
                                            onClick={refreshExpenses}
                                            disabled={expensesLoading}
                                        >
                                            {expensesLoading ? "Loading..." : "Refresh"}
                                        </button>
                                    </div>

                                    {expensesLoading ? (
                                        <p className="vd-empty">
                                            Loading expenses...
                                        </p>
                                    ) : expenses.length === 0 ? (
                                        <p className="vd-empty">
                                            No expenses added yet.
                                        </p>
                                    ) : (
                                        <div className="vd-table-wrap">
                                            <table className="vd-table">
                                                <thead>
                                                <tr>
                                                    <th>Description</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Action</th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {expenses.map((expense) => (
                                                    <tr key={expense._id}>
                                                        <td>{expense.description}</td>
                                                        <td>{formatDate(expense.date)}</td>
                                                        <td>{formatMoney(expense.amount)}</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                disabled={expenseBusy}
                                                                onClick={() =>
                                                                    deleteExpense(expense._id)
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

function BookingTable({ bookings }) {
    return (
        <div className="vd-table-wrap">
            <table className="vd-table">
                <thead>
                <tr>
                    <th>Event</th>
                    <th>Customer</th>
                    <th>Start Date</th>
                    <th>Vendor Amount</th>
                    <th>Booking Status</th>
                    <th>Payment</th>
                </tr>
                </thead>

                <tbody>
                {bookings.map((booking) => (
                    <tr key={booking._id}>
                        <td>{booking.eventType || "Event"}</td>
                        <td>{booking.customerName || "Customer"}</td>
                        <td>{formatDate(booking.startDate)}</td>
                        <td>{formatMoney(booking.vendorAmount)}</td>
                        <td>{booking.bookingStatus || "Pending"}</td>
                        <td>{booking.paymentStatus || "Pending"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
