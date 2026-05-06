export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Car, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { confirmBooking, declineBooking } from "./actions"
import heroImg from "@/public/dashboard-hero.jpg"
import BookingsRealtime from "@/components/BookingsRealtime"
import DriverRealtime from "@/components/DriverRealtime"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await connectDB()
  const mongoUser = await User.findOne({ supabase_id: user.id }).lean()
  const isDriver = mongoUser?.userType === "Driver"
  const username = mongoUser?.username ?? null

  const now = new Date()

  const [{ data: myRides }, { data: myBookings }] = await Promise.all([
    supabase
      .from("rides")
      .select("id, origin, destination, departure_at, status")
      .eq("driver_id", user.id)
      .in("status", ["active", "full"])
      .order("departure_at", { ascending: true }),
    supabase
      .from("bookings")
      .select("id, status, ride:rides(id, origin, destination, departure_at)")
      .eq("passenger_id", user.id)
      .in("status", ["pending", "confirmed"])
      .order("created_at", { ascending: true }),
  ])

  const nextRide = myRides?.find(r => new Date(r.departure_at) >= now) ?? null

  const nextBooking = myBookings
    ?.filter(b => b.ride && new Date(b.ride.departure_at) >= now)
    .sort((a, b) => new Date(a.ride.departure_at).getTime() - new Date(b.ride.departure_at).getTime())[0] ?? null

  const isSoon = (departureAt) => {
    const diff = new Date(departureAt).getTime() - now.getTime()
    return diff > 0 && diff < 24 * 60 * 60 * 1000
  }

  const rideIds = myRides?.map(r => r.id) ?? []

  const { data: pendingBookings } = rideIds.length > 0
    ? await supabase
        .from("bookings")
        .select("id, seats_booked, passenger_id, ride:rides(id, origin, destination, departure_at)")
        .eq("status", "pending")
        .in("ride_id", rideIds)
    : { data: [] }

  const passengerIds = pendingBookings?.map(b => b.passenger_id) ?? []
  const passengerMongoUsers = passengerIds.length > 0
    ? await User.find({ supabase_id: { $in: passengerIds } }).lean()
    : []
  const passengerMap = Object.fromEntries(passengerMongoUsers.map(u => [u.supabase_id, u]))

  return (
    <div className="flex flex-col gap-8">
      <BookingsRealtime userId={user.id} />
      {isDriver && <DriverRealtime userId={user.id} />}
      <div className="relative rounded-2xl overflow-hidden min-h-[200px] flex flex-col justify-end p-6">
        <Image
          src={heroImg}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back{username ? `, ${username}` : ""}
          </h1>
          <p className="text-sm text-white/70">Here's your dashboard.</p>
        </div>
      </div>

      <div className="border rounded-xl p-5">
        <p className="text-sm font-medium mb-3">Where are you heading today?</p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/rides">Browse available rides →</Link>
        </Button>
      </div>

      {(nextRide || nextBooking) && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Next trip
          </h2>
          <div className="flex flex-col gap-4">
            {nextRide && (
              <Link
                href={`/rides/${nextRide.id}`}
                className="border rounded-xl p-5 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Driving</span>
                  {isSoon(nextRide.departure_at) && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      Departing soon
                    </span>
                  )}
                </div>
                <p className="font-semibold">{nextRide.origin}</p>
                <p className="text-muted-foreground text-sm my-1">↓</p>
                <p className="font-semibold">{nextRide.destination}</p>
                <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                  {format(new Date(nextRide.departure_at), "PPP 'at' p")}
                </p>
              </Link>
            )}
            {nextBooking?.ride && (
              <Link
                href={`/rides/${nextBooking.ride.id}`}
                className="border rounded-xl p-5 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Passenger</span>
                  {isSoon(nextBooking.ride.departure_at) && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      Departing soon
                    </span>
                  )}
                </div>
                <p className="font-semibold">{nextBooking.ride.origin}</p>
                <p className="text-muted-foreground text-sm my-1">↓</p>
                <p className="font-semibold">{nextBooking.ride.destination}</p>
                <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                  {format(new Date(nextBooking.ride.departure_at), "PPP 'at' p")}
                </p>
                <p className={`text-sm font-medium mt-2 ${nextBooking.status === "confirmed" ? "text-green-600" : "text-yellow-600"}`}>
                  {nextBooking.status === "confirmed" ? "Booking confirmed" : "Awaiting driver approval"}
                </p>
              </Link>
            )}
          </div>
        </section>
      )}

      {isDriver && pendingBookings && pendingBookings.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Pending requests ({pendingBookings.length})
          </h2>
          <ul className="flex flex-col gap-3">
            {pendingBookings.map((booking) => {
              const passenger = passengerMap[booking.passenger_id]
              const ride = booking.ride
              if (!ride) return null
              const confirmWithId = confirmBooking.bind(null, booking.id)
              const declineWithId = declineBooking.bind(null, booking.id)

              return (
                <li key={booking.id} className="border rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{passenger?.username ?? "Unknown"} wants to join</p>
                    <p className="text-sm text-muted-foreground">
                      {ride.origin} → {ride.destination} · {format(new Date(ride.departure_at), "PPP")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.seats_booked} seat{booking.seats_booked !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form action={confirmWithId}>
                      <Button size="sm">Accept</Button>
                    </form>
                    <form action={declineWithId}>
                      <Button size="sm" variant="outline">Decline</Button>
                    </form>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <SummaryCard
            title="My bookings"
            count={myBookings?.length ?? 0}
            label="active booking"
            href="/bookings"
            cta="View all bookings"
          />
          {isDriver ? (
            <SummaryCard
              title="My rides"
              count={myRides?.length ?? 0}
              label="ride posted"
              href="/rides/my-rides"
              cta="View all rides"
            />
          ) : (
            <div className="border rounded-xl p-5 flex flex-col gap-2">
              <h2 className="font-semibold">Become a driver</h2>
              <p className="text-sm text-muted-foreground">Enable driver mode in your profile to start posting rides.</p>
              <Link href="/profile" className="text-sm hover:underline mt-1">Go to profile →</Link>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/rides"
            className="flex-1 border rounded-xl p-6 flex flex-col gap-3 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-lg">Browse rides</p>
              <p className="text-sm text-muted-foreground">Find a seat on an upcoming trip</p>
            </div>
          </Link>
          <Link
            href="/rides/new"
            className="flex-1 border rounded-xl p-6 flex flex-col gap-3 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-lg">Post a ride</p>
              <p className="text-sm text-muted-foreground">Share your route and offer seats</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, count, label, href, cta }) {
  return (
    <div className="border rounded-xl p-5 flex flex-col gap-2">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm text-muted-foreground">{label}{count !== 1 ? "s" : ""}</p>
      <Button asChild variant="outline" size="sm" className="mt-1 w-full">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  )
}
