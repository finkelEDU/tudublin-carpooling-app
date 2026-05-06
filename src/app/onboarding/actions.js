"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function completeOnboarding(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const username = formData.get("username")?.toString().trim()
  const userType = formData.get("userType")?.toString()

  if (!username || !["Student", "Driver"].includes(userType)) {
    return { error: "Please fill in all fields" }
  }

  await connectDB()

  const takenUsername = await User.findOne({ username })
  if (takenUsername) return { error: "Username already taken" }

  await User.create({ supabase_id: user.id, email: user.email, username, userType })

  redirect("/")
}
