import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EditRideForm from "@/components/rides/EditRideForm"

export default async function EditRidePage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: ride } = await supabase.from("rides").select("*").eq("id", id).eq("driver_id", user.id).single()

  if (!ride) notFound()

  return <EditRideForm ride={ride} />
}
