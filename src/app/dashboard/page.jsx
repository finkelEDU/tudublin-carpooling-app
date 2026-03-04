import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/dist/server/api-utils"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
    if(!session) {
        redirect("/login") // Redirect to login if not authenticated
    }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  )
}