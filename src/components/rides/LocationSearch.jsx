"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search } from "lucide-react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LocationSearch({ compact = false, onSearch }) {
  const router = useRouter()
  const geocoding = useMapsLibrary("geocoding")
  const [location, setLocation] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!geocoding) { setIsLocating(false); return }
        const geocoder = new geocoding.Geocoder()
        const { results } = await geocoder.geocode({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        })
        const components = results[0]?.address_components ?? []
        const locality = components.find(c =>
          c.types.includes("locality") || c.types.includes("postal_town")
        )?.long_name
        const label = locality ?? results[0]?.formatted_address ?? ""
        setLocation(label)
        if (onSearch) {
          onSearch({ lat: pos.coords.latitude, lng: pos.coords.longitude, label })
        }
        setIsLocating(false)
      },
      () => setIsLocating(false)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!location.trim()) return

    if (onSearch && geocoding) {
      const geocoder = new geocoding.Geocoder()
      const { results } = await geocoder.geocode({ address: location.trim() })
      if (results?.[0]) {
        const { lat, lng } = results[0].geometry.location
        onSearch({ lat: lat(), lng: lng(), label: location.trim() })
      }
    }

    router.push(`/rides?from=${encodeURIComponent(location.trim())}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Starting location..."
            className="h-9 pr-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={useMyLocation}
          disabled={isLocating}
          title="Use my location"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Button type="submit" size="sm" disabled={!location.trim()}>
          <Search className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <label className="text-sm font-medium">Where are you starting from?</label>
      <div className="flex gap-2">
        <Input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. Dublin City Centre"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={useMyLocation}
          disabled={isLocating}
          title="Use my location"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Button type="submit" disabled={!location.trim()}>
          Search
        </Button>
      </div>
    </form>
  )
}
