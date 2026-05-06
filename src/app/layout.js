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
          <footer className="border-t mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p className="font-medium">TU Dublin Carpooling</p>
              <nav className="flex gap-6">
                <a href="/rides" className="hover:text-foreground transition-colors">Rides</a>
                <a href="/pools" className="hover:text-foreground transition-colors">Pools</a>
                <a href="/about" className="hover:text-foreground transition-colors">About</a>
                <a href="/chat" className="hover:text-foreground transition-colors">Chat</a>
              </nav>
              <p>© {new Date().getFullYear()} TU Dublin</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}