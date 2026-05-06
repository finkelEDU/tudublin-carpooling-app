import { requireAdmin } from "@/lib/requireAdmin"
import { connectDB } from "@/lib/db"
import Report from "@/models/Report"
import { Card, CardContent } from "@/components/ui/card"
import ResolveReportButton from "@/components/admin/ResolveReportButton"
import AdminSearch from "@/components/admin/AdminSearch"
import Link from "next/link"
import { Suspense } from "react"

export default async function AdminReportsPage({ searchParams }) {
  await requireAdmin()
  await connectDB()

  const { q } = await searchParams
  const query = q?.toLowerCase() ?? ""

  const reports = await Report.find()
    .populate("reporter", "username")
    .populate("reportedUser", "username")
    .sort({ createdAt: -1 })
    .lean()

  const allReports = reports.map((r) => ({
    _id: r._id.toString(),
    reason: r.reason,
    comment: r.comment,
    createdAt: new Date(r.createdAt).toLocaleDateString("en-IE"),
    reporter: r.reporter?.username ?? "Unknown",
    reporterUsername: r.reporter?.username ?? null,
    reportedUser: r.reportedUser?.username ?? "Unknown",
    reportedUserUsername: r.reportedUser?.username ?? null,
  }))

  const safeReports = query
    ? allReports.filter(
        (r) =>
          r.reporter.toLowerCase().includes(query) ||
          r.reportedUser.toLowerCase().includes(query)
      )
    : allReports

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <span className="text-sm text-muted-foreground">{safeReports.length} open</span>
      </div>
      <Suspense>
        <AdminSearch placeholder="Search by username..." />
      </Suspense>

      {safeReports.length === 0 ? (
        <p className="text-muted-foreground text-sm">No open reports.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {safeReports.map((r) => (
            <Card key={r._id}>
              <CardContent className="pt-4 flex items-start justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p>
                    {r.reporterUsername ? (
                      <Link href={`/profile/${r.reporterUsername}`} className="font-medium hover:underline">{r.reporter}</Link>
                    ) : (
                      <span className="font-medium">{r.reporter}</span>
                    )}
                    <span className="text-muted-foreground"> reported </span>
                    {r.reportedUserUsername ? (
                      <Link href={`/profile/${r.reportedUserUsername}`} className="font-medium hover:underline">{r.reportedUser}</Link>
                    ) : (
                      <span className="font-medium">{r.reportedUser}</span>
                    )}
                  </p>
                  <p className="text-muted-foreground">Reason: {r.reason}</p>
                  {r.comment && <p className="text-muted-foreground">"{r.comment}"</p>}
                  <p className="text-xs text-muted-foreground">{r.createdAt}</p>
                </div>
                <ResolveReportButton reportId={r._id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
