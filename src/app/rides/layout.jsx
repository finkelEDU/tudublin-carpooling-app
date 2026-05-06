import { MapsProvider } from "@/components/rides/MapsProvider"
import Link from "next/link"

export default function RidesLayout({ children }) {
  return (
    <MapsProvider>
      <nav className="border-b bg-card px-6 py-3 flex gap-6">
        <Link href="/rides" className="text-sm font-medium hover:text-primary transition-colors">
          Browse rides
        </Link>
        <Link href="/rides/new" className="text-sm font-medium hover:text-primary transition-colors">
          Post a ride
        </Link>
        <Link href="/rides/my-rides" className="text-sm font-medium hover:text-primary transition-colors">
          My rides
        </Link>
      </nav>
      {children}
    </MapsProvider>
  )
}
