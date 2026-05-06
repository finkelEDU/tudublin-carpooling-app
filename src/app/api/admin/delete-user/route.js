import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { requireAdmin } from "@/lib/requireAdmin"

export async function POST(req) {
  try {
    await requireAdmin()
    await connectDB()

    const { userId } = await req.json()
    await User.findByIdAndDelete(userId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
