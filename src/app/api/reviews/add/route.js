import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getMongoUser } from "@/lib/getMongoUser"
import mongoose from "mongoose"

export async function POST(req) {
    const reviewer = await getMongoUser()

    if (!reviewer) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 })
    }

    const { driverId, rating, comment } = await req.json()

    if (!driverId || !rating) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await connectDB()
    await User.updateOne(
        { _id: new mongoose.Types.ObjectId(driverId) },
        {
            $push: {
                reviews: {
                    reviewer: reviewer._id,
                    rating,
                    comment,
                }
            }
        }
    )

    return NextResponse.json({ success: true })
}