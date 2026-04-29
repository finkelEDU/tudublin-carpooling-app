"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function cancelRide(rideId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("rides").update({ status: "cancelled" }).eq("id", rideId).eq("driver_id", user.id)
  redirect("/rides/my-rides")
}

export async function completeRide(rideId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("rides").update({ status: "completed" }).eq("id", rideId).eq("driver_id", user.id)
  redirect(`/rides/${rideId}`)
}

export async function deleteRide(rideId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("rides").delete().eq("id", rideId).eq("driver_id", user.id)
  redirect("/rides")
}

export async function cancelBooking(bookingId, rideId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId).eq("passenger_id", user.id)
  redirect(`/rides/${rideId}`)
}

export async function bookRide(rideId, formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const seats = Math.max(1, parseInt(formData.get("seats_booked")) || 1)

  const { data: existing } = await supabase
    .from("bookings")
    .select("id, status")
    .eq("ride_id", rideId)
    .eq("passenger_id", user.id)
    .maybeSingle()

  if (existing && existing.status !== "pending" && existing.status !== "confirmed") {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "pending", seats_booked: seats })
      .eq("id", existing.id)
    if (error) throw new Error(error.message)
  } else if (!existing) {
    const { error } = await supabase
      .from("bookings")
      .insert({ ride_id: rideId, passenger_id: user.id, seats_booked: seats })
    if (error) throw new Error(error.message)
  }

  redirect(`/rides/${rideId}`)
}


export async function confirmBooking(bookingId, rideId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("bookings").update({ status: "confirmed" }).eq("id", bookingId)
  redirect(`/rides/${rideId}`)
}

export async function declineBooking(bookingId, rideId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("bookings").update({ status: "declined" }).eq("id", bookingId)
  redirect(`/rides/${rideId}`)
}
