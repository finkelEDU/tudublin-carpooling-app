import { connectDB } from "@/lib/db"
import Report from "@/models/Report"
import { getMongoUser } from "@/lib/getMongoUser"

export async function POST(req) {
  try {
    await connectDB()

    const user = await getMongoUser()
    if (!user) return Response.json({ error: "Not logged in" }, { status: 401 })

    const { reportedUser, reason, comment } = await req.json()

    const report = await Report.create({
      reportedUser,
      reporter: user._id,
      reason,
      comment,
    })

    return Response.json({ success: true, report })
  } catch (err) {
    console.error(err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
