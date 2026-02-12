"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
    const [audit, setAudit] = useState([]);
    const [loading, setLoading] = useState(false);

    const canQuery = useMemo(() => token.trim().length >= 8, [token]);

    useEffect(() => {
        const saved = typeof window !== "undefined" ? window.localStorage.getItem("admin_token") : null;
        if (saved) setToken(saved);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && token) {
            window.localStorage.setItem("admin_token", token);
        }
    }, [token]);

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

    async function refresh() {
        if (!canQuery) return;
        await loadDashboard();
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
                </section>

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