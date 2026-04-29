import { MapsProvider } from "@/components/rides/MapsProvider"

export default function RidesLayout({ children }) {
  return (
    <MapsProvider>
      {children}
    </MapsProvider>
  )
}
