import Link from "next/link"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function Users() {
  await connectDB()
  const users = await User.find().lean()

  const students = users.filter(u => u.userType === "Student")
  const drivers = users.filter(u => u.userType === "Driver")

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Community</h1>
        <p className="text-sm text-muted-foreground">{users.length} member{users.length !== 1 ? "s" : ""}</p>
      </div>

      <UserSection title="Drivers" users={drivers} badge="Driver" />
      <UserSection title="Students" users={students} badge="Student" />
    </div>
  )
}

function UserSection({ title, users, badge }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        {title} ({users.length})
      </h2>
      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map(user => (
            <li key={user._id.toString()}>
              <Link
                href={`/profile/${user.username}`}
                className="border rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={user.profilePic} alt={user.username} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="flex-1 font-medium text-sm">{user.username}</span>
                <Badge variant="secondary">{badge}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
