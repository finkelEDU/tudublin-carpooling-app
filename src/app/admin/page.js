"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";

const BLUE = {
    bg: "#071022",
    panel: "rgba(255,255,255,0.06)",
    panel2: "rgba(255,255,255,0.085)",
    stroke: "rgba(148,184,255,0.20)",
    text: "#EAF2FF",
    mut: "rgba(234,242,255,0.72)",
    mut2: "rgba(234,242,255,0.55)",
    primary: "#2D6BFF",
    primary2: "#3B82F6",
    ok: "#19C37D",
    warn: "#FFB020",
    bad: "#FF4D6D",
};

export default function AdminPage() {
    const [token, setToken] = useState("");
    const [authorized, setAuthorized] = useState(false);
    const [users, setUsers] = useState([]);
    const [pools, setPools] = useState([]);
    const [communications, setCommunications] = useState([]);
    const [audit, setAudit] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [auditLogs, setAuditLogs] = useState(demoAudit);
    const [filterText, setFilterText] = useState("");
    const [sortKey, setSortKey] = useState("name");
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedUserIds, setSelectedUserIds] = useState(new setAudit());
    const [theme, setTheme] = useState("light");
    const [confirmModal, setConfirmModal] = useState({ visible: false, action: null, message: "" });
    const [rideRequests, setRideRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const canQuery = useMemo(() => token.trim().length >= 8, [token]);

    const filteredSortedUsers = useMemo(() => {
        let filtered = users.filter(
            (u) =>
                u.name.toLowerCase().includes(filterText.toLowerCase()) ||
                u.email.toLowerCase().includes(filterText.toLowerCase())
        );
        filtered.sort((a, b) => {
            if (a[sortKey] < b [sortKey]) return sortAsc ? -1: 1;
            if (a[sortKey] > b [sortKey]) return sortAsc ? 1: -1;
            return 0;
        });
        return filtered;
    }, [users, filterText, sortKey, sortAsc]);

    const toggleUserSelection = (id) => {
        setSelectedUserIds((prev) => {
            const newSet = new setAudit(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const bulkDeleteUsers = () => {
        if (selectedUserIds.size === 0) {
            alert("No users selected.");
            return;
        }
        setConfirmModal({
            visible: true,
            action: () => {
                setUsers((prev) => prev.filter((u) => !selectedUserIds.has(u.id)));
                setSelectedUserIds(new Set());
                setConfirmModal({ visible: false, action: null, message: "" });
                showToast('${selectedUserIds.size} user(s) deleted.');
            },
            message: 'Are you sure you want to delete ${selectedUserIds.size} user(s)? This action cannot be undone.',
        });
    };

    const [toast, setToast] = useState({ visible: false, message: "" });
    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: "" }), 3500);
    };

    const toggleTheme = () => {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const saved = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
        if (saved) setToken(saved);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && token) {
            window.localStorage.setItem("admin_token", token);
        }
    }, [token]);

    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.key === "r") {
                e.preventDefault();
                refresh();
            }
            if (e.ctrlKey && e.key === "d") {
                e.preventDefault();
                bulkDeleteUsers();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedUserIds]);

    useEffect(() => {
        fetchRideRequests();
    }, []);

    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin", {
                headers: {
                    Authorization: 'Bearer ${ADMIN_TOKEN}',
                },
            });
            if (!res.ok) throw new Error("Failed to fetch admin data");
            const data = await res.json();
            setUsers(data.users);
            setPools(data.pools);
            setCommunications(data.communications);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function sendData(method, body) {
        setError(null);
        try {
            const res = await fetch("/api/admin", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ${ADMIN_TOKEN}',
                },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(e.error || "Request failed");
            }
            return await res.json();
        } catch (e) {
            setError(e.message);
            return null;
        }
    }

    async function addUser() {
        const name = prompt("Enter user name:");
        const email = prompt("Enter user email:");
        if (name && email) {
            const newUser = await sendData("POST", { type: "user", name, email });
            if (newUser) setUsers([...users, newUser]);
        }
    }

    async function deleteUser(id) {
        setError(null);
        try {
            const res = await fetch("/api/admin?id=${id}&type=user", {
                method: "DELETE",
                headers: { Authorization: "Bearer ${ADMIN_TOKEN}" },
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Delete failed");
            }
            setUsers(users.filter(u => u.id !== id));
        } catch (e) {
            setError(e.message);
        }
    }

    async function loadDashboard() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin", {
                headers: { Authorization: 'Bearer ${token}' },
                cache: "no-store",
            });

            if (res.status === 401) {
                setAuthorized(false);
                setUsers([]);
                setAudit([]);
                return;
            }

            const data = await res.json();
            setAuthorized(true);
            setUsers(data.users || []);
            setAudit(data.audit || []);
        } finally {
            setLoading(false);
        }
    }

    async function fetchRideRequests() {
        try{
            const res = await fetch('/api/admin/rides');
            if (res.ok) {
                const data = await res.json();
                setRideRequests(data.requests);
            }
        } catch (error) {
            console.error("Failed to fetch ride requests", error);
        }
    }

    async function handleRideRequest(id, action) {
        try {
            const res = await fetch(`/api/admin/rides/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                fetchRideRequests();
                addNotification(`Ride request ${id} ${action}d.`);
            }
        } catch (error) {
            console.error(`Failed to ${action} ride request`, error);
        }
    }

    async function refresh() {
        if (!canQuery) return;
        await loadDashboard();
        await fetchData();
    }

    return (
        <main
        style={{
            minHeight: "100vh",
            color: BLUE.text,
            background: `
            radial-gradient(920px 560px at 16% 8%, rgba(45,107,255,0.22), transparent 55%),
            radial-gradient(860px 520px at 92% 18%, rgba(59,130,246,0.18), transparent 60%),
            linear-gradient(180deg, ${BLUE.bg}, #050A14)
            `,
        }}
        >
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 18px 44px"}}>
                <header
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                    marginBottom: 18,
                }}
                >
                    <div style={{ display: "grid", gap: 6 }}>
                        <h1 style={{ margin: 0, fontSize: "clamp(22px, 3.2vw, 34px)", letterSpacing: -0.6 }}>
                            Admin Console
                        </h1>
                        <p style={{ margin: 0, color: BLUE.mut, maxWidth: 76 * 10 }}>
                            Lightweightr admin view for a carpool app. Use the token field below to access admin-only API data.
                        </p>
                    </div>

                    <nav aria-label="Admin navigation" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Link href="/emergency" style={navLinkStyle()}>
                        Emergency
                        </Link>
                        <Link href="/" style={navLinkStyle()}>
                        Home
                        </Link>
                    </nav>
                </header>

                <section
                style={{
                    display: "grid",
                    gridTemplateColumns: "0.95fr 1.05fr",
                    gap: 16,
                    alignItems: "start",
                }}
                >
                    <article style={panelStyle()}>
                        <h2 style={h2Style}>Users</h2>
                        <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        style={inputStyle}
                        aria-label="Search users"
                    />
                    <div style={{ marginBottom: 12 }}>
                        <button
                        onClick={() => {
                            setSortKey("name");
                            setSortAsc((asc) => (sortKey === "name" ? !asc : true));
                        }}
                        style={buttonStyle}
                        >
                            Sort by Name {sortKey === "name" ? (sortAsc ? "1" : "0") : ""}
                        </button>
                        <button
                        onClick={() => {
                            setSortKey("email");
                            setSortAsc((asc) => (sortKey === "email" ? !asc : true));
                        }}
                        style={buttonStyle}
                        >
                            Sort by Email {sortKey === "email" ? (sortAsc ? "1" : "0") : ""}
                        </button>
                        <button onClick={bulkDeleteUsers} style={{ ...buttonStyle, backgroundColor: "#d9534f"}}>
                            Delete Selected
                        </button>
                        <button onClick={refresh} style={buttonStyle}>
                            Refresh Data
                        </button>
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelectedUserIds(
                                            e.target.checked ? new Set(users.map((u) => u.id)) : new Set()
                                        )
                                    }
                                    checked={selectedUserIds.size === users.length && users.length > 0}
                                    ara-label="Select all users"
                                    />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSortedUsers.map((user) => (
                                <tr key={user.id} style={{ borderBottom: "1px solid #ccc" }}>
                                    <td>
                                        <input
                                        type="checkbox"
                                        checked={selectedUserIds.has(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                        aria-label={'Select user ${user.name}'}
                                    />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                        <td>
                                            <Pill>{user.role}</Pill>
                                        </td>
                                        <td>
                                            <button
                                            onClick={() => {
                                                setConfirmModal({
                                                    visible: true,
                                                    action: () => {
                                                        setUsers((prev) => prev.filter((u) => u.id !== user.id));
                                                        setSelectedUserIds((prev) => {
                                                            const newSet = new Set(prev);
                                                            newSet.delete(user.id);
                                                            return newSet;
                                                        });
                                                        setConfirmModal({ visible: false, action: null, message: "" });
                                                        showToast('User ${user.name} deleted.');
                                                    },
                                                    message: 'Are you sure you want to delete user "${user.name}"? This action cannot be undone.',
                                                });
                                            }}
                                            style={{ ...buttonStyle, backgroundColor: "#d9534f", fontSize: 14, padding: "6px 12px" }}
                                            aria-label={'Delete user ${user.name}'}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSortedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                                            No Users Found.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                    </article>

                    <article style={panelStyle()}>
                        <h2 style={h2Style()}>Authentication</h2>
                        <p style={{ margin: "8px 0 0", color: BLUE.mut }}>
                            For a real app, you would use NextAuth or your own auth and role-based access control, with this page using a simple Bearer token to demonstrate the pattern.
                        </p>

                        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                            <label style={{ display: "grid", gap: 8 }}>
                                <span style={{ fontSize: 13, color: BLUE.mut }}>Admin token</span>
                                <input
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste token... (min 8 chars)"
                                style={inputStyle()}
                                />
                            </label>

                            <div style={{ display: "flex", gap: 10,  flexWrap: "wrap", alignItems: "center" }}>
                                <button
                                onClick={refresh}
                                disabled={!canQuery || loading}
                                style={buttonStyle("primary", !canQuery || locading)}
                                >
                                    {loading ? "Loading..." : "Load dashboard"}
                                </button>

                                <button
                                onClick={() => {
                                    setToken("");
                                    setAuthorized(false);
                                    setUsers([]);
                                    setAudit([]);
                                    if (typeof window !== "undefined") window.localStorage.removeItem("admin_token");
                                }}
                                style={buttonStyle("ghost")}
                                >
                                    Clear token
                                </button>

                                <span style={{ marginLeft: "auto" }}>{authorized ? <Pill tone="ok">authorized</Pill> : <Pill tone="warn">Not authorized</Pill>}</span>
                            </div>

                            {!authorized ? (
                                <div style={calloutStyle("warn")}>
                                    <strong style={{ color: BLUE.text }}>Note:</strong>{" "}
                                    <span style={{ color: BLUE.mut }}>
                                        You'll get a 401 until your provide the correct token. Set{" "}
                                    </span>
                                </div>
                            ) : (
                                <div style={calloutStyle("ok")}>
                                    <strong style={{ color: BLUE.text }}>Access granted.</strong>{" "}
                                    <span style={{ color: BLUE.mut }}>Data below is coming from <code style={getComputedStyle()}>/api/admin</code>.</span>
                                </div>
                            )}
                        </div>
                    </article>

                    <article style={panelStyle()}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                            <h2 style={h2Style()}>Overview</h2>
                            <span style={{ fontSize: 12, color: BLUE.mut2 }}>
                                {authorized ? "Protected data" : "Waiting for auth"}
                            </span>
                        </div>

                        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
                            <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 12,
                            }}
                            >
                                <Metric label="Users" value={authorized ? users.length : "-"} />
                                <Metric label="Audit events" value={authorized ? audit.length : "-"} />
                                <Metric label="Status" value={authorized ? "Online" : "locked"} tone={authorized ? "ok" : "warn"}/>
                            </div>

                            <div style={{ display: "grid", gap: 10 }}>
                                <h3 style={{ margin: 0, fontSize: 14, letterSpacing: 0.2, color: BLUE.mut }}>Recent audit</h3>
                                <div style={{ display: "grid", gap: 10 }}>
                                    {(authorized ? audit : demoAudit()).slice(0, 5).map((e) => (
                                        <div
                                        key={e.id}
                                        style={{
                                            padding: 12,
                                            borderRadius: 16,
                                            border: "1px solid ${BLUE.stroke}",
                                            background: "rgba(255,255,255,0.04)",
                                            display: "grid",
                                            gap: 6,
                                        }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                                <span style={{ fontWeight: 700 }}>{e.action}</span>
                                                <Pill tone={e.level === "high" ? "warn" : "info"}>{e.level.toUpperCase()}</Pill>
                                            </div>
                                            <div style={{ fontSize: 13, color: BLUE.mut, lineHeight: 1.35 }}>{e.message}</div>
                                            <div style={{ fontSize: 12, color: BLUE.mut2 }}>{new Date(e.ts).toLocaleString()}</div>
                                            </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: "grid", gap: 10 }}>
                                <h3 style={{ margin: 0, fontSize: 14, letterSpacing: 0.2, color: BLUE.mut }}>Users (sample)</h3>
                                <div style={{ display: "grid", gap: 10 }}>
                                    {(authorized ? users : demoUsers()).slice(0, 5).map((u) => (
                                        <div
                                        key={u.id}
                                        style={{
                                            padding: 12,
                                            borderRadius: 16,
                                            border: "1px solid ${BLUE.stroke}",
                                            background: "rgba(255,255,255,0.04)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                        }}
                                        >
                                            <div style={{ display: "grid", gap: 2 }}>
                                                <span style={{ fontWeight: 750 }}>{u.name}</span>
                                                <span style={{ fontSize: 12, color: BLUE.mut2 }}>{u.email}</span>
                                            </div>
                                            <Pill tone={u.role === "admin" ? "info" : "ok"}>{u.role}</Pill>
                                            </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </article>

                    <article style={panelStyle}>
                        <h2 style={h2Style}>Audit Logs</h2>
                        <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", borderRadius: 8, padding: 12 }}>
                            {auditLogs.length === 0 && <p>No Audit Logs Available</p>}
                            {auditLogs.map((log) => (
                                <article key={log.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                                    <p>
                                        <strong>{log.action}</strong> by <em>{log.user}</em>
                                    </p>
                                    <p style={{ fontSize: 12, color: "#666"}}>{new Date(log.date).toLocaleString()}</p>
                                </article>
                            ))}
                        </div>
                    </article>
                </section>

                <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <h2>Carpool Ride Requests</h2>
                    {rideRequests.length === 0 ? (
                        <p>No ride requests at the moment.</p>
                    ) : (
                        <ul>
                            {rideRequests.map(({ id, user, pickup, destination, status }) => (
                                <li key={id} style={{ marginBottom: '1rem' }}>
                                    <strong>{user}</strong> requests a ride from <em>{pickup}</em> to <em>{destination}</em>.
                                    <br />
                                    Status: <strong>{status}</strong>
                                    {status === 'pending' && (
                                        <>
                                            <button onClick={() => handleRideRequest(id, 'approve')} style={{ marginLeft: '1rem' }}>Approve</button>
                                            <button onClick={() => handleRideRequest(id, 'request')} style={{ marginLeft: '0.5rem'}}>Reject</button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc'}}>
                    <h2>Notifications</h2>
                    {notifications.length === 0 ? (
                        <p>No new notifications,</p>
                    ) : (
                        <ul>
                            {notifications.map(({ id, message }) => (
                                <li key={id}>{message}</li>
                            ))}
                        </ul>
                    )}
                </section>

                {confirmModal.visible && (
                <div
                    role="dialog"
                    aria-model="true"
                    aria-labelledby="confirm-dialog-title"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                    style={{
                        backgroundColor: "white",
                        padding: 24,
                        borderRadius: 12,
                        maxWidth: 400,
                        width: "90%",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                    >
                        <h3 id="confirm-dialog-title" style={{ marginBottom: 16 }}>
                            Confirm Action
                        </h3>
                        <p style={{ marginBottom: 24 }}>{confirmModal.message}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                            <button
                            onClick={() => setConfirmModal({ visible: false, action: null, message: "" })}
                            style={{ ...buttonStyle, backgroundColor: "#ccc", color: "#333" }}
                            >
                                Cancel
                            </button>
                            <button
                            onClick={() => {
                                if (confirmModal.action) confirmModal.action();
                            }}
                            style={{ ...buttonStyle, backgroundColor: "#d9534f" }}
                            >
                                Confirm
                            </button>
                            </div>
                        </div>
                    </div>
                )}

                {toast.visible && (
                    <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "fixed",
                        bottom: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: BLUE,
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: 24,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        zIndex: 1000,
                    }}
                    >
                        {toast.message}
                    </div>
                )}

                <style jsx global>{`
                * {
                    box-sizing: border-box;
                    }
                    input,
                    button {
                    font: inherit;
                    }
                    @media (max-width: 980px) {
                        main section {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </div>
        </main>
    );
}

function Metric({ label, value, tone = "info"}) {
    return (
        <div
        style={{
            borderRadius: 18,
            border: "1px solid $(BLUE.stroke)",
            background: "rgba(255,255,255,0.04)",
            padding: 14,
            display: "grid",
            gap: 6,
        }}
        >
            <div style={{ fontSize: 12, color: BLUE.mut2 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{value}</div>
            <div>
                <Pill tone={tone}>{tone === "ok" ? "Good" : tone === "warn" ? "Attention" : "Info"}</Pill>
            </div>
        </div>
    );
}

function Pill({ tone = "info", children }) {
    const map = {
        info: { bg: "rgba(45,107,255,0.14)", bd: "rgba(45,107,255,0.32)" },
        ok: { bg: "rgba(25,195,125,0.14)", bd: "rgba(25,195,125,0.30)" },
        warn: { bg: "rgba(255,176,32,0.14)", bd: "rgba(255,176,32,0.30)" },
        danger: { bg: "rgba(255,77,109,0.14)", bd: "rgba(45,77,109,0.30)" },
    };
    const s = map[tone] || map.info;
    return (
        <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 999,
            background: s.bg,
            border: "1px solid ${s.bd}",
            color: BLUE.text,
            fontSize: 12,
            letterSpacing: 0.2,
            whiteSpace: "nowrap",
        }}
        >
            <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: s.bd }} />
            {children}
        </span>
    );
}

function panelStyle() {
    return {
        borderRadius: 22,
        border: "1px solid  ${BLUE.stroke}",
        background: "linear-gradient(180deg, ${BLUE.panel2}, rgba(255,255,255,0.03))",
        boxShadow: "0 30px 90px rgba(0,0,0,0.30)",
        padding: 18,
        overflow: "hidden",
    };
}

function h2Style() {
    return { margin: 0, fontSize: 18, letterSpacing: -0.2 };
}

function inputStyle() {
    return {
        width: "100%",
        borderRadius: 14,
        border: "1px solid ${BLUE.stroke}",
        background: "rgba(255,255,255,0.04)",
        color: BLUE.text,
        padding: "11px 12px",
        outline: "none",
    };
}

function buttonStyle(variant = "primary", disabled = false) {
    const base = {
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        borderRadius: 14,
        padding: "12px 14px",
        fontWeight: 700,
        letterSpacing: 0.2,
        transition: "transform 160ms ease, filter 160ms ease, box-shadow 160ms ease",
    };
    if (variant === "ghost") {
        return {
            ...base,
            border: "1px solid ${BLUE.stroke}",
            background: "rgba(255,255,255,0.06)",
            color: BLUE.text,
        };
    }
    return {
        ...base,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "linear-gradient(135deg, ${BLUE.primary}, ${BLUE.primary2})",
            color: "#061029",
            boxShadow: "0 10px 30px rgba(13, 40, 110, 0.35)",
    };
}

function navLinkStyle() {
    return {
        color: BLUE.text,
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid ${BLUE.stroke}",
        background: "rgba(255,255,255,0.04)",
    };
}

function calloutStyle(tone = "info") {
    const map = {
       info: { bg: "rgba(45,107,255,0.10)", bd: "rgba(45,107,255,0.26)" },
        ok: { bg: "rgba(25,195,125,0.10)", bd: "rgba(25,195,125,0.24)" },
        warn: { bg: "rgba(255,176,32,0.10)", bd: "rgba(255,176,32,0.24)" },
        danger: { bg: "rgba(255,77,109,0.10)", bd: "rgba(45,77,109,0.24)" }, 
    };
    const s = map[tone] || map.info;
    return {
        padding: 12,
        borderRadius: 16,
        border: "1px solid ${s.bd}",
        background: s.bg,
        color: BLUE.mut,
        lineHeight: 1.35,
    };
}

function codeStyle() {
    return {
        padding: "2px 6px",
        borderRadius: 8,
        border: "1px solid ${BLUE.stroke}",
        background: "rgba(0,0,0,0.25)",
        color: BLUE.text,
        fontSize: 12,
    };
}

function demoUsers() {
    return [
        { id: "u1", name: "Mickey Mouse", email: "mickey@example.com", role: "rider"},
        { id: "u2", name: "Bugs Bunny", email: "bugs@example.com", role: "driver"},
        { id: "u3", name: "Homer Simpson", email: "homer@example.com", role: "rider"},
        { id: "u4", name: "Peter Griffin", email: "peter@example.com", role: "admin"},
        { id: "u5", name: "Eric Cartman", email: "eric@example.com", role: "driver"},
    ];
}

function demoAudit() {
    const now = Date.now();
    return [
        { id: "a1", action: "Emergency report recevied", message: "New incident created from /emergency page.", level: "high", ts: now - 1000 * 60 * 12 },
        { id: "a2", action: "Trip flagged", message: "Trip - 219 marked for review due to repeated cancellations.", level: "medium", ts: now - 1000 * 60 * 55 },
        { id: "a3", action: "Role update", message: "User u4 promoted to admin.", level: "medium", ts: now - 1000 * 60 * 130 },
    ];
}

function addNotification(message) {
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
    }