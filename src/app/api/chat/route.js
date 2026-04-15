import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

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
    }catch{
        return NextResponse.json({error: "Invalid session"}, {status: 401});
    }

    const{message} = await req.json();

    if(!message || message.trim() === ""){
        return NextResponse.json({error: "Message required"}, {status: 400});
    }

    await Chat.create({
        user: decoded.id,
        message
    });

    return NextResponse.json({success: true});
}