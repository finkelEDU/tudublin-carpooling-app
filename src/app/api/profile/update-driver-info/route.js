import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function POST(req){
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if(!token){
            return Response.json({error: "Not authenticated"}, {status: 401});
        }

        const session = verifyToken(token);
        if(!session){
            return Response.json({error: "Invalid session"}, {status: 401});
        }

        await connectDB();

        const formData = await req.formData();
        const locationArea = formData.get("locationArea");
        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");

        const user = await User.findById(session.id);

        if(!user){
            return Response.json({error: "User not found"}, {status: 404});
        }

        if(user.userType !== "Driver"){
            return Response.json({error: "You are not a driver"}, {status: 403});
        }

        user.driverInfo = [
            {
                locationArea,
                startTime,
                endTime
            }
        ];

        await user.save();

        return new Response(null, {
            status: 303,
            headers: {
                Location: "/profile"
            }
        });
    }catch(error){
        console.error(error);
        return Response.json({error: "Server error"}, {status: 500});
    }
}