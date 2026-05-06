"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function RidesRealtime() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("rides-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rides" },
        (payload) => {
          toast.info(`New ride posted: ${payload.new.origin} → ${payload.new.destination}`)
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides" },
        () => router.refresh()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [router])

  return null
}
