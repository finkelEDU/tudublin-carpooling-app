"use client"

import { useState } from "react"
import { MapsProvider } from "@/components/rides/MapsProvider"
import LocationSearch from "@/components/rides/LocationSearch"
import MapClient from "@/app/components/MapClient"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car } from "lucide-react"

export default function HeroSection({ pools, requests }) {
  const [searchPin, setSearchPin] = useState(null)

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8">

      {/* Left column: text + search (desktop) + buttons */}
      <div className="flex-1 space-y-6 w-full">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          TU Dublin · Ride sharing & carpooling
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Split the load,<br />share the road.
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Carpooling for TU Dublin students. Post a ride or find a seat heading to or from campus.
        </p>
        {/* Search on desktop only */}
        <div className="hidden md:block">
          <MapsProvider>
            <LocationSearch onSearch={setSearchPin} />
          </MapsProvider>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button asChild size="lg" variant="outline">
            <Link href="/rides"><Car className="mr-2 h-4 w-4" />Browse all rides</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/rides/new">Post a ride</Link>
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="w-full md:flex-1 rounded-2xl overflow-hidden shadow-lg" style={{ height: "300px", isolation: "isolate" }}>
        <MapClient pools={pools} requests={requests} searchPin={searchPin} />
      </div>

      {/* Search on mobile only — sits below the map */}
      <div className="w-full md:hidden">
        <MapsProvider>
          <LocationSearch onSearch={setSearchPin} />
        </MapsProvider>
      </div>

    </section>
  )
}
