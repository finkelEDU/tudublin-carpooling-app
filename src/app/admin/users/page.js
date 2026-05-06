import { requireAdmin } from "@/lib/requireAdmin"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import AdminUserActions from "@/components/admin/AdminUserActions"
import AdminSearch from "@/components/admin/AdminSearch"
import { Suspense } from "react"
import Link from "next/link"

export default async function AdminUsersPage({ searchParams }) {
  await requireAdmin()
  await connectDB()

  const { q } = await searchParams
  const query = q?.toLowerCase() ?? ""

  const users = await User.find().lean()
  const allUsers = users.map((u) => ({
    _id: u._id.toString(),
    username: u.username,
    email: u.email,
    userType: u.userType,
    profilePic: u.profilePic,
  }))

  const safeUsers = query
    ? allUsers.filter(
        (u) =>
          u.username?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      )
    : allUsers

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-muted-foreground">{safeUsers.length} total</span>
      </div>
      <Suspense>
        <AdminSearch placeholder="Search by username or email..." />
      </Suspense>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeUsers.map((user) => (
                <tr key={user._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/profile/${user.username}`} className="hover:underline">{user.username}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{user.userType}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <AdminUserActions userId={user._id} currentType={user.userType} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
