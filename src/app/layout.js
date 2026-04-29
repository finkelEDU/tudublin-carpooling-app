import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import logo from "../images/carpool_logo.png";
import {createClient} from '@/lib/supabase/server'
import LogoutButton from "./components/LogoutButton";
import {connectDB} from "@/lib/db"
import User from "@/models/User";
import connectDb from "@/lib/connectDb";
import {Inter} from 'next/font/google'

export const metadata = {
  title: "TU Dublin Carpooling",
  description: "For TU Dublin students to get discounted taxis and buses",
  
};

//font 
  const inter = Inter( { subsets: ['latin'] });



export default async function RootLayout({children}){
  const supabase = await createClient();
  const {data: {user: authUser} } = await supabase.auth.getUser();
  let user = null

   if (authUser) {
    await connectDB();
    user = await User.findOne({ supabase_id: authUser.id}).lean()
  }
  
  return(
    <html lang="en">

      <body className={inter.className}>
        <header>
          <nav style={{padding: "1rem", background: "#eee"}}>
            {user ? (
              <div>
                Logged in as <strong>{user.username}</strong>
              </div>
            ) : (
              <div>Not logged in</div>

            )}

          </nav>


          <nav>
            <Image src={logo} id="logo" alt="logo" width={100} height={80}/>
            <Link className="nav-link" href="/">Home |</Link>
            <Link className="nav-link" href="/search">Search |</Link>
            {user && (
              <>
            <Link className="nav-link" href="/pools">Pools |</Link>
            <Link className="nav-link" href="/profile">Profile |</Link>
            </>
            )}
            <Link className="nav-link" href="/users">Users |</Link>



            {/*
            {user && (
              <Link className="nav-link" href={`/profile/${user.username}`}>Profile |</Link>
            )}
            */}

            <Link className="nav-link" href="/chat">Chat |</Link>
            
            {!user && (
              <>
            <Link className="nav-link" href="/signup">Sign Up |</Link>
            <Link className="nav-link" href="/login">Login |</Link>
            </>
            )}
            <Link id="emergency-link" href="/emergency">Emergency </Link>
            {user && (
            <LogoutButton />
            )}

            {/*If user is an admin, a link to admin page should be added to nav.
              Furthermore, a guest or normal user cannot be allowed access to admin page from typing the url*/}
          </nav>
        </header>

        <main>
          {children} {/* Page Stuff is put into here */}
        </main>

        <footer>
          <p>Copyright - 2025 TU Dublin Carpooling</p>
        </footer>

      </body>
    </html>
  );
}