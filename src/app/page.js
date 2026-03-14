"use client";

import React from "react";
import Link from "next/link";
import ChatHistory from "./ChatHistory.jsx";

export default function Home(){
  return(
    <main style={styles.page}>

      <h1 style={styles.title}>Welcome to TU Dublin's Carpooling</h1>
      <p style={styles.description}>Many students are aware that travelling to TUDublin is not easy! Therefore, we will allow students and non-students to offer rides to college.</p>

      <p style={styles.description}>Signing up is easy, just click Sign Up at the top of the page and fill in a few details. Then you can request or offer carpool rides to college.</p>

      <section style={styles.mapSection}>
        <div id="google-map" style={styles.mapPlaceholder}>
          <p style={{ textAlign: "center", paddingTop: 180, color: "#888" }}>
            Map loading...
          </p>
        </div>
      </section>

      <body>
        <gmp-map id="google-maps"
          center = "53.404, -6.38"
          zoom = "15"
          map-id = "DEMO_MAP_ID"
        >
          <gmp-advanced-marker
            position="53.404, -6.38"
            title="TU Dublin Blanchardstown Campus"
          ></gmp-advanced-marker>
        </gmp-map>
      </body>


      <p style={styles.description}>Search for Ride</p>


    <section style={styles.searchSection}>
      <p style={styles.searchText}>Search For A Ride:</p>
      <div id="find-carpool" style={styles.searchFields}>
        <input type="text" placeholder="Start" className="find-carpool-field" style={styles.input} />
        <input type="text" placeholder="Destination" className="find-carpool-field" style={styles.input} />
        <button className="find-carpool-button" style={styles.searchButton}>Search</button>
      </div>
    </section>

    <section style={styles.postRideSection}>
      <Link href="/create"><button className="find-carpool-button">Post Ride</button>
        Post Ride
      </Link>
    </section>

    <section style={styles.chatHistorySection}>
      <h2 style={styles.subtitle}>Recent Conversations</h2>
      <ChatHistory />
    </section>
  </main>
  );
}

const style = {
  page: {
    maxWidth: 900,
    margin: "3rem auto",
    padding: "0 1.2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#0f172a",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#2563eb",
  },
  description: {
    fontSize: "1.15rem",
    marginBottom: "2rem",
    color: "#475569",
  },
  mapSection: {
    height: 360,
    marginBottom: "2rem",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
  },
  searchSection: {
    marginBottom: "2rem",
  },
  searchText: {
    marginBottom: 8,
    fontWeight: "600",
  },
  searchFields: {
    display: "flex",
    gap: 12,
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  searchButton: {
    padding: "10px 20px",
    fontWeight: "600",
    fontSize: "1rem",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  postRideSection: {
    marginBottom: "3rem",
  },
  postRideButton: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: 8,
    fontWeight: "700",
    textDecoration: "none",
    cursor: "pointer",
  },
  chatHistorySection: {
    marginTop: "2rem",
  },
  subtitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#2563eb",
  },
};