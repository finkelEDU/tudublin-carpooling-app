export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/server"
import CancelRideButton from "@/components/rides/CancelRideButton"
import CompleteRideButton from "@/components/rides/CompleteRideButton"
import { cancelRide, completeRide } from "@/app/rides/[id]/actions"

export default async function MyRidesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: rides } = await supabase
    .from("rides")
    .select("*, bookings(id, status, seats_booked)")
    .eq("driver_id", user.id)
    .order("departure_at", { ascending: true })

  const now = new Date()
  const allRides = rides ?? []
  const isSoon = (departureAt) => {
    const diff = new Date(departureAt).getTime() - now.getTime()
    return diff > 0 && diff < 24 * 60 * 60 * 1000
  }
  const upcoming = allRides.filter(r => r.status !== "cancelled" && new Date(r.departure_at) >= now)
  const past = allRides.filter(r => r.status === "cancelled" || new Date(r.departure_at) < now)

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My rides</h1>
        <Link href="/rides/new" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Post a ride
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming rides. <Link href="/rides/new" className="hover:underline">Post one →</Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {upcoming.map((ride) => {
              const pending = ride.bookings.filter(b => b.status === "pending").length
              const filled = ride.seats_total - ride.seats_available
              return (
                <li key={ride.id} className="border rounded-xl px-4 py-3 bg-card hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/rides/${ride.id}`} className="flex-1 min-w-0">
                      <p className="font-medium">
                        {ride.origin}{ride.origin_eircode ? ` · ${ride.origin_eircode}` : ""} → {ride.destination}{ride.destination_eircode ? ` · ${ride.destination_eircode}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {format(new Date(ride.departure_at), "PPP 'at' p")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {filled} / {ride.seats_total} seats filled
                      </p>
                    </Link>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {isSoon(ride.departure_at) && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Departing soon</span>
                      )}
                      {ride.status === "full" && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Full</span>
                      )}
                      {pending > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{pending} pending</span>
                      )}
                      <CancelRideButton action={cancelRide.bind(null, ride.id)} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Past ({past.length})
          </h2>
          <ul className="flex flex-col gap-3">
            {past.map((ride) => {
              const filled = ride.seats_total - ride.seats_available
              const canComplete = ride.status === "active" || ride.status === "full"
              return (
                <li key={ride.id} className={`border rounded-xl px-4 py-3 bg-card ${canComplete ? "" : "opacity-50"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {ride.origin}{ride.origin_eircode ? ` · ${ride.origin_eircode}` : ""} → {ride.destination}{ride.destination_eircode ? ` · ${ride.destination_eircode}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {format(new Date(ride.departure_at), "PPP 'at' p")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {filled} / {ride.seats_total} seats filled · <span className="capitalize">{ride.status}</span>
                      </p>
                    </div>
                    {canComplete && (
                      <CompleteRideButton action={completeRide.bind(null, ride.id)} />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
