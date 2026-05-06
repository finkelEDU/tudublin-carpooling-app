"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function MobileMenu({ isLoggedIn, userType }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-white p-1"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#00364D] flex flex-col px-6 py-4 gap-4 z-50 border-t border-white/10">
          <Link className="nav-link text-[#B8E5ED] hover:text-[#4EA8C2]" href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link className="nav-link text-[#B8E5ED] hover:text-[#4EA8C2]" href="/search" onClick={() => setOpen(false)}>Search</Link>
          <Link className="nav-link text-[#B8E5ED] hover:text-[#4EA8C2]" href="/users" onClick={() => setOpen(false)}>Users</Link>
          <Link className="nav-link text-[#B8E5ED] hover:text-[#4EA8C2]" href="/chat" onClick={() => setOpen(false)}>Chat</Link>
          {isLoggedIn && (
            <Link className="nav-link text-[#B8E5ED] hover:text-[#4EA8C2]" href="/pools" onClick={() => setOpen(false)}>Pools</Link>
          )}
          <Link className="nav-link text-[#B8E5ED] hover:text-[#4EA8C2]" href="/rides" onClick={() => setOpen(false)}>Rides</Link>
        </div>
      )}
    </div>
  )
}
