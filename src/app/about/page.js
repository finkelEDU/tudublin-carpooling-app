import React, { useState, useEffect } from 'react';

export default function About(){
    const [toast, setToast] = useState({ visible: false, message: '', detail: '' });

    const [stats, setStats] = useState({
        co2saved: '-',
        costSaved: '-',
        carsRemoved: '-',
    });

    const generateStats = () => {
        const co2 = Math.floor(Math.random() * (980 - 320 + 1)) + 320;
        const cost = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
        const cars = Math.floor(Math.random() * (180 - 40 + 1)) + 40;
        setStats({
            co2saved: '${co2.toLocaleString()} kg',
            costSaved: '€${cost.toLocaleString()}',
            carsRemoved: cars.toLocaleString(),
        });
        showToast('Sample stats updated', 'Use these as placeholders in your report.');
    };

    const showToast = (message, detail = '') => {
        setToast({ visible: true, message, detail });
        setTimeout(() => setToast({ visible: false, message: '', detail: ''}), 4000);
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText('carpool@tudublin.example');
            showToast('Contact email copied', 'carpool@tudublin.example');
        } catch {
            showToast('Copy failed', 'Clipboard access denied.');
        }
    };

    const copyStats = async () => {
        const text = 'TU Dublin Carpool - Sample Impact Metrics (placeholder)';
        '- Estimated C02 saved / month: ${stats.co2saved}'
        '- Average cost saved / commuter: ${stats.costSaved}'
        '- Cars removed from peak parking: ${stats.carsRemoved}'

        'Note: Replace with measured values if your prototype collects ride data.';
        try{
            await navigator.clipboard.writeText(text);
            showToast('Copied for report', 'Paste into your project documentation.');
        } catch {
            showToast('Copy failed', 'Clipboard access denied.');
        }
    };

    const animateRoute = () => {
        showToast('Route animation started', 'Concept: show live ride progress.');
    };

    const sharePage = async () => {
        const shareData = {
            title: 'TU Dublin Carpool - About',
            text: 'TU Dublin Carpool - About page',
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied', window.location.href);
            }
        } catch {

        }
    };

    useEffect(() => {
        generateStats();
    }, []);

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.brand}>
                    <div style={styles.logo} aria-hidden="true" />
                    <div>
                        <h1 style={styles.brandTitle}>TU Dublin Carpool</h1>
                        <p style={styles.brandSubtitle}>About - safer, cheaper, commutes</p>
                    </div>
                </div>
                <nav aria-label="Primary Navigation" style={styles.nav}>
                    <a href='#mission' style={styles.navLink}>Mission</a>
                    <a href='#how' style={styles.navLink}>How It Works</a>
                    <a href='#trust' style={styles.navLink}>Trust & Safety</a>
                    <a href='#faq' style={styles.navLink}>FAQ</a>
                </nav>
                <div style={styles.actions}>
                    <button onClick={copyEmail} style={styles.btn}>Copy Contact Email</button>
                    <button onClick={sharePage} style={{ ...styles.btn, ...styles.primaryBtn }}>Share Page</button>
                </div>
            </header>

            <main style={styles.main}>
                <section style={styles.hero}>
                    <h2 style={styles.heroTitle}>Built for TU Dublin students, staff & campus life</h2>
                    <p style={styles.heroText}>
                        TU Dublin Carpool is a community-first carpool platform designed around real campus schedules:
                        Early Labs, Late Studio Sessions, Multiple Campuses, and the everyday need for affordibility, reliability, and safety.
                    </p>
                    <button onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })} style={{ ...styles.btn, ...styles.primaryBtn }}>
                        See how it works
                    </button>
                </section>

                <section id="mission" style={styles.section}>
                    <h3 style={styles.sectionTitle}>Mission: Better commutes with fewer cars</h3>
                    <p style={styles.sectionText}>
                        Our goal is to reduce single-occupancy trips to and from TU Dublin by making carpooling genuinely convenient:
                        Clear pickup points, Schedule-aware matching, transparent contributions, and a respectful community standard.
                    </p>
                    <ul style={styles.tagList}>
                        <li style={styles.tag}>CO2 reduction</li>
                        <li style={styles.tag}>Cost sharing</li>
                        <li style={styles.tag}>Campus community</li>
                    </ul>
                </section>

                <section id="how" style={styles.section}>
                    <h3 style={styles.sectionTitle}>How it works (end-to-end)</h3>
                    <ol style={styles.timeline}>
                        <li>
                            <strong>Create a profile that builds trust: </strong> Users set commuting preferences, pickup flexibility, and verify their TU Dublin affiliation.
                        </li>
                        <li>
                            <strong>Publish or request rides:</strong> Drivers post routes: passengers request rides with pickup points and time ranges.
                        </li>
                        <li>
                            <strong>Confirm with clear expectations:</strong> See estimated detours, pickup windows, seat availability, and suggested contributions.
                        </li>
                        <li>
                            <strong>Meet, ride, and rate:</strong> After rides, users rate each other and can save routes for recurring carpools.
                        </li>
                    </ol>
                    <button onClick={animateRoute} style={style.btn}>Animate Route (Demo)</button>
                </section>

                <section id="trust" style={styles.section}>
                    <h3 style={style.sectionTitle}>Trust & Safety</h3>
                    <p style={styles.sectionText}>
                        We priortize safety with TU Dublin email verification, badges, ride history, ptional live location sharing, and clear reporting pathways.
                    </p>
                </section>

                <section id="faq" style={styles.section}>
                    <h3 style={styles.faqItem}>FAQ</h3>
                        <details style={styles.faqItem}>
                            <summary>Is TU Dublin Carpool an official TU Dublin service</summary>
                            <p>Not necessarily, as this is a student project concept and we are transparent about ownership and support.</p>
                        </details>
                        <details style={styles.faqItem}>
                            <summary>How do costs work?</summary>
                            <p>Costs are contribution-based (fuel/parking split) with transparent suggestions before confimration</p>
                        </details>
                        <details style={styles.faqItem}>
                            <summary>What happens if someone cancels?</summary>
                            <p>There are cancellation windows and reliability scores to impove matching over time.</p>
                        </details>
                        <details style={styles.faqItem}>
                            <summary>What about provacy?</summary>
                            <p>We limit data exposure and offer opt-in location sharing during rides.</p>
                        </details>
                </section>

                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>Sample Impact Metrics</h3>
                    <ul style={styles.statsList}>
                        <li><strong>Estimated C02 saved / month:</strong> {stats.co2saved}</li>
                        <li><strong>Average cost saved / commuter:</strong> {stats.costSaved}</li>
                        <li><strong>Cars removed from peak parking:</strong> {stats.carsRemoved}</li>
                    </ul>
                    <div style={styles.statsActions}>
                        <button onClick={generateStats} style={style.btn}>Regenerate Stats</button>
                        <button onClick={copyStats} style={{ ...styles.btn, ...styles.primaryBtn }}>Copy Stats for Report</button>
                    </div>
                </section>
            </main>

            {toast.visible && (
                <div role="status" aria-live="polite" style={styles.toast}>
                    <p>{toast.message}</p>
                    {toast.detail && <small>{toast.detail}</small>}
                </div>
            )}

            <footer style={styles.footer}>
                <p>@ 2026 TU Dublin Carpool Project. All rights reserved.</p>
            </footer>
        </div>
    );
}

const bluePalette = {
    bg: '#0d1f4a',
    bgLight: '#1a2d7a',
    text: '#e0e7ff',
    muted: '#a0a9d6',
    primary: '#3b82f6',
    primaryDark: '#1e40af',
    border: '#2c3e8f',
    btnBg: '#3b82f6',
    btnHover: '#2563eb',
    btnActive: '#1e40af',
    toastBg: 'rgba(59, 130, 246, 0.9)',
};

const style = {
    page: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: bluePalette.bg,
        color: bluePalette.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: bluePalette.bgLight,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid ${bluePalette.border}'
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    logo: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, ${bluePalette.primary}, ${bluePalette.primaryDark})',
        boxShadow: '0 0 10px ${bluePalette.primary}',
    },
    brandTitle: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '700',
    },
    brandSubtitle: {
        margin: 0,
        fontSize: '0.85rem',
        color: bluePalette.muted,
    },
    nav: {
        display: 'flex',
        gap: '1.5rem',
    },
    navLink: {
        color: bluePalette.text,
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'color 0.3s',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
    },
    btn: {
        backgroundColor: 'transparent',
        border: '2px solid ${bluePalette.text}',
        borderRadius: '8px',
        color: bluePalette.text,
        padding: '0.5rem 1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    primaryBtn: {
        backgroundColor: bluePalette.btnBg,
        borderColor: bluePalette.btnBg,
        color: '#fff',
    },
    main: {
        flex: '1 0 auto',
        padding: '2rem',
        maxWidth: '900px',
        margin: '0 auto',
    },
    hero: {
        marginBottom: '3rem',
        textAlign: 'center',
    },
    heroTitle: {
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    heroText: {
        fontSize: '1.1rem',
        marginBottom: '1.5rem',
        color: bluePalette.muted,
    },
    section: {
        marginBottom: '3rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        borderBottom: '2px solid ${bluePalette.primary}',
        paddingBottom: '0.25rem',
    },
    sectionText: {
        fontSize: '1rem',
        color: bluePalette.muted,
        marginBottom: '1rem',
    },
    tagList: {
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        gap: '1rem',
    },
    tag: {
        backgroundColor: bluePalette.primaryDark,
        padding: '0.3rem 0.8rem',
        borderRadius: '9999px',
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    timeline: {
        paddingLeft: '1.25rem',
        color: bluePalette.text,
        fontSize: '1rem',
        lineHeight: '1.6',
        marginBottom: '1rem',
    },
    faqItem: {
        backgroundColor: bluePalette.bgLight,
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        color: bluePalette.text,
    },
    statsList: {
        listStyle: 'none',
        padding: 0,
        fontSize: '1.1rem',
        marginBottom: '1rem',
    },
    statsActions: {
        display: 'flex',
        gap: '1rem',
    },
    toast: {
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bluePalette.toastBg,
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0.4px 15px rgba(0,0,0,0.3)',
        zIndex: 1000,
        maxWidth: '90vw',
        textAlign: 'center',
    },
    footer: {
        backgroundColor: bluePalette.bgLight,
        color: bluePalette.muted,
        textAlign: 'center',
        padding: '1rem 2rem',
        fontSize: '0.9rem',
        flexShrink: 0,
    },
};