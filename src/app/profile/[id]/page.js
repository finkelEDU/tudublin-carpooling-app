import {connectDB} from "@/lib/db";
import User from "@/models/User";
import ReviewForm from "../../components/ReviewForm";
import ReportForm from "../../components/ReportForm";

export default async function Profile(props){
    const params = await props.params;
    const {id} = params;

    await connectDB();
    const user = await User.findOne({username: params.id}).populate("reviews.reviewer", "username").setOptions({strictPopulate: false}).lean();

    if(!user){
        return(
            <div style={{textAlign: "center", marginTop: "2rem"}}>
                <h1>User not found</h1>
            </div>
        );
    }

    user._id = user._id.toString();

    user.reviews = user.reviews?.map(r => ({
        ...r,
        _id: r._id.toString(),
        reviewer: r.reviewer ? {
            ...r.reviewer,
            _id: r.reviewer._id.toString()
        } :  null
    })) || [];

    if(!user.reviews){
        user.reviews = [];
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

            <p style={{marginTop: "1rem"}}>
                User Type: {user.userType}
            </p>



            <h2>Reviews</h2>

            <ul>
                {user.reviews.map((review) => (
                    <li key={review._id} style = {{marginBottom: "1rem "}}>
                        <strong>{review.rating} ⭐</strong>

                        {review.reviewer && (
                            <p>
                                <em>Reviewed by: {review.reviewer.username}</em>
                            </p>
                        )}
                        <p>{review.comment}</p>
                        <small>{new Date(review.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            <h2>About Me:</h2>
            <p>{user.about}</p>

            {user.userType === "Driver" && (
                <div>
                    <h2>Driver Pool</h2>

                    <p><strong>Area: </strong> {user.driverInfo?.[0]?.locationArea || "Not available"}</p>
                    <p><strong>Start Time: </strong> {user.driverInfo?.[0]?.startTime || "Not available"}</p>
                    <p><strong>End Time: </strong> {user.driverInfo?.[0]?.endTime || "Not available"}</p>
                </div>
            )}

            <div>
            <h2>Add Review</h2>

            <ReviewForm driverId={user._id} />
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h2 style={{ color: "red" }}>Report User</h2>

                <ReportForm reportedUserId={user._id} />
            </div>
        </div>
    )
}