import {connectDB} from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req){
    await connectDB();
    
    const {username, password} = await req.json();

    const user = await User.findOne({username});

    if(!user){
        return Response.json({error: "Invalid username or password"}, {status: 400});
    }

    if(!user.isVerified){
        return Response.json(
            {error: "Please verify email before logging in."},
            {status: 401}
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return Response.json({error: "Invalid username or password"}, {status: 400});
    }

    const token = signToken({
        id: user._id,
        username: user.username,
    });

    const res = NextResponse.json({message: "Logged in"});

    res.cookies.set(
        "session",
        token,
        {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        }
    );

    return res;
}