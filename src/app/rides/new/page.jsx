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

export default function NewRidePage() {
  const supabase = createClient()
  const router = useRouter()

  const [origin, setOrigin] = useState("")
  const [originPlaceId, setOriginPlaceId] = useState("")
  const [originEircode, setOriginEircode] = useState("")
  const [destination, setDestination] = useState("")
  const [destinationPlaceId, setDestinationPlaceId] = useState("")
  const [destinationEircode, setDestinationEircode] = useState("")
  const [departureAt, setDepartureAt] = useState(undefined)
  const [hour, setHour] = useState("")
  const [minute, setMinute] = useState("")
  const [seatsTotal, setSeatsTotal] = useState(1)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()

    const result = rideSchema.safeParse({
      origin,
      destination,
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

    setErrors({})
    setIsPending(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("You must be logged in to post a ride")
      setIsPending(false)
      return
    }

    const { error } = await supabase.from("rides").insert({
      driver_id:            user.id,
      origin:               result.data.origin,
      destination:          result.data.destination,
      origin_place_id:      originPlaceId || null,
      origin_eircode:       originEircode || null,
      destination_place_id: destinationPlaceId || null,
      destination_eircode:  destinationEircode || null,
      departure_at:         new Date(`${format(result.data.departure_at, "yyyy-MM-dd")}T${result.data.departure_time}:00`).toISOString(),
      seats_total:          result.data.seats_total,
      seats_available:      result.data.seats_total,
      price_per_seat:       0,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Ride posted!")
      setTimeout(() => router.push("/rides"), 1500)
    }

    setIsPending(false)
  }

  return (
    <div className="flex min-h-screen items-start justify-center pt-16">
      <Toaster />
      <div className="border rounded-xl p-8 max-w-md w-full bg-card">
        <Link href="/rides" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">← Back to rides</Link>
        <h1 className="text-2xl font-bold mb-6">Post a ride</h1>

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
                <Button
                  type="button"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !departureAt && "text-muted-foreground")}
                >
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
              <select
                value={hour}
                onChange={e => setHour(e.target.value)}
                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Hour</option>
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
              <select
                value={minute}
                onChange={e => setMinute(e.target.value)}
                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm"
              >
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
              min={1}
              value={seatsTotal}
              onChange={(e) => setSeatsTotal(Number(e.target.value))}
            />
            {errors.seats_total && <p className="text-sm text-destructive">{errors.seats_total}</p>}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Post ride"}
          </Button>
        </form>
      </div>
    </div>
  )
}
