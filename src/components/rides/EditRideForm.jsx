"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { rideSchema } from "@/lib/schemas/ride"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import PlacesAutocomplete from "@/components/rides/PlacesAutocomplete"
import { cn } from "@/lib/utils"

function parseTime(isoString) {
  const d = new Date(isoString)
  const hour = String(d.getHours()).padStart(2, "0")
  const rawMinute = d.getMinutes()
  const rounded = Math.round(rawMinute / 15) * 15
  const minute = String(rounded >= 60 ? 0 : rounded).padStart(2, "0")
  return { hour, minute }
}

export default function EditRideForm({ ride }) {
  const supabase = createClient()
  const router = useRouter()

  const { hour: initHour, minute: initMinute } = parseTime(ride.departure_at)
  const seatsBooked = ride.seats_total - ride.seats_available

  const [origin, setOrigin] = useState(ride.origin)
  const [originPlaceId, setOriginPlaceId] = useState(ride.origin_place_id ?? "")
  const [originEircode, setOriginEircode] = useState(ride.origin_eircode ?? "")
  const [destination, setDestination] = useState(ride.destination)
  const [destinationPlaceId, setDestinationPlaceId] = useState(ride.destination_place_id ?? "")
  const [destinationEircode, setDestinationEircode] = useState(ride.destination_eircode ?? "")
  const [departureAt, setDepartureAt] = useState(new Date(ride.departure_at))
  const [hour, setHour] = useState(initHour)
  const [minute, setMinute] = useState(initMinute)
  const [seatsTotal, setSeatsTotal] = useState(ride.seats_total)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()

    const result = rideSchema.safeParse({
      origin, destination,
      departure_at: departureAt,
      departure_time: hour && minute ? `${hour}:${minute}` : "",
      seats_total: seatsTotal,
    })

    if (!result.success) {
      const fieldErrors = {}
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    if (seatsTotal < seatsBooked) {
      setErrors({ seats_total: `Cannot reduce below ${seatsBooked} — seats already booked` })
      return
    }

    setErrors({})
    setIsPending(true)

    const { error } = await supabase.from("rides").update({
      origin: result.data.origin,
      destination: result.data.destination,
      origin_place_id: originPlaceId || null,
      origin_eircode: originEircode || null,
      destination_place_id: destinationPlaceId || null,
      destination_eircode: destinationEircode || null,
      departure_at: new Date(`${format(result.data.departure_at, "yyyy-MM-dd")}T${result.data.departure_time}:00`).toISOString(),
      seats_total: result.data.seats_total,
      seats_available: result.data.seats_total - seatsBooked,
    }).eq("id", ride.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Ride updated!")
      setTimeout(() => router.push(`/rides/${ride.id}`), 1000)
    }

    setIsPending(false)
  }

  return (
    <div className="flex min-h-screen items-start justify-center pt-16">
      <Toaster />
      <div className="border rounded-xl p-8 max-w-md w-full bg-white">
        <Link href={`/rides/${ride.id}`} className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
          ← Back to ride
        </Link>
        <h1 className="text-2xl font-bold mb-6">Edit ride</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>From</Label>
            <PlacesAutocomplete
              placeholder="e.g. Dublin City Centre"
              value={origin}
              onChange={({ name, placeId, postalCode }) => { setOrigin(name); setOriginPlaceId(placeId); setOriginEircode(postalCode ?? "") }}
            />
            {errors.origin && <p className="text-sm text-destructive">{errors.origin}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>To</Label>
            <PlacesAutocomplete
              placeholder="e.g. Cork City"
              value={destination}
              onChange={({ name, placeId, postalCode }) => { setDestination(name); setDestinationPlaceId(placeId); setDestinationEircode(postalCode ?? "") }}
            />
            {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Departure date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !departureAt && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureAt ? format(departureAt, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureAt}
                  onSelect={(date) => { setDepartureAt(date); setCalendarOpen(false) }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.departure_at && <p className="text-sm text-destructive">{errors.departure_at}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Departure time</Label>
            <div className="flex gap-2">
              <select value={hour} onChange={e => setHour(e.target.value)} className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm">
                <option value="">Hour</option>
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
              <select value={minute} onChange={e => setMinute(e.target.value)} className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm">
                <option value="">Min</option>
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            {errors.departure_time && <p className="text-sm text-destructive">{errors.departure_time}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Seats available</Label>
            <Input
              type="number"
              min={Math.max(1, seatsBooked)}
              value={seatsTotal}
              onChange={(e) => setSeatsTotal(Number(e.target.value))}
            />
            {seatsBooked > 0 && (
              <p className="text-xs text-muted-foreground">{seatsBooked} seat{seatsBooked !== 1 ? "s" : ""} already booked — minimum is {seatsBooked}</p>
            )}
            {errors.seats_total && <p className="text-sm text-destructive">{errors.seats_total}</p>}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  )
}
