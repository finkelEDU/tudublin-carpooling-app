import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req){
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if(!token){
        return NextResponse.json({error: "Not logged in"}, {status: 401});
    }

    let decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
        return NextResponse.json({error: "Invalid session"}, {status: 401});
    }

    const reviewerId = decoded.id;

    const{driverId, rating, comment} = await req.json();

    if(!driverId || !rating){
        return NextResponse.json({error: "Missing fields"}, {status: 400});
    }

    await User.updateOne(
        {_id: new mongoose.Types.ObjectId(driverId)},
        {
        $push: {
            reviews: {
                reviewer: reviewerId,
                rating,
                comment
            }
        }
    });

    return NextResponse.json({success: true});
}