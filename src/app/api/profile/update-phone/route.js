import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getMongoUser } from "@/lib/getMongoUser"

export async function POST(req) {
  try {
    const user = await getMongoUser()
    if (!user) return NextResponse.redirect(new URL("/login", req.url), { status: 303 })

    await connectDB()

    const formData = await req.formData()
    const phone = formData.get("phone")?.trim() ?? ""

    if (phone && !/^0\d{9}$/.test(phone)) {
      return NextResponse.redirect(new URL("/profile?phoneError=invalid", req.url), { status: 303 })
    }

    await User.findByIdAndUpdate(user._id, { phone })

    return NextResponse.redirect(new URL("/profile", req.url))
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to update phone" }, { status: 500 })
  }
}
