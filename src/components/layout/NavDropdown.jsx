"use client"

import Link from "next/link"
import { ChevronDown, Search, Plus, Car, BookMarked, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NavDropdown({ isLoggedIn }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="nav-link flex items-center gap-1 outline-none text-white">
        Rides <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/rides" className="flex items-center gap-2">
            <Search className="h-4 w-4" />Browse rides
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/rides/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />Post a ride
          </Link>
        </DropdownMenuItem>
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/rides/my-rides" className="flex items-center gap-2">
                <Car className="h-4 w-4" />My rides
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/bookings" className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" />My bookings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/pools" className="flex items-center gap-2">
                <Users className="h-4 w-4" />Pools
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
