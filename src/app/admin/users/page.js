import { requireAdmin } from "@/lib/requireAdmin"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import AdminUserActions from "@/components/admin/AdminUserActions"

export default async function AdminUsersPage() {
  await requireAdmin()
  await connectDB()

  const users = await User.find().lean()
  const safeUsers = users.map((u) => ({
    _id: u._id.toString(),
    username: u.username,
    email: u.email,
    userType: u.userType,
    profilePic: u.profilePic,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-muted-foreground">{safeUsers.length} total</span>
      </div>

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
                  <td className="px-4 py-3 font-medium">{user.username}</td>
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
