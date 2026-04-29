import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import logo from "../images/carpool_logo.png";
import {createClient} from '@/lib/supabase/server'
import {connectDB} from "@/lib/db"
import User from "@/models/User";
import connectDb from "@/lib/connectDb";
import {Inter} from 'next/font/google'
import Navbar from "@/components/layout/Navbar";
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

       <Navbar user = {user} />

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