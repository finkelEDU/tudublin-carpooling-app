"use client"

import { useSession } from "next-auth/react"

export default function Profile() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>
  if (!session) return <p>You must be logged in to view this page.</p>

  return (
    <div>
      <h1>Profile</h1>
      <p>
        <strong>Name:</strong> {session.user.name}
      </p>
      <p>
        <strong>Email:</strong> {session.user.email}
      </p>
      <p>
        <strong>Role:</strong> {session.user.role || "user"}
      </p>
    </div>
  )
}