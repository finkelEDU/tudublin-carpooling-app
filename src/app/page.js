import { createClient } from "@/lib/supabase/server"
import { connectDB } from "@/lib/db"
import Pool from "@/models/Pool"
import PoolRequest from "@/models/PoolRequest"
import { Button } from "@/components/ui/button"
import HeroSection from "./components/HeroSection"
import Link from "next/link"
import { Car, MapPin, Users } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { count } = await supabase
    .from("rides")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  await connectDB()
  const pools = await Pool.find().lean()
  const requests = await PoolRequest.find().populate("student", "username").lean()
  const safePools = JSON.parse(JSON.stringify(pools))
  const safeRequests = JSON.parse(JSON.stringify(requests))

  return (
    <div className="min-h-screen">

      <HeroSection pools={safePools} requests={safeRequests} />

      {/* Live stat */}
      <section className="border-y bg-muted/40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-center gap-3">
          <span className="text-3xl font-bold">{count ?? 0}</span>
          <span className="text-muted-foreground text-sm">
            ride{count !== 1 ? "s" : ""} available right now
          </span>
          <Button asChild size="sm" variant="ghost" className="ml-2">
            <Link href="/rides">View all →</Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step
            icon={<Car className="h-6 w-6" />}
            step="1"
            title="Post or find a ride"
            description="Drivers post their route, date, and available seats. Passengers browse and filter rides by location and date."
          />
          <Step
            icon={<Users className="h-6 w-6" />}
            step="2"
            title="Request a seat"
            description="Passengers request a seat and choose how many they need. Drivers review and accept or decline requests."
          />
          <Step
            icon={<MapPin className="h-6 w-6" />}
            step="3"
            title="Travel together"
            description="Once confirmed, both driver and passenger get the full route details. Hit the road and share the journey."
          />
        </div>
      </section>

    </div>
  )
}

function Step({ icon, step, title, description }) {
  return (
    <div className="flex flex-col items-start gap-4 p-6 border rounded-2xl">
      <div className="flex items-center justify-between w-full">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          {icon}
        </div>
        <span className="text-4xl font-bold text-muted-foreground/20">{step}</span>
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
