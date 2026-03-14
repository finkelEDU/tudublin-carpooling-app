"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const mockResultsData = [
    {
        id: 1,
        type: "car",
        number: "123",
        destination: "City Airport",
        available: true,
        coords: [51.505, -0.09],
        driver: "Thomas",
    },
    {
        id: 2,
        type: "bus",
        number: "45B",
        destination: "Airport",
        available: false,
        coords: [51.51, -0.1],
        driver: "Rosie",
    },
];

export default function SearchPage() {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [rideType, setRideType] = useState("Driver");
    const [destination, setDestination] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const filtered = mockResultsData.filter(
            (r) =>
            (!destination || r.destination.toLowerCase().includes(destination.toLowerCase())) &&
            (!rideType || r.rideType === rideType)
        );
        setResults(filtered);
    };

    const clearSearch = () => {
        setVehicleNumber("");
        setRideType("Driver");
        setDestination("");
        setDateTime("");
        setResults([]);
    };

    return (
        <main style={styles.page}>
            <h1 style={styles.title}>Search For A Carpool Ride</h1>

            <section style={styles.formSection}>
                <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                style={styles.input}
                />
                <select value={rideType} onChange={(e) => setRideType(e.target.value)} style={styles.select}>
                    <option value="Driver">Driver</option>
                    <option value="Passenger">Passenger</option>
                </select>
                <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={styles.input}
                />
                <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                style={styles.input}
                />
                <div style={styles.buttons}>
                    <button onClick={handleSearch} style={styles.button}>
                        Search
                    </button>
                    <button onClick={clearSearch} style={{ ...styles.button, ...styles.clearButton }}>
                        Clear
                    </button>
                </div>
            </section>

            <section style={styles.resultsSection}>
                <h2 style={styles.subtitle}>Results</h2>
                {results.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <ul style={styles.resultsList}>
                        {results.map((r) => (
                            <li key={r.id} style={styles.resultItem}>
                                <strong>{r.driverName}</strong> ({r.vehicleNumber}) - {r.rideType} to {r.destination} at{" "}
                                {new Date(r.dateTime).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section style={styles.mapSection}>
                <h2 style={styles.subtitle}>Map Preview</h2>
                <div style={styles.mapContainer}>
                    <MapContainer center={[53.349805, -6.26031]} zoom={11} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {results.map((r) => (
                            <Marker key={r.id} position={r.latLng}>
                                <Popup>
                                    {r.driverName} ({r.vehicleNumber})<br />
                                    {r.destination} at {new Date(r.dateTime).toLocaleString()}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </section>
        </main>
    );
}

const styles = {
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
    formSection: {
        display: "grid",
        grimTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: "2rem",
    },
    input: {
        padding: "10px 12px",
        fontSize: "1rem",
        borderRadius: 6,
        border: "1px solid #ccc",
        width: "100%",
    },
    select: {
        padding: "10px 12px",
        fontSize: "1rem",
        borderRadius: 6,
        border: "1px solid #ccc",
        width: "100%", 
    },
    buttons: {
        gridColumn: "span 2",
        display: "flex",
        gap: 12,
    },
    button: {
        flex: 1,
        padding: "12px 0",
        fontWeight: "600",
        fontSize: "1rem",
        borderRadius: 8,
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
    },
    clearButton: {
        backgroundColor: "#6b7280",
    },
    resultsSection: {
        marginBottom: "2rem",
    },
    subtitle: {
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1rem",
        color: "#2563eb",
    },
    resultsList: {
        listStyle: "none",
        padding: 0,
    },
    resultItem: {
        padding: "8px 0",
        borderBottom: "1px solid #ddd",
    },
    mapSection: {
        height: 400,
    },
    mapContainer: {
        height: "100%",
        width: "100%",
    },
};