"use client"

import { useEffect, useState } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { Input } from "@/components/ui/input"

export default function PlacesAutocomplete({ placeholder, value, onChange }) {
  const [inputEl, setInputEl] = useState(null)
  const places = useMapsLibrary("places")

  useEffect(() => {
    if (!places || !inputEl) return

    const autocomplete = new places.Autocomplete(inputEl, {
      fields: ["name", "place_id", "address_components"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.name && place.place_id) {
        const postalCode = place.address_components
          ?.find((c) => c.types.includes("postal_code"))
          ?.long_name
        onChange({ name: place.name, placeId: place.place_id, postalCode })
      }
    })
  }, [places, inputEl, onChange])

  return (
    <Input
      ref={setInputEl}
      placeholder={placeholder}
      defaultValue={value}
    />
  )
}
