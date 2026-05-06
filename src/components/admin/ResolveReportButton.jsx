"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ResolveReportButton({ reportId }) {
  const [loading, setLoading] = useState(false)

  async function handleResolve() {
    setLoading(true)
    const res = await fetch("/api/admin/resolve-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId }),
    })
    setLoading(false)
    if (res.ok) window.location.reload()
    else alert("Failed to resolve report")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleResolve} disabled={loading}>
      {loading ? "Resolving..." : "Resolve"}
    </Button>
  )
}
