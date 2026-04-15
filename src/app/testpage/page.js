import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

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
    const user = await User.findById(session.id).lean();

    if(!user){
        return(
          <div>
            <h1>Not authenticated</h1>
          </div>  
        );
    }

    return(
        <div style={{textAlign: "center", marginTop: "2rem"}}>
            <h1>My Profile</h1>

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

        </div>
    );
}