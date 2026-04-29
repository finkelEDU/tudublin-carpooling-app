export const dynamic = "force-dynamic"

import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import RideFilters from "@/components/rides/RideFilters"

export default async function RidesPage({ searchParams }) {
  const { from, to, date, seats } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("rides")
    .select("*")
    .in("status", ["active", "full"])
    .order("departure_at", { ascending: true })

  if (from) query = query.ilike("origin", `%${from}%`)
  if (to) query = query.ilike("destination", `%${to}%`)
  if (date) {
    const start = new Date(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 1)
    query = query.gte("departure_at", start.toISOString()).lt("departure_at", end.toISOString())
  }
  if (seats) query = query.gte("seats_available", parseInt(seats))

  const { data: rides, error } = await query

  if (error) {
    return <p className="p-6 text-destructive">Failed to load rides: {error.message}</p>
  }

  const hasFilters = !!(from || to || date || seats)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Available rides</h1>
        <Link
          href="/rides/new"
          className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Post a ride
        </Link>
      </div>

      <RideFilters defaults={{ from: from ?? "", to: to ?? "", date: date ?? "", seats: seats ?? "" }} />

      {rides.length === 0 ? (
        <p className="text-muted-foreground">
          {hasFilters ? "No rides match your search." : "No rides available yet."}
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rides.map((ride) => (
            <li key={ride.id}>
              <Link
                href={`/rides/${ride.id}`}
                className="flex flex-col h-full bg-card border rounded-xl p-5 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  {ride.status === "full" ? (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Full</span>
                  ) : (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {ride.seats_available} seat{ride.seats_available !== 1 ? "s" : ""} left
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base leading-snug">
                    {ride.origin}{ride.origin_eircode ? ` · ${ride.origin_eircode}` : ""}
                  </p>
                  <p className="text-muted-foreground text-sm my-1">↓</p>
                  <p className="font-semibold text-base leading-snug">
                    {ride.destination}{ride.destination_eircode ? ` · ${ride.destination_eircode}` : ""}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                  {format(new Date(ride.departure_at), "PPP 'at' p")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
