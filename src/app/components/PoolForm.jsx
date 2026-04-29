"use client";

import {useState} from "react";
import {LOCATIONS} from "@/lib/locations";

export default function PoolForm(){
    const [groupName, setGroupName] = useState("");
    const [location, setLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setMessage("");

        const res = await fetch("/api/createPool", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({groupName, location, destination, time})
        });

        const data = await res.json();

        if(res.ok){
            setMessage("Pool created!");
            setGroupName("");
            setLocation("");
            setDestination("");
            setTime("");

            window.location.href = "/pools";
        }else{
            setMessage(data.error || "Something went wrong");
        }
    }

    return(
        <form onSubmit={handleSubmit} style={{marginTop: "1rem"}}>
            <div>
                <label>Group Name</label>
                <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Starting Point</label>
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                >
                    <option value="">Select Starting Point</option>
                    {LOCATIONS.map((place) => (
                        <option key={place} value={place}>
                            {place}
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
                    <option value="">Select Destination</option>
                    {LOCATIONS.map((place) => (
                        <option key={place} value={place}>
                            {place}
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

            <button type="submit" style={{marginTop: "1rem"}}>
                Create Pool
            </button>

            {message && <p>{message}</p>}
        </form>
    )
}