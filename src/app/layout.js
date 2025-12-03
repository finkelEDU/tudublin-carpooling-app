import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";


export const metadata = {
  title: "TU Dublin Carpooling",
  description: "For TU Dublin students to get discounted taxis and buses",
  
};

export default function RootLayout({children}){
  return(
    <html lang="en">
      <head>
        <script async src ="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdE9eBtpoZLKMsiCyU1KcLS-CP4DYfVd8&libraries=maps,maker&v=beta"></script>
      </head>


      <body>
        <header>
          <nav>
            <Link href="/"></Link> {" "}
            <Link href="/about">Search</Link>
            <Link href="/about">Create</Link>
            <Link href="/about">Profile</Link>
            <Link href="/about">Chat</Link>
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