
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [overview, setOverview] = useState(null);
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [overviewError, setOverviewError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const menuItems = [
        { name: "Overview", icon: "▦" },
        { name: "Vendor Management", icon: "◈" },
        { name: "Customer Management", icon: "♙" },
        { name: "Booking Management", icon: "▣" },
        { name: "Financials", icon: "₹" },
        { name: "Vendor Payouts", icon: "↗" },
        { name: "Refunds", icon: "↩" },
        { name: "Ledger", icon: "▤" },
        { name: "System Logs", icon: "◌" },
    ];

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setOverviewLoading(true);
                setOverviewError("");

                const response = await fetch(
                    "http://localhost:5000/api/admin/overview"
                );
                const result = await response.json();

                if (!response.ok || result.success !== true) {
                    throw new Error(
                        result.message || "Failed to load overview"
                    );
                }

                setOverview(
                    result.stats ||
                    result.data?.stats ||
                    result.data ||
                    null
                );
            } catch (error) {
                setOverviewError(
                    error.message || "Could not connect to server"
                );
            } finally {
                setOverviewLoading(false);
            }
        };

        fetchOverview();
    }, []);

    const formatNumber = (value) =>
        (Number(value) || 0).toLocaleString("en-IN");

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);

    const getMonthlyChange = (current, previous) => {
        const now = Number(current) || 0;
        const before = Number(previous) || 0;

        if (before === 0) {
            return now > 0 ? "New this month" : "No change";
        }

        const change = ((now - before) / before) * 100;

        if (change === 0) return "0.0% vs last month";

        return `${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% vs last month`;
    };

    const handleMenuClick = (menu) => {
        setSidebarOpen(false);

        const routes = {
            Overview: "/admin/dashboard",
            "Vendor Management": "/admin/vendors",
            "Customer Management": "/admin/customers",
            "Booking Management": "/admin/bookings",
            Financials: "/admin/financials",
            "Vendor Payouts": "/admin/payouts",
            Refunds: "/admin/refunds",
            Ledger: "/admin/ledger",
            "System Logs": "/admin/logs",
        };

        if (routes[menu]) {
            setActiveMenu(menu);
            navigate(routes[menu]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const goToWebsite = () => navigate("/");

    const stats = [
        {
            title: "Total Vendors",
            icon: "◈",
            value: overview?.totalVendors,
            current: overview?.thisMonth?.vendors,
            previous: overview?.previousMonth?.vendors,
        },
        {
            title: "Total Customers",
            icon: "♙",
            value: overview?.totalCustomers,
            current: overview?.thisMonth?.customers,
            previous: overview?.previousMonth?.customers,
        },
        {
            title: "Total Bookings",
            icon: "▣",
            value: overview?.totalBookings,
            current: overview?.thisMonth?.bookings,
            previous: overview?.previousMonth?.bookings,
        },
        {
            title: "Total Paid Booking Amount",
            icon: "₹",
            value: overview?.platformRevenue,
            current: overview?.thisMonth?.revenue,
            previous: overview?.previousMonth?.revenue,
            revenue: true,
        },
    ];

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside
                className={`admin-sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >
                <div className="admin-brand">
                    <div className="admin-brand-mark">EH</div>
                    <div>
                        <h2>Event Hub</h2>
                        <span>Administration</span>
                    </div>
                </div>

                <div className="sidebar-section-title">MANAGEMENT</div>

                <nav className="admin-navigation">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={`admin-nav-item ${
                                activeMenu === item.name ? "active" : ""
                            }`}
                            onClick={() => handleMenuClick(item.name)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        className="visit-site-btn"
                        onClick={goToWebsite}
                    >
                        <span>↗</span>
                        Visit Event Hub
                    </button>

                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        <span>⇥</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* MAIN AREA */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setSidebarOpen(true)}
                        >
                            ☰
                        </button>

                        <div>
                            <p className="header-eyebrow">
                                ADMINISTRATION
                            </p>
                            <h1>{activeMenu}</h1>
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="notification-btn">
                            ♢
                            <span />
                        </button>

                        <div className="admin-profile">
                            <div className="admin-avatar">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "A"}
                            </div>

                            <div className="admin-profile-info">
                                <strong>
                                    {user?.name || "Event Hub Owner"}
                                </strong>
                                <small>Super Admin</small>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="admin-content">
                    {/* WELCOME */}
                    <div className="admin-welcome">
                        <div>
                            <p className="section-kicker">OVERVIEW</p>
                            <h2>
                                Good to see you,{" "}
                                {user?.name?.split(" ")[0] || "Owner"}.
                            </h2>
                            <p>
                                Here's what's happening across Event Hub
                                today.
                            </p>
                        </div>

                        <div className="date-badge">
                            <span>Today</span>
                            <strong>
                                {new Date().toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </strong>
                        </div>
                    </div>

                    {/* API ERROR */}
                    {overviewError && (
                        <div
                            role="alert"
                            style={{
                                color: "#b91c1c",
                                background: "#fee2e2",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                marginBottom: "16px",
                            }}
                        >
                            Failed to load overview: {overviewError}
                            <button
                                onClick={() => window.location.reload()}
                                style={{ marginLeft: "12px" }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* DYNAMIC STATS */}
                    <div className="admin-stats">
                        {stats.map((stat) => (
                            <div
                                className={`stat-card ${
                                    stat.revenue ? "stat-revenue" : ""
                                }`}
                                key={stat.title}
                            >
                                <div className="stat-top">
                                    <span>{stat.title}</span>
                                    <div className="stat-icon">
                                        {stat.icon}
                                    </div>
                                </div>

                                <h3>
                                    {overviewLoading
                                        ? "..."
                                        : stat.revenue
                                            ? formatCurrency(stat.value)
                                            : formatNumber(stat.value)}
                                </h3>

                                <p className="stat-positive">
                                    {overviewLoading
                                        ? "Loading..."
                                        : getMonthlyChange(
                                            stat.current,
                                            stat.previous
                                        )}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* MAIN GRID */}
                    <div className="admin-dashboard-grid">
                        {/* FINANCIAL OVERVIEW - CHART RESTORED */}
                        <div className="dashboard-panel financial-panel">
                            <div className="panel-header">
                                <div>
                                    <p className="panel-kicker">
                                        PERFORMANCE
                                    </p>
                                    <h3>Financial Overview</h3>
                                </div>

                                <span className="period-select">
                                    All-time paid bookings
                                </span>
                            </div>

                            <div className="chart-area">
                                <div className="chart-y-axis">
                                    <span>Revenue</span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span>₹0</span>
                                </div>

                                <div className="chart">
                                    <div className="chart-grid-line line-1"></div>
                                    <div className="chart-grid-line line-2"></div>
                                    <div className="chart-grid-line line-3"></div>
                                    <div className="chart-grid-line line-4"></div>
                                    <div className="chart-grid-line line-5"></div>

                                    <svg
                                        viewBox="0 0 600 230"
                                        preserveAspectRatio="none"
                                        className="revenue-chart"
                                    >
                                        <defs>
                                            <linearGradient
                                                id="chartFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#F97316"
                                                    stopOpacity="0.25"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#F97316"
                                                    stopOpacity="0"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <path
                                            d="M0 190 C50 180 65 155 100 165 C140 175 155 125 200 135 C240 145 255 105 300 115 C345 125 360 75 400 90 C440 105 455 55 500 70 C540 85 560 35 600 45 L600 230 L0 230 Z"
                                            fill="url(#chartFill)"
                                        />

                                        <path
                                            d="M0 190 C50 180 65 155 100 165 C140 175 155 125 200 135 C240 145 255 105 300 115 C345 125 360 75 400 90 C440 105 455 55 500 70 C540 85 560 35 600 45"
                                            fill="none"
                                            stroke="#F97316"
                                            strokeWidth="3"
                                        />
                                    </svg>

                                    <div className="chart-months">
                                        <span>May</span>
                                        <span>Jun</span>
                                        <span>Jul</span>
                                        <span>Aug</span>
                                        <span>Sep</span>
                                        <span>Oct</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: "0 20px 20px" }}>
                                <strong>
                                    {overviewLoading
                                        ? "Loading..."
                                        : formatCurrency(
                                            overview?.platformRevenue
                                        )}
                                </strong>
                                <p>Completed booking payments</p>
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="dashboard-panel quick-panel">
                            <div className="panel-header">
                                <div>
                                    <p className="panel-kicker">SHORTCUTS</p>
                                    <h3>Quick Actions</h3>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <button
                                    onClick={() =>
                                        handleMenuClick("Vendor Management")
                                    }
                                >
                                    <span>◈</span>
                                    <div>
                                        <strong>Review Vendors</strong>
                                        <small>Open vendor management</small>
                                    </div>
                                    <b>→</b>
                                </button>

                                <button
                                    onClick={() =>
                                        handleMenuClick("Booking Management")
                                    }
                                >
                                    <span>▣</span>
                                    <div>
                                        <strong>Manage Bookings</strong>
                                        <small>View all bookings</small>
                                    </div>
                                    <b>→</b>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LOWER GRID */}
                    <div className="admin-lower-grid">
                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <p className="panel-kicker">
                                        ACTION REQUIRED
                                    </p>
                                    <h3>Pending Vendor Approvals</h3>
                                </div>

                                <button
                                    className="text-link"
                                    onClick={() =>
                                        handleMenuClick("Vendor Management")
                                    }
                                >
                                    View all →
                                </button>
                            </div>

                            <div className="approval-list">
                                <div className="approval-item">
                                    <div className="vendor-mini-avatar">
                                        EH
                                    </div>
                                    <div className="approval-info">
                                        <strong>Vendor approvals</strong>
                                        <span>
                                            Open Vendor Management to review
                                            applications and their status.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <p className="panel-kicker">SYSTEM</p>
                                    <h3>Recent Activity</h3>
                                </div>

                                <button
                                    className="text-link"
                                    onClick={() =>
                                        handleMenuClick("System Logs")
                                    }
                                >
                                    View logs →
                                </button>
                            </div>

                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-dot orange"></span>
                                    <div>
                                        <strong>System activity</strong>
                                        <p>
                                            Open System Logs to view recorded
                                            application events.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="admin-footer-note">
                        <span>Event Hub Administration</span>
                        <span>Secure management console · v1.0</span>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;
