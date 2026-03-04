"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("user")

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      alert("Registration successful! Please login.")
      router.push("/login")
    } else {
      setError(data.error || "Something went wrong")
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />


        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="driver"
              checked={role === "driver"}
              onChange={(e) => setRole(e.target.value)}
            />
            Driver
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name="role"
              value="passenger"
              checked={role === "passenger"}
              onChange={(e) => setRole(e.target.value)}
            />
            Passenger
          </label>
        </div>


        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}