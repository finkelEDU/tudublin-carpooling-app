import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import Pool from "@/models/Pool";

export async function POST(req){
    await connectDB();

    const{groupName, location, destination, time} = await req.json();

    if(!groupName || !location || !destination || !time){
        return NextResponse.json({error: "All fields required"}, {status: 400});
    }

    try{
        await Pool.create({
            groupName,
            location,
            destination,
            time: new Date(time)
        });

        return NextResponse.json({success: true});
    }catch(err){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}