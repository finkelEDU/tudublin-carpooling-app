"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function BookingsRealtime({ userId }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("booking-status-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.new.passenger_id !== userId) return

          if (payload.new.status === "confirmed") {
            toast.success("Your booking has been accepted by the driver!")
          } else if (payload.new.status === "declined") {
            toast.error("Your booking was declined by the driver.")
          }

          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides" },
        async (payload) => {
          if (payload.new.status !== "cancelled") return

          const { data } = await supabase
            .from("bookings")
            .select("id")
            .eq("ride_id", payload.new.id)
            .eq("passenger_id", userId)
            .in("status", ["pending", "confirmed"])
            .maybeSingle()

          if (data) {
            toast.error(
              `Your ride from ${payload.new.origin} to ${payload.new.destination} has been cancelled by the driver.`
            )
            router.refresh()
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, router])

  return null
}
