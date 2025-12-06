"use client";

import { useState } from "react";

export default function SearchPage() {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [rideType, setRideType] = useState("car");
    const [destination, setDestination] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        const mockResults = [
            {id: 1, type: rideType, number: vehicleNumber, destination},
        ];
        setResults(mockResults);
    };

    return (
        <main style={{ padding: "1rem", maxWidth: "600px", margin: "auto"}}>
            <h1>Search For Either A Car Or Bus</h1>

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

                <div style={{ marginBottom: "1rem"}}>
                    <label htmlFor="vehicleNumber">Vehicle Number:</label>
                    <input
                    type="text"
                    id="vehicleNumber"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder={'Enter ${rideType} number'}
                    required
                    style={{ marginLeft: "0.5rem" }}
                    ></input>
                </div>

                <div style={{ marginBottom: "1rem"}}>
                    <label htmlFor="destination">Destination</label>
                    <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDesintation(e.target.value)}
                    placeholder="Enter destination"
                    required
                    style={{ marginLeft: "0.5rem" }}
                    ></input>
                </div>

                <button type="submit">Search</button>
            </form>

            {/* Search Results */}
            <section>
                <h2>Results</h2>
                {results.length === 0 ? (
                    <p>No Results Found. Please Enter Search Criteria.</p>
                ) : (
                    <ul>
                        {results.map((result) => (
                            <li key={result.id}>
                                {result.type.toUpperCase()} #{result.number} to {result.destination}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>        
    );
}