import {NextResponse} from "next/server";
import {writeFile} from "fs/promises";
import path from "path";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req){
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

    const userId = decoded.id;

    const formData = await req.formData();
    const file = formData.get("profilePic");

    if(!file){
        return NextResponse.json({error: "No file uploaded"}, {status: 400});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    
    
    await writeFile(filePath, buffer);

    await connectDB();

    await User.findByIdAndUpdate(userId, {
        profilePic: `/uploads/${fileName}`
    });

    const origin = req.nextUrl.origin;
    return NextResponse.redirect(`${origin}/profile`);
}