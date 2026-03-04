"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function CreateRide() {
  const { data: session} = useSession()
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickup, dropoff, date, role: "driver" }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage("Ride created successfully!")
      setPickup("")
      setDropoff("")
      setDate("")
    } else {
      setMessage(data.error || "Something went wrong")
    }
  }

  return (
    <div>
      <h1>Create a Ride</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dropoff Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Ride"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}