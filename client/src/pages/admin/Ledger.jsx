import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/admin/ledger.css";

const API_URL = "http://localhost:5000/api/admin/ledger";
const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

function Ledger() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        totalCredits: 0,
        totalDebits: 0,
        netBalance: 0,
        totalTransactions: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [period, setPeriod] = useState("All");

    const fetchLedger = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to load ledger."
                );
            }

            setTransactions(response.data.transactions || []);
            setSummary({
                totalCredits: Number(
                    response.data.summary?.totalCredits
                ) || 0,
                totalDebits: Number(
                    response.data.summary?.totalDebits
                ) || 0,
                netBalance: Number(
                    response.data.summary?.netBalance
                ) || 0,
                totalTransactions: Number(
                    response.data.summary?.totalTransactions
                ) || 0,
            });
        } catch (err) {
            console.error("Ledger Error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load ledger records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const filteredTransactions = useMemo(() => {
        const term = search.trim().toLowerCase();
        const now = new Date();

        return transactions.filter((transaction) => {
            const matchesSearch =
                !term ||
                [
                    transaction.id,
                    transaction.referenceId,
                    transaction.description,
                    transaction.category,
                    transaction.customer,
                    transaction.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(term);

            const matchesType =
                typeFilter === "All" ||
                transaction.type === typeFilter;

            let matchesPeriod = true;

            if (period !== "All" && transaction.date) {
                const date = new Date(transaction.date);

                if (Number.isNaN(date.getTime())) {
                    matchesPeriod = false;
                } else if (period === "Month") {
                    matchesPeriod =
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();
                } else if (period === "Year") {
                    matchesPeriod =
                        date.getFullYear() === now.getFullYear();
                }
            } else if (period !== "All" && !transaction.date) {
                matchesPeriod = false;
            }

            return matchesSearch && matchesType && matchesPeriod;
        });
    }, [transactions, search, typeFilter, period]);

    return (
        <main className="ledger-page">
            <div className="ledger-container">
                <header className="ledger-header">
                    <div>
                        <div className="ledger-eyebrow">
                            <span />
                            EVENT HUB / FINANCE
                        </div>

                        <h1>
                            Financial <span>Ledger</span>
                        </h1>

                        <p>
                            Track recorded booking payments, refunds,
                            and your overall financial movement.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="ledger-refresh-btn"
                        onClick={fetchLedger}
                        disabled={loading}
                    >
                        <span className={loading ? "ledger-spinning" : ""}>
                            ↻
                        </span>
                        {loading ? "Loading..." : "Refresh Ledger"}
                    </button>
                </header>

                {error && (
                    <div className="ledger-error">
                        <div>
                            <strong>Unable to load financial records</strong>
                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchLedger}
                            disabled={loading}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <section className="ledger-summary-grid">
                    <article className="ledger-summary-card ledger-balance-card">
                        <div className="ledger-card-top">
                            <span>Net Balance</span>
                            <div className="ledger-icon">₹</div>
                        </div>

                        <h2>
                            {loading
                                ? "—"
                                : formatCurrency(summary.netBalance)}
                        </h2>

                        <p>Recorded credits minus recorded refunds</p>
                    </article>

                    <article className="ledger-summary-card">
                        <div className="ledger-card-top">
                            <span>Total Credits</span>
                            <div className="ledger-icon credit-icon">↙</div>
                        </div>

                        <h2 className="ledger-credit-amount">
                            {loading
                                ? "—"
                                : formatCurrency(summary.totalCredits)}
                        </h2>

                        <p>Payments marked completed</p>
                    </article>

                    <article className="ledger-summary-card">
                        <div className="ledger-card-top">
                            <span>Total Debits</span>
                            <div className="ledger-icon debit-icon">↗</div>
                        </div>

                        <h2 className="ledger-debit-amount">
                            {loading
                                ? "—"
                                : formatCurrency(summary.totalDebits)}
                        </h2>

                        <p>Refunds marked refunded</p>
                    </article>

                    <article className="ledger-summary-card">
                        <div className="ledger-card-top">
                            <span>Transactions</span>
                            <div className="ledger-icon">▤</div>
                        </div>

                        <h2>
                            {loading ? "—" : summary.totalTransactions}
                        </h2>

                        <p>Recorded financial entries</p>
                    </article>
                </section>

                <section className="ledger-panel">
                    <div className="ledger-panel-heading">
                        <div>
                            <span className="ledger-section-label">
                                FINANCIAL ACTIVITY
                            </span>

                            <h2>Transaction History</h2>

                            <p>
                                View completed payments and refunded amounts
                                recorded in Event Hub.
                            </p>
                        </div>

                        <span className="ledger-record-count">
                            {filteredTransactions.length} records
                        </span>
                    </div>

                    <div className="ledger-toolbar">
                        <div className="ledger-search">
                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search ID, customer or category..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value)
                            }
                            aria-label="Filter transaction type"
                        >
                            <option value="All">All transactions</option>
                            <option value="Credit">Credits</option>
                            <option value="Debit">Debits</option>
                        </select>

                        <select
                            value={period}
                            onChange={(event) =>
                                setPeriod(event.target.value)
                            }
                            aria-label="Filter transaction period"
                        >
                            <option value="All">All time</option>
                            <option value="Month">This month</option>
                            <option value="Year">This year</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="ledger-state">
                            <div className="ledger-state-icon">↻</div>
                            <h3>Loading your ledger</h3>
                            <p>Fetching financial records from the server.</p>
                        </div>
                    ) : error ? (
                        <div className="ledger-state">
                            <div className="ledger-state-icon">!</div>
                            <h3>Ledger unavailable</h3>
                            <p>Refresh the ledger to try again.</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="ledger-state">
                            <div className="ledger-state-icon">₹</div>
                            <h3>No transactions found</h3>
                            <p>
                                Completed booking payments and refunded
                                transactions will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="ledger-table-wrap">
                            <table className="ledger-table">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Transaction</th>
                                    <th>Description</th>
                                    <th>Customer</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th className="ledger-amount-column">
                                        Amount
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>
                                            {formatDate(transaction.date)}
                                        </td>

                                        <td>
                                                <span className="ledger-transaction-id">
                                                    {transaction.id?.startsWith("PAY-")
                                                        ? "PAY"
                                                        : "REF"}
                                                    -{String(
                                                    transaction.referenceId || ""
                                                ).slice(-6).toUpperCase()}
                                                </span>
                                        </td>

                                        <td>
                                            <div className="ledger-description">
                                                <strong>
                                                    {transaction.category}
                                                </strong>
                                                <span>
                                                        {transaction.description}
                                                    </span>
                                            </div>
                                        </td>

                                        <td>
                                            {transaction.customer || "Customer"}
                                        </td>

                                        <td>
                                                <span
                                                    className={`ledger-type-badge ${
                                                        transaction.type === "Credit"
                                                            ? "credit"
                                                            : "debit"
                                                    }`}
                                                >
                                                    {transaction.type}
                                                </span>
                                        </td>

                                        <td>
                                                <span className="ledger-status-badge">
                                                    <span />
                                                    {transaction.status}
                                                </span>
                                        </td>

                                        <td className="ledger-amount-column">
                                            <strong
                                                className={
                                                    transaction.type === "Credit"
                                                        ? "ledger-credit-amount"
                                                        : "ledger-debit-amount"
                                                }
                                            >
                                                {transaction.type === "Credit"
                                                    ? "+"
                                                    : "−"}
                                                {formatCurrency(transaction.amount)}
                                            </strong>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <footer className="ledger-disclaimer">
                    <span>ⓘ</span>
                    <p>
                        This ledger reflects payment and refund statuses
                        stored in Event Hub. It does not verify bank transfers
                        or represent audited accounts.
                    </p>
                </footer>
            </div>
        </main>
    );
}

export default Ledger;