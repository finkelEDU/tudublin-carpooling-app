import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { ObjectId } from "mongodb" // proper import

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const client = await clientPromise
    const db = client.db()

    let rides = []

    if (session.user.role === "driver") {
      // Rides created by this driver
      rides = await db.collection("rides")
        .find({ userEmail: session.user.email })
        .sort({ date: 1 })
        .toArray()
    } else {
      // Passenger: rides they joined
      const joined = await db.collection("joinedRides")
        .find({ passengerEmail: session.user.email })
        .toArray()

      // Convert rideIds to ObjectId
      const rideIds = joined.map(j => new ObjectId(j.rideId))

      rides = await db.collection("rides")
        .find({ _id: { $in: rideIds } })
        .sort({ date: 1 })
        .toArray()
    }

    return NextResponse.json(rides)
  } catch (err) {
    console.error("Error fetching my rides:", err)
    return NextResponse.json({ error: "Failed to fetch your rides" }, { status: 500 })
  }
}