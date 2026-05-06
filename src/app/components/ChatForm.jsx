"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChatForm() {
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    if (res.ok) {
      setMessage("")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message..."
        className="flex-1"
      />
      <Button type="submit" disabled={!message.trim()}>Send</Button>
    </form>
  )
}
