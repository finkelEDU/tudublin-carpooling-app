import { NextResponse } from "next/server";
import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function POST(req){
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if(!token){
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const session = verifyToken(token);
        if(!session){
            return NextResponse.redirect(new URL("/login", req.url));
        }

        await connectDB();

        const formData = await req.formData();
        const about = formData.get("about");

        await User.findByIdAndUpdate(session.id, {about});

        return NextResponse.redirect(new URL("/profile", req.url));
    }catch(error){
        console.error("Error:", error);
        return NextResponse.json({error: "Failed to update about"}, {status: 500});
}
}