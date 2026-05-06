import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getMongoUser } from "@/lib/getMongoUser"

export async function POST(req) {
  try {
    const user = await getMongoUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    const { userType } = await req.json()
    if (!["Student", "Driver"].includes(userType)) {
      return NextResponse.json({ error: "Invalid userType" }, { status: 400 })
    }

    await User.findByIdAndUpdate(user._id, { userType })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to update user type" }, { status: 500 })
  }
}
