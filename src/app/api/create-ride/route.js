import { connectDb } from '../../../lib/connectDb';
import Pool from '../../../models/Pool';

export async function POST(req) {
    try {
        await connectDb();

        const data = await req.json();
        const { rideName, destination, dateTime, seatsAvailable } = data;

        if (!rideName || !destination || !dateTime || seatsAvailable === undefined) {
            return new Response(JSON.stringify({ data: 'missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const newPool = await Pool.create({
            rideName,
            destination,
            dateTime,
            seatsAvailable,
        });

        return new Response(JSON.stringify({ data: 'pool created successfully', pool: newPool }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error creating pool:', err);
        return new Response(JSON.stringify({ data: 'error creating pool', message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}