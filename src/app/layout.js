import "./globals.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import logo from "../images/carpool_logo.png";


export const metadata = {
  title: "TU Dublin Carpooling",
  description: "A Community Carpool App for TU Dublin students to get discounted taxis and buses",
};

export default function RootLayout({children}){
  return(
    <html lang="en">
      <head>
        <Script async src ="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdE9eBtpoZLKMsiCyU1KcLS-CP4DYfVd8&libraries=maps,marker&v=beta" />
      </head>


      <body style={styles.body}>
        <header style={styles.header}>
          <nav style={styles.nav}>
            <Image src={logo} id="logo" alt="logo" width={100} height={80}/>
            <Link className="nav-link" href="/" style={styles.navLink}>Home |</Link>
            <Link className="nav-link" href="/search" style={styles.navLink}>Search |</Link>
            <Link className="nav-link" href="/create" style={styles.navLink}>Create |</Link>
            <Link className="nav-link" href="/profile" style={styles.navLink}>Profile |</Link>
            <Link className="nav-link" href="/chat" style={styles.navLink}>Chat |</Link>
            <Link className="nav-link" href="/signup" style={styles.navLink}>Sign Up |</Link>
            <Link className="nav-link" href="/reviews" style={styles.navLink}>Reviews |</Link>
            <Link id="emergency-link" href="/emergency" style={styles.navLink}>Emergency </Link>

            {/*If user is an admin, a link to admin page should be added to nav.
              Furthermore, a guest or normal user cannot be allowed access to admin page from typing the url*/}
          </nav>
        </header>

        <main style={styles.main}>
          {children} {/* Page Stuff is put into here */}
        </main>

        <footer>
          &copy; {new Date().getFullYear()} Copyright - 2026 TU Dublin Carpool, All rights reserved.
        </footer>
      </body>
    </html>
  );
}

const styles = {
  body: {
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    color: "#111827",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: "1rem 2rem",
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
  },
  main: {
    flex: 1,
    padding: "2rem",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  footer: {
    backgroundColor: "#2563eb",
    color: "white",
    textAlign: "center",
    padding: "1rem 0",
    fontSize: "0.9rem",
  },
};