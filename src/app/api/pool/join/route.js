import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Pool from "@/models/Pool"
import { getMongoUser } from "@/lib/getMongoUser"

export async function POST(req) {
  await connectDB()

  const user = await getMongoUser()
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

  const { poolId } = await req.json()

  await Pool.findByIdAndUpdate(
    poolId,
    { $addToSet: { members: user._id } }
  )

  return NextResponse.json({ success: true })
}
