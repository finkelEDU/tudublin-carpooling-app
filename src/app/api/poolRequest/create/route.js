import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import PoolRequest from "@/models/PoolRequest"
import { getMongoUser } from "@/lib/getMongoUser"

export async function POST(req) {
  await connectDB()

  const user = await getMongoUser()
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  if (user.userType !== "Student") return NextResponse.json({ error: "Only students can create requests" }, { status: 403 })

  const { location, destination, time } = await req.json()

  if (!location || !destination || !time) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 })
  }

  await PoolRequest.create({
    student: user._id,
    location,
    destination,
    time: new Date(time),
  })

  return NextResponse.json({ success: true })
}
