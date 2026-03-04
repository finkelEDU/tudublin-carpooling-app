import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { pickup, dropoff, date, role, userEmail } = await req.json()

  if (!pickup || !dropoff || !date || !role) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db()

  const ride = {
    userEmail: session.user.email,
    pickup,
    dropoff,
    role: role || 'driver',
    date: new Date(date),
    userEmail: session.user.email,
    createdAt: new Date(),
  }

  await db.collection("rides").insertOne(ride)

  return NextResponse.json({ message: "Ride created successfully" })
}


// GET rides for logged-in user
export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const client = await clientPromise
  const db = client.db()

  const rides = await db
    .collection("rides")
    .find({ userEmail: session.user.email })
    .sort({ date: 1 })
    .toArray()

  return NextResponse.json(rides)
}