"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function RideDetailRealtime({ rideId, isDriver }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`ride-detail-${rideId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings", filter: `ride_id=eq.${rideId}` },
        (payload) => {
          if (isDriver && payload.new.status === "cancelled") {
            toast.error("A passenger cancelled their booking.")
          }
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings", filter: `ride_id=eq.${rideId}` },
        () => router.refresh()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${rideId}` },
        () => router.refresh()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [rideId, isDriver, router])

  return null
}
