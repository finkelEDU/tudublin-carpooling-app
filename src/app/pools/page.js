import Link from "next/link";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Pool from "@/models/Pool";
import PoolRequest from "@/models/PoolRequest";
import JoinPoolButton from "../components/JoinPoolButton";
import DriverRequestCard from "../components/DriverRequestCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default async function Pools() {
  const session = await getSession();

  await connectDB();

  let user = null;

  if (session) {
    user = await User.findOne({ supabase_id: session.id }).lean();
    if (user?._id) user._id = user._id.toString();
  }

  const userId = user?._id;

  const pools = await Pool.find()
    .populate("driver", "username")
    .populate("members", "username")
    .lean();

  const safePools = pools.map((pool) => ({
    _id: pool._id.toString(),
    groupName: pool.groupName,
    location: pool.location,
    destination: pool.destination,
    time: pool.time ? new Date(pool.time).toLocaleString("en-IE") : "N/A",
    driver: pool.driver
      ? { _id: pool.driver._id?.toString(), username: pool.driver.username }
      : null,
    members: (pool.members || []).map((m) => ({
      _id: m._id.toString(),
      username: m.username,
    })),
  }));

  const requests = await PoolRequest.find()
    .populate("student", "username")
    .lean();

  const safeRequests = requests.map((r) => ({
    _id: r._id.toString(),
    location: r.location,
    destination: r.destination,
    time: r.time ? new Date(r.time).toLocaleString("en-IE") : "N/A",
    status: r.status || "pending",
    student: {
      _id: r.student._id.toString(),
      username: r.student.username,
    },
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pool Groups</h1>
        {user?.userType === "Driver" && (
          <Button asChild>
            <Link href="/createPool">Create Pool Group</Link>
          </Button>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Pools</h2>

        {safePools.length === 0 ? (
          <p className="text-muted-foreground">No pools available.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {safePools.map((pool) => {
              const isJoined = userId
                ? pool.members.some((m) => m._id === userId)
                : false;

              return (
                <Card key={pool._id}>
                  <CardHeader>
                    <CardTitle>{pool.groupName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Driver:</span>{" "}
                      {pool.driver?.username || "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium">From:</span> {pool.location}
                    </p>
                    <p>
                      <span className="font-medium">To:</span> {pool.destination}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {pool.time}
                    </p>
                    <p>
                      <span className="font-medium">Members:</span>{" "}
                      {pool.members.length === 0
                        ? "None"
                        : pool.members.map((m) => m.username).join(", ")}
                    </p>
                  </CardContent>
                  {userId && pool.driver?._id !== userId && (
                    <CardFooter>
                      {isJoined ? (
                        <Badge variant="secondary">Joined</Badge>
                      ) : (
                        <JoinPoolButton poolId={pool._id} />
                      )}
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Student Pool Requests</h2>
          {user?.userType === "Student" && (
            <Button asChild variant="outline">
              <Link href="/createPoolRequest">Create Pool Request</Link>
            </Button>
          )}
        </div>

        {safeRequests.length === 0 ? (
          <p className="text-muted-foreground">No requests.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {safeRequests.map((r) => (
              <Card key={r._id}>
                <CardContent className="space-y-1 text-sm pt-6">
                  <p>
                    <span className="font-medium">Student:</span>{" "}
                    {r.student.username}
                  </p>
                  <p>
                    <span className="font-medium">From:</span> {r.location}
                  </p>
                  <p>
                    <span className="font-medium">To:</span> {r.destination}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {r.time}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {user?.userType === "Driver" && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Incoming Requests</h2>
          {safeRequests.length === 0 ? (
            <p className="text-muted-foreground">No requests.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {safeRequests.map((r) => (
                <DriverRequestCard key={r._id} request={r} driverId={userId} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
