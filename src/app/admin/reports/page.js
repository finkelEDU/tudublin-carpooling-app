import { requireAdmin } from "@/lib/requireAdmin"
import { connectDB } from "@/lib/db"
import Report from "@/models/Report"
import { Card, CardContent } from "@/components/ui/card"
import ResolveReportButton from "@/components/admin/ResolveReportButton"

export default async function AdminReportsPage() {
  await requireAdmin()
  await connectDB()

  const reports = await Report.find()
    .populate("reporter", "username")
    .populate("reportedUser", "username")
    .sort({ createdAt: -1 })
    .lean()

  const safeReports = reports.map((r) => ({
    _id: r._id.toString(),
    reason: r.reason,
    comment: r.comment,
    createdAt: new Date(r.createdAt).toLocaleDateString("en-IE"),
    reporter: r.reporter?.username ?? "Unknown",
    reportedUser: r.reportedUser?.username ?? "Unknown",
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <span className="text-sm text-muted-foreground">{safeReports.length} open</span>
      </div>

      {safeReports.length === 0 ? (
        <p className="text-muted-foreground text-sm">No open reports.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {safeReports.map((r) => (
            <Card key={r._id}>
              <CardContent className="pt-4 flex items-start justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">{r.reporter}</span>
                    <span className="text-muted-foreground"> reported </span>
                    <span className="font-medium">{r.reportedUser}</span>
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
