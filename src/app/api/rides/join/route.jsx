import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { rideId } = await req.json()
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 })

    const client = await clientPromise
    const db = client.db()

    // Prevent double-joining
    const alreadyJoined = await db.collection("joinedRides").findOne({
      rideId,
      passengerEmail: session.user.email,
    })

    if (alreadyJoined) return NextResponse.json({ error: "You already joined this ride" }, { status: 400 })

    await db.collection("joinedRides").insertOne({
      rideId,
      passengerEmail: session.user.email,
      joinedAt: new Date(),
    })

    return NextResponse.json({ message: "Successfully joined the ride" })
  } catch (err) {
    return NextResponse.json({ error: "Failed to join ride" }, { status: 500 })
  }
}