import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import clientPromise from "@/lib/mongodb"

export async function POST(req) {
  const { name, email, password, role} = await req.json()

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db()

  const existing = await db.collection("users").findOne({ email })
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role: role ||"user",
    createdAt: new Date()
  })

  return NextResponse.json({ message: "User created successfully" })
}