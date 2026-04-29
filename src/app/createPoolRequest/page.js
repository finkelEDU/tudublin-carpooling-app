"use client";

import { useState } from "react";
import { LOCATIONS } from "@/lib/locations";

export default function CreatePoolRequest() {
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/poolRequest/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
        destination,
        time,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Request created!");
      setLocation("");
      setDestination("");
      setTime("");
      window.location.href = "/pools";
    } else {
      setMessage(data.error || "Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Create Pool Request</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Starting Point</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="">Select</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Time</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create Request</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}