"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function BrowseDrivers() {

  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
    const [message, setMessage] = useState("")

  useEffect(() => {
    async function fetchDriverRides() {
      const res = await fetch("/api/rides/drivers")
      if (res.ok) {
        const data = await res.json()
        setRides(data)
      }
      setLoading(false)
    }
    fetchDriverRides()
  }, [])

  if (loading) return <p>Loading driver rides...</p>
  if (rides.length === 0) return <p>No driver rides available.</p>
  

  //handle join ride
  async function handleJoin(rideId) {
    const res = await fetch('/api/rides/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId })
    })

    const data = await res.json()

    if (res.ok) {
        window.alert(data.message || "Successfully joined the ride!")
    } else {
        window.alert(data.error || "Failed to join the ride.")
    }
  }

  return (
    <div>
      <h1>Available Driver Rides</h1>
      <ul>
        {rides.map((ride) => (
          <li key={ride._id} style={{ marginBottom: "10px" }}>
            <strong>Pickup:</strong> {ride.pickup} |{" "}
            <strong>Dropoff:</strong> {ride.dropoff} |{" "}
            <strong>Date:</strong> {new Date(ride.date).toLocaleString()} |{" "}
            <strong>Driver:</strong> {ride.userEmail}
            <button onClick={() => handleJoin(ride._id)}>Join Ride</button>
          </li>
        ))}
      </ul>
    </div>
  )
}