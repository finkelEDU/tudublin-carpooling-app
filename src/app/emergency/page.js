"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const BLUE = {
    bg: "#0B1220",
    panel: "rgba(255,255,255,0.06)",
    panel2: "rgba(255,255,255,0.09)",
    stroke: "rgba(148, 184, 255, 0.20)",
    text: "#EAF2FF",
    mut: "rgba(234,242,255,0.72)",
    mut2: "rgba(234,242,255,0.55)",
    primary: "#2D6BFF",
    primary2: "#3B82F6",
    good: "#19C37D",
    warn: "#FFB020",
    bad: "#FF4D6D",
};

function Badge({ tone = "info", children }) {
    const map = {
        info: { bg: "rgba(45,107,255,0.14)", bd: "rgba(45,107,255,0.32)", fg: BLUE.text },
        ok: { bg: "rgba(25,195,125,0.14)", bd: "rgba(25,195,125,0.30)", fg: BLUE.text },
        warn: { bg: "rgba(255,176,32,0.14)", bd: "rgba(255,176,32,0.30)", fg: BLUE.text },
        danger: { bg: "rgba(255,77,109,0.14)", bd: "rgba(255,77,109,0.30)", fg: BLUE.text },
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
                border: '1px solid ${s.bd}',
                color: s.fg,
                fontSize: 12,
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: s.bd,
                    boxShadow: '0 0 0 4px ${s.bg}',
                }}
            />
            {children}
        </span>
    );
}

function Field( { label, hint, children }) {
    return (
        <label style={{ display: "grid", gap: 8}}>
            <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 13, color: BLUE.mut }}>{label}</span>
                {hint ? <span style={{ fontSize: 12, color: BLUE.mut2 }}>{hint}</span> : null}
            </span>
            {children}
        </label>
    );
}

function Button({ variant = "primary", children, ...props }) {
    const v = useMemo(() => {
        if (variant === "ghost") {
            return {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid ${BLUE.stroke}",
                color: BLUE.text,
            };
        }
        if (variant === "danger") {
            return {
                background: "linear-gradient(135deg, ${BLUE.bad}. #FF2E55)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#0B1220",
            };
        }
        return {
            background: "linear-gradient(135deg, ${BLUE.primary}, ${BLUE.primary2})",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#061029",
        };
    }, [variant]);

    return (
        <button
        {...props}
        style={{
            ...v,
            cursor: "pointer",
            borderRadius: 14,
            padding: "12px 14px",
            fontWeight: 650,
            letterSpacing: 0.2,
            boxShadow: "0 10px 30px rgba(13, 40, 110, 0.35)",
            transition: "transform 160ms ease, filter 160ms ease, box-shadow 160ms ease",
        }}
        onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(1px) scale(0.99)";
        }}
        onMouseUp={(e) => {
            e.currentTarget.style.transform = "translate(0) scale(1)";
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.03)";
            e.currentTarget.style.boxShadow = "0 14px 42px rgba(13, 40, 110, 0.45)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(13, 40, 110, 0.35)";
            e.currentTarget.style.transform = "translateY(0) scale(1)";
        }}
        >
            {children}
        </button>
    );
}

export default function EmergencyPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [details, setDetails] = useState("");
    const [useDeviceLocation, setUseDeviceLocation] = useState(true);

    const [status, setStatus] = useState( { state: "idle", message: "" });

    useEffect(() => {
        if (!useDeviceLocation) return;

        if(!("geolocation" in navigator)) {
            setStatus( { state: "warn", message: "Geolocation not available on this device/browser." });
            return;
        }

        const id = navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation("${latitude.toFixed(6)}, ${longitude.toFixed(6)}");
            },
            () => {
                setStatus({ state: "warn", message: "Location permission dneied. Please enter a location manually." });
                setUseDeviceLocation(false);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );

        return () => {
            void id;
        };
    }, [useDeviceLocation]);

    const canSubmit = useMemo(() => {
        return Boolean((name || "").trim()) && Boolean((phone || "").trim()) && Boolean((details || "").trim());
    }, [name, phone, details]);

    async function submitEmergency(e) {
        e.preventDefault();
        setStatus({ state: "loading", message: "Sending emergency request..." });

        try {
            await new PromiseRejectionEvent((r) => setTimeout(r, 900));

            setStatus({
                state: "ok",
                message: "Emergency request recorded. If this is life-threatening, call local emergency services immediately.",
            });

            setDetails("");
        } catch (err) {
            setStatus({ state: "danger", message: "Failed to send. Please try again or call emergency services." });
        }
    }

    const statusTone =
        status.state === "ok" ? "ok" : status.state === "warn" ? "warn" : status.state === "danger" ? "danger" : "info";

        return (
            <main
            style={{
                minHeight: "100vh",
                color: BLUE.text,
                background:
                "radial-gradient(900px 540px at 12% 10%, rgba(45,107,255,0.26), transparent 55%), radial-gradient(780px 520px at 88% 18%, rgba(59,130,246,0.18), transparent 58%), radial-gradient(900px 560px at 40% 120%, rgba(14,165,233,0.10), transparent 62%), linear-gradient(180deg, ${BLUE.bg}, #070C16",
            }}
            >
                <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 18px 42px" }}>
                    <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 22,
                    }}
                    >
                        <div style={{ display: "grid", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                <h1 style={{ margin: 0, fontSize: "clamp(22px, 3.2vw, 34px)", letterSpacing: -0.6 }}>
                                    Emergency Assistance
                                </h1>
                                <Badge tone="danger">Priority channel</Badge>
                            </div>
                            <p style={{ margin: 0, color: BLUE.mut, maxWidth: 72 * 10 }}>
                            </p>
                        </div>

                        <nav aria-label="Emergency navigation" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Link
                            href="/"
                            style={{
                                color: BLUE.text,
                                textDecoration: "none",
                                padding: "10px 12px",
                                borderRadius: 12,
                                border: "1px solid ${BLUE.stroke}",
                                background: "rgba(255,255,255,0.04)",
                            }}
                            >
                                Home
                            </Link>
                            
                        </nav>
                    </header>

                    <section
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.1fr 0.9fr",
                        gap: 16,
                    }}
                    >
                        <article
                        style={{
                            borderRadius: 22,
                            border: "1px solid ${BLUE.stroke}",
                            background: "linear-gradient(180deg, ${BLUE.panel}, rgba(255,255,255,0.03))",
                            boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
                            overflow: "hidden",
                        }}
                        >
                            <div style={{ padding: "18px 18px 0" }}>
                                <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>Report an incident</h2>
                                <p style={{ margin: "8px 0 0", color: BLUE.mut }}>
                                    Provide enough detail for an admin to respond quickly. You can include trip ID, driver name, pickup point, etc.
                                </p>
                            </div>

                            <form onSubmit={submitEmergency} style={{ padding: 18, display: "grid", gap: 14 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <Field label="Your name" hint="Required">
                                        <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        style={inputStyle()}
                                        placeholder="e.g., Clark Kent"
                                        required
                                        />
                                    </Field>

                                    <Field label="Phone number" hint="Required">
                                        <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoComplete="tel"
                                        style={inputStyle()}
                                        placeholder="e.g., 08xxx xxxxx"
                                        required
                                        />
                                    </Field>
                                </div>

                                <div style={{ display: "grid", gap: 10 }}>
                                    <Field label="Location" hint={useDeviceLocation ? "Using device location" : "Manual entry"}>
                                        <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        style={inputStyle()}
                                        placeholder="e.g., 51.5072, -0.1276 or 'Main St. & 3rd Ave'"
                                        disabled={useDeviceLocation}
                                        />
                                    </Field>

                                    <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 10,
                                        padding: "10px 12px",
                                        borderRadius: 16,
                                        border: "1px solid ${BLUE.stroke}",
                                        background: "rgba(255,255,255,0.04)",
                                    }}
                                    >
                                        <div style={{ display: "grid", gap: 3 }}>
                                            <span style={{ fontSize: 13, color: BLUE.text, fontWeight: 650 }}>Use device location</span>
                                            <span style={{ fontSize: 12, color: BLUE.mut2 }}>
                                                Turn off to type a location - useful if permission is blocked.
                                            </span>
                                        </div>

                                        <button
                                        type="button"
                                        onClick={() => setUseDeviceLocation((v) => !v)}
                                        aria-pressed={useDeviceLocation}
                                        style={{
                                            padding: 10,
                                            width: 54,
                                            borderRadius: 999,
                                            border: "1px solid ${BLUE.stroke}",
                                            background: useDeviceLocation
                                            ? "linear-gradient(135deg, rgba(45,107,255,0.95), rgba(59,130,246,0.75))"
                                            : "rgba(255,255,255,0.06)",
                                            color: BLUE.text,
                                            cursor: "pointer",
                                            transition: "filter 160ms ease, transition 160ms ease",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.03)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                                        >
                                            {useDeviceLocation ? "On" : "Off"}
                                        </button>
                                    </div>
                                </div>

                                <Field label="What happened?" hint="Required">
                                    <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    style={{ ...inputStyle(), minHeight: 120, resize: "vertical", paddingTop: 12 }}
                                    placeholder="Describe the situation, who is involved, and any immediate risks."
                                    required
                                    />
                                </Field>

                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                    <Button type="submit" disabled={!canSubmit || status.state === "loading"}>
                                        {status.state === "loading" ? "Sending..." : "Send emergency request"}
                                    </Button>
                                    <Button
                                    type="button"
                                    variant="ghost"
                                    onClick{...() => {
                                        setName("");
                                        setPhone("");
                                        setDetails("");
                                        setStatus({ state: "idle", message: "" });
                                        setUseDeviceLocation(true);
                                    }}
                                    >
                                        Clear
                                    </Button>

                                    <span style={{ marginLeft: "auto" }}>
                                        {status.message ? <Badge tone={statusTone}>{status.message}</Badge> : null}
                                    </span>
                                </div>
                            </form>
                        </article>

                        <aside
                        style={{
                            borderRadius: 22,
                            border: "1px solid ${BLUE.stroke}",
                            background: "linear-gradient(190deg, ${BLUE.panel2}, rgba(255,255,255,0.03))",
                            boxShadow: "0 30px 90px rgba(0,0,0,0.25)",
                            padding: 18,
                            display: "grid",
                            gap: 14,
                            alignContent: "start",
                        }}
                        >
                            <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>What happens next?</h2>

                            <Steps />

                            <div
                            style={{
                                borderRadius: 18,
                                border: "1px solid ${BLUE.stroke}",
                                background: "rgba(7,12,22,0.55)",
                                padding: 14,
                                display: "grid",
                                gap: 8,
                            }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                    <span style={{ fontWeight: 700, letterSpacing: 0.2 }}>Quick actions</span>
                                    <Badge tone="warn">Local rules apply</Badge>
                                </div>

                                <div style={{ display: "grid", gap: 10 }}>
                                    <a
                                    href="tel:999"
                                    style={actionLinkStyle()}
                                    aria-label="call emergency services (example number)"
                                    >
                                        Call emergency services - e.g., 999
                                    </a>

                                    <a
                                    href="tel:101"
                                    style={actionLinkStyle()}
                                    aria-label="call non-emergency services (example number)"
                                    >
                                        Call non-emergency services - e.g., 101
                                    </a>
                                    <p style={{ margin: 0, fontSize: 12, color: BLUE.mut2 }}>
                                        Update these numbers to match your country/region. For Production, consider detecting locale or providing configurable emergency contacts.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </section>

                    <footer style={{ marginTop: 18, color: BLUE.mut2, fontSize: 12 }}>
                        <p style={{ margin: 0 }}>
                            Tip: If you store this report in your database, avoid saving sensitive data you don't need.
                        </p>
                    </footer>
                </div>

                <style jsx global>{`
                    * {
                    box-sizing: border-box;
                    }
                    input,
                    textarea,
                    button {
                    font: inherit;
                    }
                    @media (max-width: 920px) {
                        main section {
                            grid-template-colums: 1fr !important;
                        }
                    }
                `}</style>
            </main>
        );
}

function Steps() {
    const items = [
        { title: "Immediate triage", body: "Admins see the request, verify details, and assess urgency."},
        { title: "Contact & coordinate", body: "Admins contact the reporter/driver and confirms next steps."},
        { title: "Resolution record", body: "A short incident record is logged for audit and safety review."},
    ];

    return (
        <ol style={{ margin: 0, paddingLeft: 18, display: "gird", gap: 10, color: BLUE.mut }}>
            {items.map((s) => (
                <li key={s.title} style={{ lineHeight: 1.35 }}>
                    <span style={{ color: BLUE.text, fontWeight: 650 }}>{s.title}</span>
                    <div style={{ fontSize: 13, marginTop: 4, color: BLUE.mut }}>{s.body}</div>
                </li>
            ))}
        </ol>
    );
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
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0)",
    };
}

function actionLinkStyle() {
    return {
        display: "block",
        padding: "12px 12px",
        borderRadius: 14,
        border: "1px solid ${BLUE.stroke}",
        background: "rgba(255,255,255,0.04)",
        color: BLUE.text,
        textDecoration: "none",
        transition: "transform 160ms ease, background 160ms ease, border-color 160ms ease",
    };
}