import {connectDB} from "@/lib/db";
import User from "@/models/User";

export default async function Users(){
    await connectDB();
    const users = await User.find().lean();

    const students = users.filter(u => u.userType === "Student");
    const drivers = users.filter(u => u.userType === "Driver");

    return(
        <div className="users">
        <h2>Students</h2>
        <ul>
            {students.map(user => (
                <li key={user._id}>
                    <a href={`/profile/${user.username}`}>{user.username}</a>
                </li>
            ))}
        </ul>

        <h2>Drivers</h2>
        <ul>
            {drivers.map(user => (
                <li key={user._id}>
                    <a href={`/profile/${user.username}`}>{user.username}</a>
                </li>
            ))}
        </ul>

        </div>
    );
}