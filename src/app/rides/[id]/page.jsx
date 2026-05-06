export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Button } from "@/components/ui/button"
import { bookRide, cancelBooking, confirmBooking, declineBooking, deleteRide, completeRide } from "./actions"
import DeleteRideButton from "@/components/rides/DeleteRideButton"
import RouteMap from "@/components/rides/RouteMap"
import RideDetailRealtime from "@/components/RideDetailRealtime"

export default async function RideDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: ride }, { data: existingBooking }, { data: bookings }] = await Promise.all([
    supabase.from("rides").select("*").eq("id", id).single(),
    user
      ? supabase.from("bookings").select("id, status").eq("ride_id", id).eq("passenger_id", user.id).in("status", ["pending", "confirmed", "declined"]).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("bookings").select("id, status, seats_booked, passenger_id, pickup_location").eq("ride_id", id).neq("status", "cancelled").order("created_at", { ascending: true }),
  ])

  if (!ride) notFound()

  await connectDB()
  const driver = await User.findOne({ supabase_id: ride.driver_id }).lean()

  const passengerIds = bookings?.map(b => b.passenger_id) ?? []
  const passengers = passengerIds.length > 0
    ? await User.find({ supabase_id: { $in: passengerIds } }).lean()
    : []
  const passengerMap = Object.fromEntries(passengers.map(p => [p.supabase_id, p]))

  const isDriver = user?.id === ride.driver_id
  const isFull = ride.seats_available === 0
  const alreadyBooked = !!existingBooking
  const bookRideWithId = bookRide.bind(null, id)

  return (
    <div className="p-6 max-w-lg mx-auto mt-10">
      <RideDetailRealtime rideId={id} isDriver={isDriver} />
      <h1 className="text-2xl font-bold mb-1">
        {ride.origin}{ride.origin_eircode ? ` · ${ride.origin_eircode}` : ""} → {ride.destination}{ride.destination_eircode ? ` · ${ride.destination_eircode}` : ""}
      </h1>
      <p className="text-muted-foreground mb-6">
        {format(new Date(ride.departure_at), "PPP 'at' p")}
      </p>

      <div className="border rounded-xl p-5 flex flex-col gap-3 mb-6 bg-card">
        <Row label="Driver" value={driver?.username ?? "Unknown"} />
        <Row label="Seats available" value={`${ride.seats_available} of ${ride.seats_total}`} />
        <Row label="Status" value={ride.status} />
      </div>

      {ride.origin_place_id && ride.destination_place_id && (
        <div className="mb-6">
          <div className="rounded-xl overflow-hidden border">
            <RouteMap
              originPlaceId={ride.origin_place_id}
              destinationPlaceId={ride.destination_place_id}
            />
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ride.origin)}&destination=${encodeURIComponent(ride.destination)}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            Open in Google Maps ↗
          </a>
        </div>
      )}

      {!isDriver && !alreadyBooked && (
        <form action={bookRideWithId} className="flex flex-col gap-3">
          {!isFull && (
            <>
              <div className="flex items-center justify-between text-sm">
                <label htmlFor="seats_booked" className="text-muted-foreground">Seats</label>
                <select id="seats_booked" name="seats_booked" defaultValue="1" className="border rounded-md px-2 py-1 text-sm bg-background">
                  {Array.from({ length: ride.seats_available }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <label htmlFor="pickup_location" className="text-muted-foreground">Pickup location <span className="text-xs">(optional)</span></label>
                <input
                  id="pickup_location"
                  name="pickup_location"
                  type="text"
                  placeholder={`Different from ${ride.origin}?`}
                  className="border rounded-md px-3 py-1.5 text-sm bg-background"
                />
              </div>
            </>
          )}
          <Button className="w-full" disabled={isFull}>
            {isFull ? "Fully booked" : "Book this ride"}
          </Button>
        </form>
      )}

      {!isDriver && existingBooking?.status === "declined" && (
        <form action={bookRideWithId} className="flex flex-col gap-3">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm">
            <p className="font-medium text-red-800">Booking declined</p>
            <p className="text-red-700 mt-0.5">The driver declined your request. You can request again below.</p>
          </div>
          {!isFull && (
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="pickup_location_retry" className="text-muted-foreground">Pickup location <span className="text-xs">(optional)</span></label>
              <input
                id="pickup_location_retry"
                name="pickup_location"
                type="text"
                placeholder={`Different from ${ride.origin}?`}
                className="border rounded-md px-3 py-1.5 text-sm bg-background"
              />
            </div>
          )}
          <Button className="w-full" disabled={isFull}>{isFull ? "Fully booked" : "Request again"}</Button>
        </form>
      )}

      {!isDriver && existingBooking?.status === "pending" && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm">
            <p className="font-medium text-yellow-800">Booking request sent</p>
            <p className="text-yellow-700 mt-0.5">Waiting for the driver to accept your request.</p>
          </div>
          <form action={cancelBooking.bind(null, existingBooking.id, id)}>
            <Button variant="outline" className="w-full">Cancel request</Button>
          </form>
        </div>
      )}

      {!isDriver && existingBooking?.status === "confirmed" && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
            <p className="font-medium text-green-800">Booking confirmed</p>
            <p className="text-green-700 mt-0.5">The driver has accepted your request. See you on the road!</p>
          </div>
          <form action={cancelBooking.bind(null, existingBooking.id, id)}>
            <Button variant="outline" className="w-full">Cancel booking</Button>
          </form>
        </div>
      )}

      {isDriver && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Bookings ({bookings?.length ?? 0})</h2>
          {!bookings || bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {bookings.map((booking) => {
                const passenger = passengerMap[booking.passenger_id]
                return (
                  <li key={booking.id} className="border rounded-xl px-4 py-3 flex items-center justify-between gap-4 bg-card">
                    <div>
                      <p className="font-medium">{passenger?.username ?? "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.seats_booked} seat{booking.seats_booked !== 1 ? "s" : ""} · <span className="capitalize">{booking.status}</span>
                      </p>
                      {booking.pickup_location && (
                        <p className="text-sm text-muted-foreground mt-0.5">Pickup: {booking.pickup_location}</p>
                      )}
                    </div>
                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <form action={confirmBooking.bind(null, booking.id, id)}>
                          <Button size="sm">Confirm</Button>
                        </form>
                        <form action={declineBooking.bind(null, booking.id, id)}>
                          <Button size="sm" variant="outline">Decline</Button>
                        </form>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {isDriver && (
        <div className="mt-6 flex flex-col gap-3">
          {(ride.status === "active" || ride.status === "full") && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/rides/${id}/edit`}>Edit ride</Link>
            </Button>
          )}
          {(ride.status === "active" || ride.status === "full") && new Date(ride.departure_at) < new Date() && (
            <form action={completeRide.bind(null, id)}>
              <Button className="w-full" variant="outline">Mark as completed</Button>
            </form>
          )}
          <DeleteRideButton action={deleteRide.bind(null, id)} />
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  )
}
