import { getMongoUser } from "@/lib/getMongoUser";

export default async function Profile(){
    const user = await getMongoUser();

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