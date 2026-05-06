import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { getMongoUser } from "@/lib/getMongoUser";

export async function POST(req){
    const mongoUser = await getMongoUser();

    if (!mongoUser) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message || message.trim() === "") {
        return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    await connectDB();
    await Chat.create({
        user: mongoUser._id,
        message,
    });

    return NextResponse.json({ success: true });
}