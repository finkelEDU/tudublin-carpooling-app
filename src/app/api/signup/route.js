import {connectDB} from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {sendVerificationEmail} from "@/lib/email";

export async function POST(req){
    try{
        await connectDB();

        const {username, email, password, userType} = await req.json();

        if(!username || !email || !password || !userType){
            return Response.json({error: "Missing fields"}, {status: 400});
        }

        //Check if user or email already exists
        const existing = await User.findOne({ $or: [{username}, {email}]});

        if(existing){
            return Response.json({error: "Username or email already taken"}, {status: 400});
        }

        //Hash password
        const hashed = await bcrypt.hash(password, 10);

        //For Email Verification
        const verificationToken = crypto.randomBytes(32).toString("hex");

        //Create user
        await User.create({
            username,
            email,
            password: hashed,
            userType,
            profilePic: undefined,
            isVerified: false,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });

        //Send Verification Email
        await sendVerificationEmail(email, verificationToken);

        return Response.json({message: "User registered successfully"});
    }catch(err){
        console.error(err);
        return Response.json({error: "Server error"}, {status: 500});
    }
}