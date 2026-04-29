import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pool from "@/models/Pool";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const session = verifyToken(token);
  const user = await User.findById(session.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.userType !== "Student") {
    return NextResponse.json({ error: "Only students can join" }, { status: 403 });
  }

  const { poolId } = await req.json();

  console.log("JOIN REQUEST:", poolId, user._id);

  const updated = await Pool.findByIdAndUpdate(
    poolId,
    {
      $addToSet: {
        members: user._id,
      },
    },
    { new: true }
  );

  console.log("UPDATED POOL:", updated);

  return NextResponse.json({ success: true });
}