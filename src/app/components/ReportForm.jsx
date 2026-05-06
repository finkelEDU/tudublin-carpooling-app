"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ReportForm({ reportedUserId }) {
  const [reason, setReason] = useState("")
  const [comment, setComment] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedUser: reportedUserId, reason, comment }),
    })
    toast.success("Report submitted")
    setReason("")
    setComment("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="reason">Reason</Label>
        <select
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="">Select a reason</option>
          <option value="Inappropriate behavior">Inappropriate behavior</option>
          <option value="Spam">Spam</option>
          <option value="Unsafe driving">Unsafe driving</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="report-comment">Additional comments</Label>
        <textarea
          id="report-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe the issue..."
          rows={3}
          className="border rounded-md px-3 py-2 text-sm bg-background resize-none"
        />
      </div>
      <Button type="submit" size="sm" variant="destructive" className="w-fit">Submit report</Button>
    </form>
  )
}
