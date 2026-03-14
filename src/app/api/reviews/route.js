import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tudublin_carpool";

let cachedClient = null;

async function connectDb() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    cachedClient = client;
    return client;
}

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page")) || 1;
        const limit = parseInt(url.searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const client = await connectDb();
        const db = client.db(dbName);
        const collection = db.collection("feedback");

        const total = await collection.countDocuments();
        const reviews = await collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

        const agg = await collection.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]).toArray();
        const averageRating = agg.length > 0 ? agg[0].avgRating : 0;

        return new Response(
            JSON.stringify({
                total,
                page,
                limit,
                averageRating,
                items: reviews,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch reviews" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}