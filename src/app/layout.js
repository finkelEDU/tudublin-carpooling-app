import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import logo from "../images/carpool_logo.png";


export const metadata = {
  title: "TU Dublin Carpooling",
  description: "For TU Dublin students to get discounted taxis and buses",
  
};

export default function RootLayout({children}){
  return(
    <html lang="en">
      <head>
        <Script async src ="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdE9eBtpoZLKMsiCyU1KcLS-CP4DYfVd8&libraries=maps,marker&v=beta" />
      </head>


      <body>
        <header>
          <nav>
            <Image src={logo} id="logo" alt="logo" width={100} height={80}/>
            <Link className="nav-link" href="/">Home |</Link>
            <Link className="nav-link" href="/search">Search |</Link>
            <Link className="nav-link" href="/create">Create |</Link>
            <Link className="nav-link" href="/profile">Profile |</Link>
            <Link className="nav-link" href="/chat">Chat |</Link>
            <Link className="nav-link" href="/signup">Sign Up |</Link>
            <Link id="emergency-link" href="/emergency">Emergency </Link>

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