import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/admin/systemLogs.css";

const API_URL = "http://localhost:5000/api/admin/system-logs";

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [refreshing, setRefreshing] = useState(false);

    const fetchLogs = async () => {
        try {
            setError("");
            setRefreshing(true);

            const response = await axios.get(API_URL);

            if (response.data.success) {
                setLogs(response.data.logs || []);
            } else {
                setError("Unable to load system logs.");
            }
        } catch (err) {
            console.error("System Logs Error:", err);
            setError("Failed to load system logs. Check the backend server.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const searchText = search.toLowerCase();

            const matchesSearch = [
                log.method,
                log.endpoint,
                log.level,
                String(log.statusCode)
            ].some((value) =>
                String(value || "").toLowerCase().includes(searchText)
            );

            const matchesLevel =
                levelFilter === "all" || log.level === levelFilter;

            return matchesSearch && matchesLevel;
        });
    }, [logs, search, levelFilter]);

    const errorCount = logs.filter(
        (log) => log.level === "error"
    ).length;

    const warningCount = logs.filter(
        (log) => log.level === "warning"
    ).length;

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    return (
        <div className="system-logs-page">
            <div className="system-logs-header">
                <div>
                    <span className="system-logs-eyebrow">
                        SYSTEM MONITORING
                    </span>
                    <h1>System Logs</h1>
                    <p>
                        Monitor API requests, response statuses and
                        server activity.
                    </p>
                </div>

                <button
                    className="system-logs-refresh"
                    onClick={fetchLogs}
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "↻ Refresh Logs"}
                </button>
            </div>

            <div className="system-logs-stats">
                <div className="system-log-stat">
                    <span>Total Logs</span>
                    <strong>{logs.length}</strong>
                    <small>Recorded requests</small>
                </div>

                <div className="system-log-stat">
                    <span>Successful Requests</span>
                    <strong>
                        {logs.filter(
                            (log) => log.statusCode >= 200 &&
                                log.statusCode < 400
                        ).length}
                    </strong>
                    <small>2xx and 3xx responses</small>
                </div>

                <div className="system-log-stat">
                    <span>Warnings</span>
                    <strong>{warningCount}</strong>
                    <small>Client-side errors</small>
                </div>

                <div className="system-log-stat">
                    <span>Server Errors</span>
                    <strong>{errorCount}</strong>
                    <small>5xx responses</small>
                </div>
            </div>

            <div className="system-logs-content">
                <div className="system-logs-toolbar">
                    <div>
                        <h2>Activity Records</h2>
                        <p>{filteredLogs.length} records found</p>
                    </div>

                    <div className="system-logs-filters">
                        <input
                            type="text"
                            placeholder="Search endpoint, method, status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            <option value="all">All Levels</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="system-logs-message">
                        Loading system logs...
                    </div>
                ) : error ? (
                    <div className="system-logs-message system-logs-error">
                        {error}
                        <button onClick={fetchLogs}>Try Again</button>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="system-logs-message">
                        No system logs found.
                    </div>
                ) : (
                    <div className="system-logs-table-wrap">
                        <table className="system-logs-table">
                            <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Method</th>
                                <th>Endpoint</th>
                                <th>Status</th>
                                <th>Duration</th>
                                <th>Level</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log._id}>
                                    <td className="system-log-date">
                                        {formatDate(log.createdAt)}
                                    </td>

                                    <td>
                                            <span
                                                className={`system-log-method method-${String(
                                                    log.method || "unknown"
                                                ).toLowerCase()}`}
                                            >
                                                {log.method || "—"}
                                            </span>
                                    </td>

                                    <td className="system-log-endpoint">
                                        {log.endpoint}
                                    </td>

                                    <td>
                                            <span
                                                className={`system-log-status ${
                                                    log.statusCode >= 500
                                                        ? "status-error"
                                                        : log.statusCode >= 400
                                                            ? "status-warning"
                                                            : "status-success"
                                                }`}
                                            >
                                                {log.statusCode}
                                            </span>
                                    </td>

                                    <td>{log.duration} ms</td>

                                    <td>
                                            <span
                                                className={`system-log-level level-${log.level}`}
                                            >
                                                {log.level}
                                            </span>
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
};

export default SystemLogs;
