import { connectDB } from "@/lib/db"
import User from "@/models/User"
import ReviewForm from "../../components/ReviewForm"
import ReportForm from "../../components/ReportForm"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function Profile(props) {
  const params = await props.params

  await connectDB()
  const user = await User.findOne({ username: params.id })
    .populate("reviews.reviewer", "username")
    .setOptions({ strictPopulate: false })
    .lean()

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-10">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  user._id = user._id.toString()
  user.reviews = (user.reviews ?? []).map(r => ({
    ...r,
    _id: r._id.toString(),
    reviewer: r.reviewer ? { ...r.reviewer, _id: r.reviewer._id.toString() } : null,
  }))

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 flex flex-col gap-6">

      <div className="border rounded-xl p-6 flex items-center gap-5">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profilePic} alt={user.username} />
          <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <Badge variant="secondary" className="mt-1">{user.userType}</Badge>
        </div>
      </div>

      {user.about && (
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-muted-foreground">{user.about}</p>
        </div>
      )}

      {user.userType === "Driver" && (
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Driver details</h2>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Area</p>
              <p className="font-medium">{user.driverInfo?.[0]?.locationArea || "—"}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Start time</p>
              <p className="font-medium">{user.driverInfo?.[0]?.startTime || "—"}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">End time</p>
              <p className="font-medium">{user.driverInfo?.[0]?.endTime || "—"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-xl p-5">
        <h2 className="font-semibold mb-4">
          Reviews ({user.reviews.length})
        </h2>
        {user.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {user.reviews.map((review) => (
              <li key={review._id} className="border-t pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">
                    {"⭐".repeat(review.rating)} {review.rating}/5
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && <p className="text-sm">{review.comment}</p>}
                {review.reviewer && (
                  <p className="text-xs text-muted-foreground mt-1">by {review.reviewer.username}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Add a review</h2>
        <ReviewForm driverId={user._id} />
      </div>

      <div className="border rounded-xl p-5 border-red-200">
        <h2 className="font-semibold text-red-600 mb-4">Report user</h2>
        <ReportForm reportedUserId={user._id} />
      </div>

    </div>
  )
}
