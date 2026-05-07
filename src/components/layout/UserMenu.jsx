"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sun, Moon, Laptop, LayoutDashboard, User, Car, LogOut, Shield, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserMenu({ user }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", redirect: "follow" })
    window.location.href = "/login"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.profilePic} alt={user.username} />
          <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-medium">{user.username}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/protected" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/rides/my-rides" className="flex items-center gap-2">
            <Car className="h-4 w-4" />My rides
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />About
          </Link>
        </DropdownMenuItem>
        {user.userType === "Admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />Admin
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        {mounted && (
          <>
            <div className="px-2 py-1 text-xs text-muted-foreground">Theme</div>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light" className="flex gap-2">
                <Sun size={14} /> Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="flex gap-2">
                <Moon size={14} /> Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="flex gap-2">
                <Laptop size={14} /> System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
          <LogOut className="h-4 w-4" />Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
