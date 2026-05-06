"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Password updated. Redirecting...")
      setTimeout(() => router.push("/login"), 1500)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 px-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Set new password</h1>
        <p className="text-sm text-muted-foreground">Enter a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            minLength={6}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>

      {message && (
        <p className={`text-sm ${message.includes("updated") ? "text-green-600" : "text-destructive"}`}>
          {message}
        </p>
      )}
    </div>
  )
}
