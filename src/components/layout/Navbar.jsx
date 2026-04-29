import Link from "next/link";
import Image from "next/image";
import logo from "../../images/carpool_logo.png";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";


export default function Navbar({ user }) {
  return (
    <header className="bg-[#00364D] text-white px-6 py-3">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src={logo} alt="logo" width={80} height={64} id="logo" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/search">Search</Link>
            <Link className="nav-link" href="/users">Users</Link>
            <Link className="nav-link" href="/chat">Chat</Link>
            <Link className="nav-link" href="/rides">Rides</Link>
            {user && (
              <>
                <Link className="nav-link" href="/pools">Pools</Link>
                <Link className="nav-link" href="/profile">Profile</Link>
              </>
            )}
            <Link id="emergency-link" href="/emergency">Emergency</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-[#B8E5ED]">
                Logged in as <strong>{user.username}</strong>
              </span>
              <LogoutButton />
            </>
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
        </div>

      </div>
    </header>
  );
}
