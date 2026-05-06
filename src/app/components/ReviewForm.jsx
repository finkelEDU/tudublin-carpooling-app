"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ReviewForm({ driverId }) {
  async function submitReview(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const res = await fetch("/api/reviews/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driverId,
        rating: form.get("rating"),
        comment: form.get("comment"),
      }),
    })
    if (res.ok) window.location.reload()
  }

  return (
    <form onSubmit={submitReview} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="rating">Rating</Label>
        <select
          id="rating"
          name="rating"
          required
          className="border rounded-md px-3 py-2 text-sm bg-background"
        >
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{"⭐".repeat(n)} {n}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="comment">Comment</Label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Write a review..."
          rows={3}
          className="border rounded-md px-3 py-2 text-sm bg-background resize-none"
        />
      </div>
      <Button type="submit" size="sm" className="w-fit">Submit review</Button>
    </form>
  )
}
