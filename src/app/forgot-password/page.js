"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const expired = useSearchParams().get("error") === "expired"

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)
    setMessage(data.message || data.error)
  }

  return (
    <div className="max-w-sm mx-auto mt-20 px-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {expired && (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
          Your reset link has expired. Please request a new one below.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )
}
