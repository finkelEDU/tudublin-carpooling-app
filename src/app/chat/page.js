"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import CarpoolChat from "../CarpoolChat.jsx";
import ChatHistory from "../ChatHistory.jsx";
import Feedback from "../Feedback.jsx";
import Link from "next/link";

const BLUE = {
    950: "#07162F",
    900: "#0A1E3E",
    800: "#0D2A57",
    700: "#113A78",
    600: "#1D4ED8",
    500: "#2563EB",
    400: "#60A5FA",
    300: "#93C5FD",
    200: "#BFDBFE",
    100: "#DBEAFE",
};

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function useLocalStorageState(key, initialValue) {
    const [calue, setValue] = useState(initialValue);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw != null) setValue(JSON.parse(raw));
        } catch {

        }
    }, [key]);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {

        }
    }, [key, value]);

    return [value, setValue];
}

function Toast({ toast, onClose }) {
    if (!toast?.visible) return null;
    return (
        <div
        role="status"
        ara-live="polite"
        style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 18,
            width: "min(560px, calc(100% - 1.6rem))",
            background: "rgba(10, 30, 62, 0.78)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: "12px 14px",
            color: "rgba(255,255,255,0.92)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "flex-start",
        }}
        >
            <div>
                <div style={{ fontWeight: 800, letterSpacing: "-0.01rem" }}>{toast.title}</div>
                {toast.detail ? (
                    <div style={{ opacity: 0.86, marginTop: 2, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace", fontSize: 12}}>
                        {toast.detail}
                    </div>
                ) : null}
        </div>
        <button
        type="button"
        onClick={onClose}
        style={{
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.92)",
            borderRadius: 12,
            padding: "8px 10px",
            cursor: "pointer",
            fontWeight: 800,
        }}
        >
            Dismiss
        </button>
        </div>
    );
}

function SkeletonLine({ w = "100%" }) {
    return (
        <div
        style={{
            height: 10,
            width: w,
            borderRadius: 999,
            background:
            "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
            backgroundSize: "200% 100%",
            animation: "shine 1.2s ease-in-out infinite",
        }}
        />
    );
}

function InlineError({ title = "Somethin went wrong", detail }) {
    return (
        <div
        role="alert"
        style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            padding: 14,
        }}
        >
            <div style={{ fontWeight: 900, letterSpacing: "-0.01em" }}>{title}</div>
            {detail ? <div style={{ marginTop: 6, opacity: 0.82, lineHeight: 1.5 }}>{detail}</div> : null}
        </div>
    );
}

export default function Chat(){
    const [user, setUser] = useLocalStorageState("tud_carpool_chat_user", {
        id: "demo-user",
        name: "Student",
        role: "passenger",
    });

    const [prefs, setPrefs] = useLocalStorageState("tud_carpool_chat_prefs", {
        compact: false,
        showTimestamps: true,
        autoScroll: true,
        sound: false,
    });

    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [activeCarpool, setActiveCarpool] = useState(null);

    const [toast, setToast] = useState({ visible: false, title: "", detail: "" });
    const [status, setStatus] = useState({ loading: true, error: null, online: true });

    const toastTimer = useRef(null);
    const showToast = useCallback((title, detail = "") => {
        clearTimeout(toastTimer.current);
        setToast({ visible: true, title, detail });
        toastTimer.current = setTimeout(() => setToast({ visible: false, title: "", detail: ""}), 3500);
    }, []);

    useEffect(() => {
        let alive = true;
        (async () => {
            setStatus((s) => ({ ...s, loading: true, error: null }));
            try {
                await new Promise((r) => setTimeout(r, 450));
                if (!alive) return;

                setSelectedThreadId((id) => id ?? "demo-thread-1");
                setActiveCarpool((c) =>
                c ?? ({
                    id: "pool-123",
                    origin: "Tallaght",
                    destination: "TU Dublin (Grangegorman)",
                    date: new Date().toISOString(),
                    seatsAvailable: 2,
                })
            );
            setStatus((s) => ({ ...s, loading: false, error: null }));
            } catch (e) {
                if (!alive) return;
                setStatus((s) => ({ ...s, loading: false, error: "Failed to load chat context." }));
            }
        })();
        return () => {
            alive = false;
            clearTimeout(toastTimer.current);
        };
    }, []);

    useEffect(() => {
        const onOnline = () => setStatus((s) => ({ ...s, online: true }));
        const onOffline = () => setStatus((s) => ({ ...s, online: false }));
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);
        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        };
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setPrefs((p) => ({ ...p, compact: !p.compact }));
                showToast("View updated", `Compact mode: ${(!prefs.compact).toString()}`);
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "/") {
                e.preventDefault();
                setPrefs((p) => ({ ...p, showTimestamps: !p.showTimestamps }));
                showToast("View updated", `Timestamps: ${(!prefs.showTimestamps).toString()}`);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [prefs.compact, prefs.showTimestamps, setPrefs, showToast]);

    const headerSubtitle = useMemo(() => {
        const parts = [];
        parts.push(status.online ? "Online" : "Offline");
        if (activeCarpool?.origin && activeCarpool?.destination) {
            parts.push(`${activeCarpool.origin} -> ${activeCarpool.destination}`);
        }
        return parts.join(" . ");
    }, [status.online, activeCarpool]);

    const pageStyles = useMemo(() => {
        const gap = prefs.compact ? 10 : 14;
        const pad = prefs.compact ? 12 : 18;

        return {
            page: {
                minHeight: "100vh",
                background:
                "radial-gradient(1200px 700px at 15% 10%, rgba(37,99,235,0.25), transparent 60%)," +
                "radial-gradient(900px 600px at 85% 18%, rgba(96,165,250,0.18), transparent 60%)," +
                "linear-gradient(180deg, #061223 0%, #07162F 55%, #050B16 100%",
            color: "rgba(255,255,255,0.92)",
            fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
            },
            wrap: {
                width: "min(1200px, calc(100% - 1.8rem))",
                margin: "0 auto",
                padding: "18px 0 26px",
            },
            topbar: {
                position: "sticky",
                top: 0,
                zIndex: 30,
                backdropFilter: "blur(12px)",
                background: "linear-gradient(180deg, rgba(6,18,37,0.78), rgba(6,18,37,0.35))",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            },
            topbarIn: {
                width: "min(1200px, calc(100% - 1.8rem))",
                margin: "0 auto",
                padding: "14px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
            },
            brand: { display: "flex", alignItems: "center", gap: 10, minWidth: 220 },
            logo: {
                width: 40,
                height: 40,
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(37,99,235,1), rgba(96,165,250,1))",
                boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
            },
            title: { margin: 0, fontWeight: 900, letterSpacing: "-0.03em", fontSize: 18, lineHeight: 1.05},
            subtitle: { margin: "3px 0 0", opacity: 0.72, fontSize: 12.5 },
            actions: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-end" },
            btn: {
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                borderRadius: 14,
                padding: "10px 12px",
                cursor: "pointer",
                fontWeight: 900,
                letterSpacing: "-0.01em",
            },
            btnPrimary: {
                borderColor: "rgba(96,165,250,0.35)",
                background: "linear-gradient(135deg, rgba(37,99,235,0.22), rgba(96,165,250,0.12))",
            },
            grid: {
                display: "grid",
                gridTemplateColumns: "1fr",
                gap,
                marginTop: 16,
            },
            panel: {
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                boxShadow: "0 22px 70px rgba(0,0,0,0.45)",
                overflow: "hidden",
            },
            panelIn: { padding: pad },
            small: { opacity: 0.72, fontSize: 12.5, lineHeight: 1.45 },
            chipRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 10 },
            chip: {
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.20)",
                borderRadius: 999,
                padding: "6px 10px",
                fontSize: 12,
                fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
                opacity: 0.86,
            },
        };
    }, [prefs.compact]);

    const onResetPrefs = () => {
        setPrefs({ compact: false, showTimestamps: true, autoScroll: true, sound: false });
        showToast("Preferences reset", "Back to defaults.");
    };

    const onSwapUserRole = () => {
        setUser((u) => ({ ...u, role: u.role === "driver" ? "passenger" : "driver" }));
        showToast("Role switched", "Demo-only toggle for testing UI states.");
    };

    return (
        <main style={pageStyles.page}>
            <style>{`
                @keyframes shine {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
            }
                @media (mind-width: 980px){
                    .chat-grid{
                        grid-template-columns: 420px 1fr;
                        align-items: start;
                }
            }
        `}</style>

        <header style={pageStyles.topbar}>
            <div style={pageStyles.topbarIn}>
                <div style={pageStyles.brand}>
                    <div style={pageStyles.logo} aria-hidden="true" />
                    <div>
                        <p style={pageStyles.title}>Carpool Chat</p>
                        <p style={pageStyles.subtitle}>{headerSubtitle}</p>
                    </div>
                </div>

                <div style={pageStyles.actions}>
                    <Link href="/" style={{ ...pageStyles.btn, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Home
                    </Link>
                    <button
                    type="button"
                    style={pageStyles.btn}
                    onClick={() => {
                        setPrefs((p) => ({ ...p, compact: !p.compact }));
                        showToast("View Updated", `Compact mode: ${(!prefs.compact).toString()}`);
                    }}
                    aria-pressed={prefs.compact}
                    title="Shortcut: Ctrl/Cmd + K"
                    >
                        Compact
                    </button>
                    <button
                    type="button"
                    style={pageStyles.btn}
                    onClick={() => {
                        setPrefs((p) => ({ ...p, showTimestamps: !p.showTimestamps }));
                        showToast("View Updated", `Timestamps: ${(!prefs.showTimestamps).toString()}`);
                    }}
                    aria-pressed={prefs.showTimestamps}
                    title="Shortcut: Ctrl/Cmd + /"
                    >
                        Timestamps
                    </button>
                    <button type="button" style={{ ...pageStyles.btn, ...pageStyles.btnPrimary }} onClick={onSwapUserRole}>
                        Switch Role
                    </button>
                    <button type="button" style={pageStyles.btn} onClick={onResetPrefs}>
                        Reset
                    </button>
                </div>
            </div>
        </header>

        <div style={pageStyles.wrap}>
            {/* Keep your exisiting structure: chat-divs contains ChatHistory + CarpoolChat, and Feedback outside */}
            {status.error ? (
                <InlineError title="Could not load chat" detail={status.error} />
            ) : (
                <>
                <div
                    className="chat-divs chat-grid"
                    style={pageStyles.grid}
                >
                    <section style={pageStyles.panel} aria-label="Chat History Panel">
                        <div style={pageStyles.panelIn}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                                <h2 style={{ margin: 0, fontWeight: 950, letterSpacing: "-0.02em", fontSize: 16 }}>
                                    Conversations
                                </h2>
                                <span style={pageStyles.small}>
                                    {status.loading ? "Loading..." : `${selectedThreadId ? "1 selected" : "None selected"}`}
                                </span>
                            </div>

                            <div style={{ marginTop: 12 }}>
                                {status.loading ? (
                                    <div style={{ display: "grid", gap: 10 }}>
                                        <SkeletonLine w="65%" />
                                        <SkeletonLine w="88%" />
                                        <SkeletonLine w="58%" />
                                        <SkeletonLine w="72%" />
                                    </div>
                                ) : (
                                    <ChatHistory
                                    user={user}
                                    selectedThreadId={selectedThreadId}
                                    onSelectThread={(threadId, meta) => {
                                        setSelectedThreadId(threadId);
                                        if (meta?.carpool) setActiveCarpool(meta.carpool);
                                        showToast("COnversation Selected", threadId);
                                    }}
                                    compact={prefs.compact}
                                    />
                                )}
                            </div>

                            <div style={pageStyles.chipRow} aria-label="Chat Page Context Chips">
                                <span style={pageStyles.chip}>user: {user?.name ?? "-"}</span>
                                <span style={pageStyles.chip}>role: {user?.role ?? "-"}</span>
                                <span style={pageStyles.chip}>thread: {selectedThreadId ?? "-"}</span>
                                <span style={pageStyles.chip}>autoScroll: {String(prefs.autoScroll)}</span>
                            </div>
                        </div>
                    </section>

                    <section style={pageStyles.panel} aria-label="Active chat panel">
                        <div style={pageStyles.panelIn}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12}}>
                                <h2 style={{ margin: 0, fontWeight: 950, letterSpacing: "-0.02em", fontSize: 16 }}>
                                    Messages
                                </h2>
                                <span style={pageStyles.small}>
                                    {activeCarpool ? `Pool: ${activeCarpool.origin} -> ${activeCarpool.destination}` : "No poll loaded"}
                                </span>
                            </div>

                            <div style={{ marginTop: 12 }}>
                                <CarpoolChat
                                user={user}
                                threadId={selectedThreadId}
                                carpoolId={activeCarpool?.id ?? null}
                                showTimestamps={prefs.showTimestamps}
                                autoScroll={prefs.autoScroll}
                                onError={(msg) => showToast("Chat error", msg)}
                                onSent={(payload) => {
                                    if (prefs.sound) showToast("Message sent", paylod?.text?.slice?.(0, 70) ?? "");
                                }}
                                />
                            </div>

                            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                <button
                                type="button"
                                style={pageStyles.btn}
                                onClick={() => setPrefs((p) => ({ ...p, autoScroll: !p.autoScroll }))}
                                aria-pressed={prefs.autoScroll}
                                >
                                    Auto-scroll: {prefs.autoScroll ? "On" : "Off"}
                                </button>
                                <button
                                type="button"
                                style={pageStyles.btn}
                                onClick={() => {
                                    showToast("Report sent (demo)", "In a real app, this would create a moderation ticket.");
                                }}
                                >
                                Report
                                </button>
                                <button
                                type="button"
                                style={pageStyles.btn}
                                onClick={() => {
                                    showToast("Block user (demo)", "In a real app, you would prevent future matching or messages.");
                                }}
                                >
                                Block
                                </button>
                            </div>

                            {!status.online ? (
                                <div style={{ marginTop: 12 }}>
                                    <InlineError
                                    title="You appear to be offline"
                                    detail="You can keep typing, but sending may fail until your connection returns."
                                    />
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>

                <section style={{ ...pageStyles.panel, marginTop: 14 }} aria-label="Feedback Section">
                    <div style={pageStyles.panelIn}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                            <h2 style={{ margin: 0, fontWeight: 950, letterSpacing: "-0.02em", fontSize: 16 }}>
                                Feedback
                            </h2>
                            <span style={pageStyles.small}>
                                Rate and Comment after a ride - stored via api/chat
                            </span>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <Feedback
                            user={user}
                            carpoolId={activeCarpool?.id ?? null}
                            onSubmitted={() => showToast("Feedback submitted", "Thanks for helping improve the community.")}
                            onError={(msg) => showToast("Feedback error", msg)}
                        />
                    </div>
                    </div>
            </section>
            </>
        )}
        </div>

        <Toast toast={toast} onClose={() => setToast({ visible: false, title: "", detail: "" })} />
        </main>
    )
}