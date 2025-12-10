"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function SearchPage() {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [rideType, setRideType] = useState("car");
    const [destination, setDestination] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [results, setResults] = useState([]);

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

    const handleSearch = (e) => {
        e.preventDefault();

        const filtered = mockResultsData.filter(
            (item) =>
                item.type === rideType &&
                item.number.includes(vehicleNumber) &&
                item.destination.toLowerCase().includes(destination.toLowerCase()) &&
                item.available
        );
        setResults(filtered);
    };

    const clearSearch = () => {
        setVehicleNumber("");
        setRideType("car");
        setDestination("");
        setDateTime("");
        setResults([]);
    };

    return (
        <main style={{ padding: "1rem", maxWidth: "700px", margin: "auto" }}>
            <h1>Search For A Car Or A Bus</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="rideType">Ride Type:</label>
                    <select
                    id="rideType"
                    value={rideType}
                    onChange={(e) => setRideType(e.target.value)}
                    style={{ marginLeft: "0.5rem" }}
                    >
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                    </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="vehicleNumber">Vehicle Number:</label>
                    <input
                    type="text"
                    id="vehicleNumber"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder={'Enter ${rideType} number'}
                    style={{ marginLeft: "0.5rem" }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="destination">Destination:</label>
                    <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    style={{ marginLeft: "0.5rem" }}
                    />
                </div>

                {/* Date And Time Picker */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="dateTime">Date & Time:</label>
                    <input
                    type="datetime-local"
                    id="dateTime"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    style={{ marginLeft: "0.5rem" }}
                    />
                </div>

                <button type="submit" style={{ marginRight: "1rem"}}>
                    Search
                </button>
                <button type="button" onClick={clearSearch}>
                    Clear
                </button>
            </form>

            {/* Search Results */}
            <section style={{ marginBottom: "2rem" }}>
                <h2>Results</h2>
                {results.length === 0 ? (
                    <p>No Results Found. Please Enter Search Criteria.</p>
                ) : (
                    <ul>
                        {results.map((result) => (
                            <li key={result.id} style={{ marginBottom: "1rem" }}>
                                <strong>{result.type.toUpperCase()}</strong> #{result.number} to{" "}
                                {result.destination} - Driver: {result.driver} -{" "}
                                {result.available ? "Available" : "Not Available"}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Map Preview */}
            {results.length > 0 && (
                <section>
                    <h2>Map Preview</h2>
                    <MapContainer
                    center={results[0].coords}
                    zoom={13}
                    style={{ height: "300px", width: "100px" }}
                    >
                        <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {results.map((result) => (
                            <Marker key={result.id} position={result.coords}>
                                <Popup>
                                    {result.type.toUpperCase()} #{result.number} to {result.destination}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </section>
            )}
        </main>
    );
}