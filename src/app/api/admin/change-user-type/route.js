import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { requireAdmin } from "@/lib/requireAdmin"

export async function POST(req) {
  try {
    await requireAdmin()
    await connectDB()

    const { userId, userType } = await req.json()
    if (!["Student", "Driver", "Admin"].includes(userType)) {
      return NextResponse.json({ error: "Invalid userType" }, { status: 400 })
    }

    await User.findByIdAndUpdate(userId, { userType })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update user type" }, { status: 500 })
  }
}
