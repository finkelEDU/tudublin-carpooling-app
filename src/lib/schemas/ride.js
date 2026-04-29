import { z } from "zod"

export const rideSchema = z.object({
  origin:         z.string().min(2, "Origin is required"),
  destination:    z.string().min(2, "Destination is required"),
  departure_at:   z.date({ error: "Departure date is required" }),
  departure_time: z.string().regex(/^\d{2}:\d{2}$/, "Departure time is required"),
  seats_total:    z.coerce.number().int().min(1, "At least 1 seat"),
})
