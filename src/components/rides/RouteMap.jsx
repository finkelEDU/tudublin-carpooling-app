"use client"

import { useEffect } from "react"
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"

function RouteRenderer({ originPlaceId, destinationPlaceId }) {
  const map = useMap()
  const routesLib = useMapsLibrary("routes")

  useEffect(() => {
    if (!map || !routesLib) return

    const directionsService = new routesLib.DirectionsService()
    const directionsRenderer = new routesLib.DirectionsRenderer({ map })

    directionsService.route({
      origin: { placeId: originPlaceId },
      destination: { placeId: destinationPlaceId },
      travelMode: routesLib.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === "OK" && result) {
        directionsRenderer.setDirections(result)
      }
    })

    return () => directionsRenderer.setMap(null)
  }, [map, routesLib, originPlaceId, destinationPlaceId])

  return null
}

export default function RouteMap({ originPlaceId, destinationPlaceId }) {
  return (
    <Map
      style={{ width: "100%", height: "300px" }}
      defaultCenter={{ lat: 53.3498, lng: -6.2603 }}
      defaultZoom={7}
      gestureHandling="cooperative"
      disableDefaultUI
    >
      <RouteRenderer
        originPlaceId={originPlaceId}
        destinationPlaceId={destinationPlaceId}
      />
    </Map>
  )
}
