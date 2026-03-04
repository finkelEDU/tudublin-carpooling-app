import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import SessionWrapper from "./SessionWrapper"
import {redirect} from 'next/navigation'
import Link from "next/link"

export default async function DashboardLayout({ children }) {
  // Server-side check
  const session = await getServerSession(authOptions)

  if (!session) {
    // User not logged in
    return (
      <div>
        <p>You must log in to access the dashboard.</p>
        <Link href="/login">Go to Login</Link>
      </div>
    )
  }

  const isPassenger = session.user.role === "user"

  return (
    <SessionWrapper>
    <div>
      <nav style={{ display: "flex", gap: "20px", padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link href="/dashboard">Dashboard Home</Link>
        <Link href="/dashboard/myRides">My Rides</Link>
        <Link href="/dashboard/createRide">Create Ride</Link>
        <Link href="/dashboard/profile">Profile</Link>
        {isPassenger && <Link href='/dashboard/browseDrivers'>Browse Drivers</Link>}
        <form method="post" action="/api/auth/signout">
          <button type="submit">Logout</button>
        </form>
      </nav>
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
    </SessionWrapper>
  )
}