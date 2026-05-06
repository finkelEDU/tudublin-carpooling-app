"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function cancelBooking(bookingId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("passenger_id", user.id)

  redirect("/bookings")
}
