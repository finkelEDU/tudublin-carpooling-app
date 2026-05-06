import Link from "next/link"
import { requireAdmin } from "@/lib/requireAdmin"

export default async function AdminLayout({ children }) {
  await requireAdmin()

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <nav className="flex gap-4 border-b pb-4 text-sm font-medium">
        <Link href="/admin" className="hover:text-foreground text-muted-foreground">Overview</Link>
        <Link href="/admin/users" className="hover:text-foreground text-muted-foreground">Users</Link>
        <Link href="/admin/reports" className="hover:text-foreground text-muted-foreground">Reports</Link>
      </nav>
      {children}
    </div>
  )
}
