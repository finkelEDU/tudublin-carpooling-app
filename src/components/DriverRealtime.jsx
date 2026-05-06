"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function DriverRealtime({ userId }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("driver-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rides" },
        (payload) => {
          if (payload.new.driver_id === userId) router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides" },
        (payload) => {
          if (payload.new.driver_id === userId) router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "rides" },
        () => { router.refresh() }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        async (payload) => {
          const { data } = await supabase
            .from("rides")
            .select("id")
            .eq("id", payload.new.ride_id)
            .eq("driver_id", userId)
            .maybeSingle()

          if (data) router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        async (payload) => {
          if (payload.new.status !== "cancelled") return

          const { data } = await supabase
            .from("rides")
            .select("origin, destination")
            .eq("id", payload.new.ride_id)
            .eq("driver_id", userId)
            .maybeSingle()

          if (data) {
            toast.error(`A passenger cancelled their booking on ${data.origin} → ${data.destination}`)
            router.refresh()
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, router])

  return null
}
