import Link from "next/link"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { LOCATIONS } from "@/lib/locations"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function Search(props) {
  const { searchParams } = await props
  const resolvedParams = await searchParams
  const selected = resolvedParams?.location || ""

  await connectDB()

  const drivers = selected
    ? await User.find({
        userType: "Driver",
        "driverInfo.0.locationArea": selected,
      }).lean()
    : []

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Find drivers</h1>
        <p className="text-sm text-muted-foreground">Search for drivers by area</p>
      </div>

      <form method="GET" className="flex gap-3">
        <select
          name="location"
          defaultValue={selected}
          className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="">Select area</option>
          {LOCATIONS.map(place => (
            <option key={place} value={place}>{place}</option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {selected && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Drivers in {selected} ({drivers.length})
          </h2>

          {drivers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No drivers available in this area.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {drivers.map(driver => (
                <li key={driver._id.toString()}>
                  <Link
                    href={`/profile/${driver.username}`}
                    className="border rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={driver.profilePic} alt={driver.username} />
                      <AvatarFallback>{driver.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{driver.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {driver.driverInfo?.[0]?.startTime || "—"} → {driver.driverInfo?.[0]?.endTime || "—"}
                      </p>
                    </div>
                    <Badge variant="secondary">Driver</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
