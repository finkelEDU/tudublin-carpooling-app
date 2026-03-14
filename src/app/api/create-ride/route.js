import connectDb from '../../../lib/connectDb';
import Pool from '../../../models/Pool';

export async function POST(req) {
    try {
        await connectDb();

        const body = await req.json();

        const { origin, destination, date, seatsAvailable } = body;

        if (
            typeof origin !== "string" ||
            origin.trim().length < 3 ||
            origin.trim().length > 100
        ) {
            return new Response(
                JSON.stringify({ error: "Invalid origin (3-100 chars required)" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (
            typeof destination !== "string" ||
            destination.trim().length < 3 ||
            destination.trim().length > 100
        ) {
            return new Response(
                JSON.stringify({ error: "Invalid destination (3-100 chars required)" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const rideDate = new Date(date);
        if (isNaN(rideDate.getTime())) {
            return new Response(
                JSON.stringify({ error: "Invalid date format." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const seats = Number(seatsAvailable);
        if (!Number.isInteger(seats) || seats < 1 || seats > 8) {
            return new Response(
                JSON.stringify({ error: "Seats available must be an integer between 1 and 8" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const newPool = new Pool({
            origin: origin.trim(),
            destination: destination.trim(),
            originLat: body.originLat || null,
            originLng: body.originLng || null,
            destinationLat: body.destinationLat || null,
            destinationLng: body.destinationLng || null,
            seatsAvailable: seats,
            date: rideDate,
        });

        const savedPool = await newPool.save();

        return new Response(
            JSON.stringify({ message: "Ride created successfully", poolId: savedPool._id }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error creating ride:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}