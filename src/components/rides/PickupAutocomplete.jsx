"use client"

import { useEffect, useState } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { Input } from "@/components/ui/input"

export default function PickupAutocomplete({ placeholder, id, name = "pickup_location" }) {
  const [inputEl, setInputEl] = useState(null)
  const places = useMapsLibrary("places")

  useEffect(() => {
    if (!places || !inputEl) return
    const autocomplete = new places.Autocomplete(inputEl, {
      fields: ["name"],
    })
  }, [places, inputEl])

  return (
    <Input
      ref={setInputEl}
      id={id}
      name={name}
      type="text"
      placeholder={placeholder}
    />
  )
}
