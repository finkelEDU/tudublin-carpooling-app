import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Find all rides where role is 'driver'
    const driverRides = await db
      .collection("rides")
      .find({ role: "driver" })
      .sort({ date: 1 })
      .toArray()

    return NextResponse.json(driverRides)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rides" }, { status: 500 })
  }
}