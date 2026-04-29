import Link from "next/link";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Pool from "@/models/Pool";
import PoolRequest from "@/models/PoolRequest";
import JoinPoolButton from "../components/JoinPoolButton";
import DriverRequestCard from "../components/DriverRequestCard";

export default async function Pools() {
  const session = await getSession();

  await connectDB();

  let user = null;

  if (session) {
    user = await User.findById(session.id).lean();
    if (user?._id) user._id = user._id.toString();
  }

  const userId = user?._id;

  // Fetch pools
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
      ? {
          _id: pool.driver._id?.toString(),
          username: pool.driver.username,
        }
      : null,
    members: (pool.members || []).map((m) => ({
      _id: m._id.toString(),
      username: m.username,
    })),
  }));

  // Fetch pool requests
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

  // Filter pools where the user is the driver
  const driverPools =
    user?.userType === "Driver"
      ? safePools.filter((p) => p.driver?._id === userId)
      : [];

  return (
    <div>
      <h1>Pool Groups</h1>

      {/* Only drivers can create pool groups */}
      {user?.userType === "Driver" && (
        <Link href="/createPool">
          <button>Create Pool Group</button>
        </Link>
      )}

      <h2>Available Pools</h2>
      {safePools.length === 0 && <p>No pools available</p>}

      <ul>
        {safePools.map((pool) => {
          const isJoined = userId
            ? pool.members.some((m) => m._id === userId)
            : false;

          return (
            <li key={pool._id} style={{ marginBottom: "1rem" }}>
              <h3>{pool.groupName}</h3>

              <p>
                <b>Driver:</b> {pool.driver?.username || "Unknown"}
              </p>

              <p>
                <b>From:</b> {pool.location}
              </p>

              <p>
                <b>To:</b> {pool.destination}
              </p>

              <p>
                <b>Time:</b> {pool.time}
              </p>

              <p>
                <b>Members:</b>{" "}
                {pool.members.length === 0
                  ? "None"
                  : pool.members.map((m) => m.username).join(", ")}
              </p>

              {/* Students can join pools they haven't joined */}
              {user?.userType === "Student" &&
                !isJoined &&
                <JoinPoolButton poolId={pool._id} />
              }

              {/* Students see "Joined" if already in pool */}
              {user?.userType === "Student" &&
                isJoined && (
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    Joined
                  </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Only students can create pool requests */}
      {user?.userType === "Student" && (
        <Link href="/createPoolRequest">
          <button>Create Pool Request</button>
        </Link>
      )}

      <h2>Student Pool Requests</h2>
      {safeRequests.length === 0 && <p>No requests</p>}

      <ul>
        {safeRequests.map((r) => (
          <li key={r._id} style={{ marginBottom: "1rem" }}>
            <p>
              <b>Student:</b> {r.student.username}
            </p>
            <p>
              <b>From:</b> {r.location}
            </p>
            <p>
              <b>To:</b> {r.destination}
            </p>
            <p>
              <b>Time:</b> {r.time}
            </p>
          </li>
        ))}
      </ul>

      {/* Only drivers see incoming requests */}
      {user?.userType === "Driver" && (
        <>
          <h2>Incoming Requests</h2>

          {safeRequests.length === 0 && <p>No requests</p>}

          {safeRequests.map((r) => (
            <DriverRequestCard
              key={r._id}
              request={r}
              driverId={user._id} // Pass driverId for accept action
            />
          ))}
        </>
      )}
    </div>
  );
}