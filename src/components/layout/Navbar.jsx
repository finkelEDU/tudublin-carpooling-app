import Link from "next/link"
import Image from "next/image"
import logo from "../../images/carpool_logo.png"
import { Button } from "@/components/ui/button"
import UserMenu from "./UserMenu"
import MobileMenu from "./MobileMenu"

export default function Navbar({ user }) {
  return (
    <header className="relative bg-[#00364D] text-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src={logo} alt="logo" width={80} height={64} id="logo" />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/search">Search</Link>
            <Link className="nav-link" href="/users">Users</Link>
            <Link className="nav-link" href="/chat">Chat</Link>
            {user && (
              <>
                <Link className="nav-link" href="/pools">Pools</Link>
              </>
            )}
            <Link className="nav-link" href="/rides">Rides</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            //need to pass plain object that is derived from object manipulation
            // of retrieving user profile that lives in mongo db
            <UserMenu user={{ username: user.username, profilePic: user.profilePic, userType: user.userType }} />
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-[#4EA8C2] hover:bg-[#3a8fa8] text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <MobileMenu isLoggedIn={!!user} userType={user?.userType ?? null} />
        </div>
      </div>
    </header>
  )
}
