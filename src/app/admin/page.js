import { requireAdmin } from "@/lib/requireAdmin"
import { connectDB } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import User from "@/models/User"
import Pool from "@/models/Pool"
import Report from "@/models/Report"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  await requireAdmin()
  await connectDB()

  const supabase = await createClient()

  const [
    totalUsers,
    studentCount,
    driverCount,
    adminCount,
    poolCount,
    reportCount,
    { count: rideCount },
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ userType: "Student" }),
    User.countDocuments({ userType: "Driver" }),
    User.countDocuments({ userType: "Admin" }),
    Pool.countDocuments(),
    Report.countDocuments(),
    supabase.from("rides").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Total users", value: totalUsers },
    { label: "Students", value: studentCount },
    { label: "Drivers", value: driverCount },
    { label: "Admins", value: adminCount },
    { label: "Rides", value: rideCount ?? 0 },
    { label: "Pools", value: poolCount },
    { label: "Open reports", value: reportCount },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
