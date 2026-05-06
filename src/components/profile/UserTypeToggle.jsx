"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function UserTypeToggle({ currentType }) {
  const [userType, setUserType] = useState(currentType)
  const [loading, setLoading] = useState(false)

  const opposite = userType === "Driver" ? "Student" : "Driver"

  async function handleToggle() {
    setLoading(true)
    const res = await fetch("/api/profile/update-user-type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userType: opposite }),
    })
    setLoading(false)

    if (res.ok) {
      setUserType(opposite)
      window.location.reload()
    } else {
      const data = await res.json()
      alert(data.error || "Failed to update")
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Account type</p>
        <p className="text-sm text-muted-foreground">
          Currently registered as a <span className="font-medium text-foreground">{userType}</span>
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={handleToggle} disabled={loading}>
        {loading ? "Saving..." : `Switch to ${opposite}`}
      </Button>
    </div>
  )
}
