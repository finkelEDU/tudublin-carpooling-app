import "./globals.css";
import "leaflet/dist/leaflet.css";
import { createClient } from '@/lib/supabase/server'
import { connectDB } from "@/lib/db"
import User from "@/models/User";
import { Inter } from 'next/font/google'
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
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

  //plain objects to be passed to client components from here, mongo will not support request in this format
{/*
   if (authUser) {
    await connectDB();
    user = await User.findOne({ supabase_id: authUser.id}).lean()
  }
*/}

  if (authUser){
    await connectDB();
    const mongoUser = await User.findOne( { supabase_id: authUser.id })
    .lean()
    //spread mongo user which grabs user and add _id tag
    if (mongoUser) {
      user = { ...mongoUser, _id:mongoUser._id.toString() }
    }
  }
  
  return(
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar user={user} />
          <Toaster />
          <main>
            {children}
          </main>
          <footer>
            <p>Copyright - 2025 TU Dublin Carpooling</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}