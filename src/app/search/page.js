import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {LOCATIONS} from "@/lib/locations";

export default async function Search(props){
    const {searchParams} = await props;
    const resolvedParams = await searchParams;
    const selected = resolvedParams?.location || "";

    await connectDB();

    const drivers = selected
        ? await User.find({
            userType: "Driver",
            "driverInfo.0.locationArea": selected
        }).lean()
        : [];

        return(
            <div className="search">
                <h1>Find Drivers by Location</h1>

                <form method="GET">
                    <select name="location" defaultValue={selected}>
                        <option value="">Select Area</option>
                        {LOCATIONS.map(place => (
                            <option key={place} value={place}>
                                {place}
                            </option>
                        ))}
                    </select>
                        
                    <button type="submit">
                        Search
                    </button>
                </form>

                {selected && (
                    <div>
                        <h2>Drivers in {selected}</h2>
                        {drivers.length === 0 && <p>No drivers available</p>}

                        <ul>
                            {drivers.map(driver => (
                                <li key={driver._id}>
                                    <a
                                        href={`/profile/${driver.username}`}
                                    >{driver.username}</a>

                                <p>
                                    <b>Start:</b>{" "}
                                    {driver.driverInfo?.[0]?.startTime || "Not Available"}
                                </p>

                                <p>
                                    <b>End:</b>{" "}
                                    {driver.driverInfo?.[0]?.endTime || "Not Available"}
                                </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
}