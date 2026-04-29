import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pool from "@/models/Pool";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const session = verifyToken(token);

  const user = await User.findById(session.id);

  if (user.userType !== "Driver") {
    return NextResponse.json({ error: "Drivers only" }, { status: 403 });
  }

  const { groupName, location, destination, time } = await req.json();

  if (!groupName || !location || !destination || !time) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  await Pool.create({
    groupName,
    location,
    destination,
    time: new Date(time),
    driver: user._id,
    members: []
  });

  return NextResponse.json({ success: true });
}