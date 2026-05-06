"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function confirmBooking(bookingId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("bookings").update({ status: "confirmed" }).eq("id", bookingId)
  redirect("/protected")
}

export async function declineBooking(bookingId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("bookings").update({ status: "declined" }).eq("id", bookingId)
  redirect("/protected")
}
