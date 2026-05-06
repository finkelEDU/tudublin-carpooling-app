"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const USER_TYPES = ["Student", "Driver", "Admin"]

export default function AdminUserActions({ userId, currentType }) {
  const [userType, setUserType] = useState(currentType)
  const [loading, setLoading] = useState(false)

  async function handleTypeChange(e) {
    const newType = e.target.value
    setLoading(true)
    const res = await fetch("/api/admin/change-user-type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userType: newType }),
    })
    setLoading(false)
    if (res.ok) setUserType(newType)
    else alert("Failed to update user type")
  }

  async function handleDelete() {
    if (!confirm("Delete this user? This cannot be undone.")) return
    setLoading(true)
    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
    setLoading(false)
    if (res.ok) window.location.reload()
    else alert("Failed to delete user")
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={userType}
        onChange={handleTypeChange}
        disabled={loading}
        className="border rounded-md px-2 py-1 text-sm bg-background"
      >
        {USER_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
        Delete
      </Button>
    </div>
  )
}
