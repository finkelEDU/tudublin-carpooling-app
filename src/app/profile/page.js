import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {LOCATIONS} from "@/lib/locations";

export default async function Profile(){
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const session = token ? verifyToken(token) : null;

    if(!session){
        return(
            <div>
                <h1>Not authenticated</h1>
                <p>You must login to view this page.</p>
            </div>
        );
    }

    await connectDB();
    const user = await User.findById(session.id);

    if(!user){
        return(
          <div>
            <h1>Not authenticated</h1>
          </div>  
        );
    }

    return(
        <div className="profile" style={{textAlign: "center", marginTop: "2rem"}}>
            <h1>{user.username}'s Profile</h1>

            <img
                src={user.profilePic}
                alt="Profile Picture"
                style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "10%",
                    objectFit: "cover",
                    border: "3px solid #ccc"
                }}
            />

            <form action="/api/profile/upload-picture" method="POST" encType="multipart/form-data">
                <input className="profile-form" type="file" name="profilePic" required />
                <button className="profile-form" type="submit">Upload New Profile Picture</button>
            </form>

            <h2>User Type: {user.userType}</h2>

            <h2>About Me:</h2>
            <p>{user.about}</p>

            <h2>Update About</h2>
            <form action="/api/profile/update-about" method="POST">
                <input type="text" name="about" />
                <button type="submit">Update About</button>
            </form>

            {user.userType === "Driver" && (
                <div>
                    <h2>Create Pool</h2>

                    <p><b>Area: </b> {user.driverInfo?.[0]?.locationArea || "Not available"}</p>
                    <p><b>Start Time: </b> {user.driverInfo?.[0]?.startTime || "Not available"}</p>
                    <p><b>End Time: </b> {user.driverInfo?.[0]?.endTime || "Not available"}</p>
                </div>
            )}

        {user.userType === "Driver" && (
            <div>
                <h2>Update Pool</h2>

                <form action="api/profile/update-driver-info" method="POST">
                    <div>
                        <label>Area:</label>
                        <select name="locationArea" defaultValue={user.driverInfo?.[0]?.locationArea || ""}>
                            <option value="">Select Area</option>
                            {LOCATIONS.map(place => (
                                <option key={place} value={place}>
                                    {place}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Start Time:</label>
                        <input
                            type="time"
                            name="startTime"
                        />
                    </div>

                    <div>
                        <label>End Time:</label>
                        <input
                            type="time"
                            name="endTime"
                        />
                    </div>

                    <button type="submit">Update Driver Info</button>
                </form>
            </div>
        )}

            <h2>Change Password</h2>

            <form action="/api/profile/change-password" method="POST">
            <div>
                <label>Current Password</label>
                <input type="password" name="currentPassword" required />
            </div>

            <div>
                <label>New Password</label>
                <input type="password" name="newPassword" required />
            </div>

            <div>
                <label>Confirm New Password</label>
                <input type="password" name="confirmPassword" required />
            </div>

            <button type="submit">Change Password</button>
            </form>
        </div>
    );
}