"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function RideDetailRealtime({ rideId, isDriver, bookingId }) {
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
          if (!isDriver && bookingId && payload.new.id === bookingId) {
            if (payload.new.status === "confirmed") {
              toast.success("Your booking has been confirmed!")
            } else if (payload.new.status === "declined") {
              toast.error("Your booking was declined by the driver.")
            }
          }
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings", filter: `ride_id=eq.${rideId}` },
        () => {
          if (isDriver) toast.info("New booking request received.")
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${rideId}` },
        () => router.refresh()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [rideId, isDriver, bookingId, router])

  return null
}
