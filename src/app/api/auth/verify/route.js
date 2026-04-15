import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function GET(req){
    try{
        await connectDB();

        const {searchParams} = new URL(req.url);
        const token = searchParams.get("token");

        if(!token){
            return NextResponse.json(
                {error: "Invalid"},
                {status: 400}
            );
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: {$gt: Date.now()}
        });

        if(!user){
            return NextResponse.json(
                {error: "Invalid"},
                {status: 400}
            );
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        return NextResponse.redirect(
            new URL("/login?verified=true", req.url)
        );
    }catch(error){
        console.error("Error:", error);
        return NextResponse.json(
            {error: "Server error"},
            {status: 500}
        );
    }
}