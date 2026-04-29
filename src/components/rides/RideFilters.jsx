"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function RideFilters({ defaults }) {
  const router = useRouter()
  const [from, setFrom] = useState(defaults.from)
  const [to, setTo] = useState(defaults.to)
  const [date, setDate] = useState(
    defaults.date ? new Date(defaults.date) : undefined
  )
  const [seats, setSeats] = useState(defaults.seats)
  const [calendarOpen, setCalendarOpen] = useState(false)

  function handleSearch() {
    const params = new URLSearchParams()
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    if (seats) params.set("seats", seats)
    router.push(`/rides?${params.toString()}`)
  }

  function handleClear() {
    setFrom("")
    setTo("")
    setDate(undefined)
    setSeats("")
    router.push("/rides")
  }

  const hasFilters = from || to || date || seats

  return (
    <div className="flex flex-col gap-3 mb-6 p-4 border rounded-xl bg-muted/30">
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Any date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => { setDate(d); setCalendarOpen(false) }}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          min={1}
          placeholder="Seats needed"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1">Search</Button>
        {hasFilters && (
          <Button variant="outline" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
