"use client"

import { useEffect, useState } from "react"

export default function MyRides() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyRides() {
      const res = await fetch("/api/rides/myRides")
      if (res.ok) {
        const data = await res.json()
        setRides(data)
      }
      setLoading(false)
    }

    fetchMyRides()
  }, [])

  if (loading) return <p>Loading your rides...</p>
  if (rides.length === 0) return <p>You have no rides.</p>

  return (
    <div>
      <h1>My Rides</h1>
      <ul>
        {rides.map((ride) => (
          <li key={ride._id} style={{ marginBottom: "10px" }}>
            <strong>Pickup:</strong> {ride.pickup} |{" "}
            <strong>Dropoff:</strong> {ride.dropoff} |{" "}
            <strong>Date:</strong> {new Date(ride.date).toLocaleString()} |{" "}
            <strong>Driver:</strong> {ride.userEmail}
          </li>
        ))}
      </ul>
    </div>
  )
}