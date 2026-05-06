export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { cancelBooking } from "./actions"
import BookingsRealtime from "@/components/BookingsRealtime"

const STATUS_LABEL = {
  pending: "Awaiting driver",
  confirmed: "Confirmed",
  declined: "Declined by driver",
  cancelled: "Cancelled by you",
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: active }, { data: inactive }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, status, seats_booked, ride:rides(id, origin, destination, departure_at)")
      .eq("passenger_id", user.id)
      .in("status", ["pending", "confirmed"])
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("id, status, seats_booked, ride:rides(id, origin, destination, departure_at)")
      .eq("passenger_id", user.id)
      .in("status", ["declined", "cancelled"])
      .order("created_at", { ascending: false }),
  ])

  const now = Date.now()
  const isSoon = (departureAt) => {
    const diff = new Date(departureAt).getTime() - now
    return diff > 0 && diff < 24 * 60 * 60 * 1000
  }

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <BookingsRealtime userId={user.id} />
      <h1 className="text-2xl font-bold mb-8">My bookings</h1>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Active ({active?.length ?? 0})
        </h2>

        {!active?.length ? (
          <p className="text-sm text-muted-foreground">
            No active bookings.{" "}
            <Link href="/rides" className="hover:underline">Browse rides →</Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {active.map((booking) => {
              const ride = booking.ride
              if (!ride) return null

              return (
                <li key={booking.id} className="border rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                  <Link href={`/rides/${ride.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium">{ride.origin} → {ride.destination}</p>
                      {isSoon(ride.departure_at) && (
                        <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 px-2 py-0.5 rounded-full shrink-0">
                          Departing soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(ride.departure_at), "PPP 'at' p")}
                    </p>
                    <p className="text-sm mt-1">
                      {booking.seats_booked} seat{booking.seats_booked !== 1 ? "s" : ""} ·{" "}
                      <span className={booking.status === "confirmed" ? "text-green-600 font-medium" : "text-muted-foreground"}>
                        {STATUS_LABEL[booking.status]}
                      </span>
                    </p>
                  </Link>
                  <form action={cancelBooking.bind(null, booking.id)}>
                    <Button size="sm" variant="outline">Cancel</Button>
                  </form>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {!!inactive?.length && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Past ({inactive.length})
          </h2>
          <ul className="flex flex-col gap-3">
            {inactive.map((booking) => {
              const ride = booking.ride
              if (!ride) return null

              return (
                <li key={booking.id} className="border rounded-xl px-4 py-3 opacity-50">
                  <p className="font-medium">{ride.origin} → {ride.destination}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(ride.departure_at), "PPP 'at' p")}
                  </p>
                  <p className="text-sm mt-1">{STATUS_LABEL[booking.status]}</p>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
