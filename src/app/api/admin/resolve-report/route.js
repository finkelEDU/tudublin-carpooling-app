import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Report from "@/models/Report"
import { requireAdmin } from "@/lib/requireAdmin"

export async function POST(req) {
  try {
    await requireAdmin()
    await connectDB()

    const { reportId } = await req.json()
    await Report.findByIdAndDelete(reportId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to resolve report" }, { status: 500 })
  }
}
