//import connectDb from '../../../lib/connectDb';
//import Pool from '../../../models/Pool';
import {MongoClient} from "mongodb";

//const {MongoClient} = require('mongodb');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tudublin_carpool";
//let clientPromise = client.connect();

if (!url) {
    console.warn(
        "[chat route] Missing MONGODB_URI. Set it in your environment variables. Falling back will break DB operations."
    );
}

let cached = global._mongoChat;
if (!cached) cached = global._mongoChat = { client: null, promise: null };

async function getClient() {
    if (!uri) throw new Error("MONGODB_URI is not configured.");

    if (cached.client) return cached.client;

    if (!cached.promise) {
        const client = new MongoClient(uri, {
            maxPoolSize: 10,
        });
        cached.promise = client.connect().then((c) => {
            cached.client = c;
            return c;
        });
    }

    return cached.promise;
}

function json(data, { status = 200 } = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
        },
    });
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const rate = global._chatRate || (global._chatRate = new Map());

function getIP(req) {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

function rateLimitOrThrow(ip) {
    const now = Date.now();
    const r = rate.get(ip) || { count: 0, start: now };

    if (now - r.start > RATE_WINDOW_MS) {
        rate.set(ip, { count: 1, start: now });
        return;
    }

    if (r.count >= RATE_MAX) {
        const err = new Error("Too many requests");
        err.status = 429;
        throw err;
    }

    r.count += 1;
    rate.set(ip, r);
}

function ifNonEmptyString(v, max = 500) {
    return typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
}
function asInt(v) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : NaN;
}
function sanitizeText(v, max = 800) {
    if (typeof v !== "string") return "";
    return v.replace(/\s+/g, " ").trim().slice(0, max);
}

async function parseBody(req) {
    try {
        return await req.json();
    } catch {
        const err = new Error("Invalid JSON body");
        err.status = 400;
        throw err;
    }
}

export async function POST(req) {
    const ip = getIP(req);

    try {
        //await connectDb();
        rateLimitOrThrow(ip);

        const body = await parseBody(req);
        const client = new MongoClient(uri);
        const dbName = 'tudublincarpool';
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('feedback');

        const data = await req.json();
        const { user, driverName, rating, comment } = data;

        if (!user || !driverName || !comment || !rating) {
            return new Response(JSON.stringify({ data: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const action =
        body?.action ||
        (body?.rating != null || body?.comment || body?.driverName ? "submitFeedback" : null);

        if (!action) return json({ ok: false, error: "Missing action"}, { status: 400 });

        const feedbackCol = db.collection("feedback");
        const messagesCol = db.collection("messages");
        const threadsCol = db.collection("threads");

        if (action === "submitFeedback") {
            const userName = sanitizeText(body?.userName || body?.user || "Anonymous", 80);
            const driverName = sanitizeText(body?.driverName || "Unknown", 80);
            const comment = sanitizeText(body?.comment || "", 500);
            const rating = clampRating(body?.rating);

            const carpoolId = sanitizeText(body?.carpoolId || "", 64);
            const threadId = sanitizeText(body?.threadId || "", 64);
        }

        if (!Number.isFinite(rating)) {
            return json({ ok: false, error: "Invalid rating. Must be 1-5."}, { status: 400 });
        }
        if (!isNonEmptyString(driverName, 80)) {
            return json({ ok: false, error: "driverName is required" }, { status: 400 });
        }

        const doc = {
            type: "ride_feedback",
            userName,
            driverName,
            rating,
            comment,
            carpoolId: carpoolId || null,
            threadId: threadId || null,
            createdAt: new Date(),
            ipHash: hashIp(ip),
        };

        //const newPool = await Pool.create({
        //    username,
        //    driver,
        //    message,
        //});



        //return new Response(JSON.stringify({ data: 'pool created successfully', pool: newPool }), {
        //    status: 201,
        //    headers: { 'Content-Type': 'application/json' },
        //});

        const result = await collection.insertOne({
            user,
            driverName,
            rating: Number(rating),
            comment,
        });

        return new Response(
            JSON.stringify({ message: "Review submitted", id: result.insertedId }),
            {
                status: 201,
                headers: {"Content-Type": "application/json"},
            });      
        } catch (err) {
        console.error('Error submitting review:', err);
        return new Response(
            JSON.stringify({error: "Failed", message: err.message}),
        {
            status: 500,
            headers: {"Content-Type": "application/json"},
        });
    }
}

export async function GET(req) {
    try {
        const client = await getClient();
        await client.db(dbName).command({ ping: 1 });
        return json({ ok: true, status: "chat api healthy" });
    } catch (err) {
        return json({ ok: false, error: err?.message || "DB unavailable" }, { status: 500 });
    }
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function clampRating(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return NaN;
    const r = Math.round(n);
    if (r < 1 || r > 5) return NaN;
    return r;
}

function hashIp(ip) {
    let h = 2166136261;
    for (let i = 0; i < ip.length; i++) {
        h ^= ip.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
}