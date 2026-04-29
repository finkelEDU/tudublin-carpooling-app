import { connectDB } from "@/lib/db";
import PoolRequest from "@/models/PoolRequest";

export async function POST(req) {
  try {
    await connectDB();

    const { requestId } = await req.json();

    if (!requestId) {
      return new Response(JSON.stringify({ error: "Missing requestId" }), { status: 400 });
    }

    const poolRequest = await PoolRequest.findById(requestId);

    if (!poolRequest) {
      return new Response(JSON.stringify({ error: "Pool request not found" }), { status: 404 });
    }

    // Mark the request as accepted
    poolRequest.status = "accepted";
    await poolRequest.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}