import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 60;
const rateLimitMap = new Map();

const commands = {
    users: ["list", "add", "update", "delete", "bulkDelete"],
    pools: ["list", "add", "update", "delete"],
    communications: ["list", "send"],
};

let users = [
    { id: "u1", name: "Mickey Mouse", email: "mickey@example.com", role: "rider"},
    { id: "u2", name: "Bugs Bunny", email: "bugs@example.com", role: "driver"},
    { id: "u3", name: "Homer Simpson", email: "homer@example.com", role: "rider"},
    { id: "u4", name: "Peter Griffin", email: "peter@example.com", role: "admin"},
    { id: "u5", name: "Eric Cartman", email: "eric@example.com", role: "driver"},
]

let pools = [
    { id: 1,  name: "Morning Commute", members: [1, 2]},
]

let communications = [
    { id: 1, message: "Welcome to the carpool app!", date: new DataTransfer().toISOString() },
]

async function parseBody(request) {
    try {
        return await request.json();
    } catch {
        throw new Error("Invalid JSON body");
    }
}

async function listUsers({ page = 1, limit = 20, search = "" }) {
    const allUsers = [
        { id: "u1", name: "Mickey Mouse", email: "mickey@example.com", role: "rider"},
        { id: "u2", name: "Bugs Bunny", email: "bugs@example.com", role: "driver"},
        { id: "u3", name: "Homer Simpson", email: "homer@example.com", role: "rider"},
        { id: "u4", name: "Peter Griffin", email: "peter@example.com", role: "admin"},
        { id: "u5", name: "Eric Cartman", email: "eric@example.com", role: "driver"},
    ];

    let filtered = allUsers;
    if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = allUsers.filter(
            (u) =>
                u.name.toLowerCase().includes(lowerSearch) ||
                u.email.toLowerCase().includes(lowerSearch)
        );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
        users: paginated,
        total: filtered.length,
        page,
        limit,
    };
}

async function handleGet(request) {
    const url = new URL(request.url);
    const path = url.pathname.split("/").filter(Boolean);
    const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    if (!rateLimit(ip)) {
        return NextResponse.json({ error: "Too many requests"}, {status: 429 });
    }

    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (path[1] === "users") {
        const page = parseInt(url.searchParams.get("page")) || 1;
        const limit = parseInt(url.searchParams.get("limit")) || 20;
        const search = url.searchParams.get("search") || "";

        try {
            const data = await listUsers({ page, limit, search });
            return NextResponse.json(data);
        } catch (e) {
            return NextResponse.json({ error: e.message }, {status: 500 });
        }
    }

    return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

async function handlePost(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await parseBody(request);

    if (body.type === "addUser") {
        if (!body.name || !body.email || !body.password) {
            return NextResponse.json({ error: "Missing Required Fields" }, { status: 400 });
        }

        console.log('Admin added user: ${body.email}');

        return NextResponse.json({ success: true, message: "User added" });
    }

    return NextResponse.json({ error: "Invalid POST request" }, { status: 400 });
}

async function handlePut(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await parseBody(request);

    if (body.type === "updateUserRole") {
        if (!body.userId || !body.role) {
            return NextResponse.json({ error: "Missing Required Fields" }, { status: 400 });
        }
        if (!["driver", "passenger", "admin"].includes(body.role)) {
            return NextResponse.json({ error: "Invalid Role" }, {status: 400 });
        }
        console.log('Admin updated user: ${body.userId} role to ${body.role}');

        return NextResponse.json({ success: true, message:  "User role updated" });
    }

    return NextResponse.json({ error: "Invalid PUT address"}, { status: 400 });
}

async function handleDelete(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await parseBody(request);

    if (body.type === "deleteUsers") {
        if (!Array.isArray(body.userIds) || !body.userIds.length === 0) {
            return NextResponse.json({ error: "No User IDs Provided" }, { status: 400 });
        }
        console.log('Admin deleted users: ${body.userIds.join(", ")}');

        return NextResponse.json({ success: true, message: '${body.userIds.length} user(s) deleted' });
    }

    return NextResponse.json({ error: "Invalid DELETE address"}, { status: 400 });
}

function checkAuth(request) {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";
    const expected = (proces.env.ADMIN_TOKEN || "").trim();

    if (!expected) {
        return NextResponse.json(
            { error: "Server misconfigured: ADMIN_TOKEN is not set." },
            { status: 500 }
        );
    }

    if (!token || token !==  expected) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null;
}

function rateLimit(ip) {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, startTime: now };
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, startTime: now });
        return true;
    }
    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    record.count++;
    rateLimitMap.set(ip, record);
    return true;
}


export async function GET(request) {
    return handleGet(request);
    const authError = checkAuth(request);
    if (authError) return NextResponse.json({ error: authError}, { status: authError.status });

    return NextResponse.json({
        ok: true,
        users,
        audit,
        serverTime: new Date().toISOString(),
    }, { status: 200 });
}

export async function POST(request) {
    return handlePost(request);
    const authError = checkAuth(request);
    if (authError) return NextResponse.json({ error: authError.error}, { status: authError.status });

    const body = await parseBody(request);
    if (!body || !body.type) return NextResponse.json({ error: "Invalid request body"}, { status: 400 });

    if (body.type === "user") {
        const { name, email } = body;
        if (!name || !email) return NextResponse.json({ error: "Missing user fields"}, { status: 400 });
        const newUser = { id: users.length + 1, name, email };
        users.push(newUser);
        return NextResponse.json(newUser, { status: 201 });
    }

    if (body.type === "pool") {
        const { name, members } = body;
        if (!name || !Array.isArray(members)) return NextResponse.json({ error: "Missing pool fields"}, { status: 400 });
        const newPool = { id: pools.length + 1, name, members };
        pools.push(newPool);
        return NextResponse.json(newPool, { status: 201 });
    }

    if (body.type === "communication") {
        const { message } = body;
        if (!message) return NextResponse.json({ error: "Missing message fields"}, { status: 400 });
        const newComm = { id: communications.length + 1, message, date: new Date().toISOString()};
        communications.push(newComm);
        return NextResponse.json(newComm, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function PUT(request) {
    return handlePut(request);
        const authError = checkAuth(request);
        if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const body = await parseBody(request);
    if (!body || !body.type) return NextResponse.json({ error: "Invalid request body"}, { status: 400 });

    if (body.type === "user") {
        const user = users.find(u => u.id === body.id);
        if (!user) return NextResponse.json({ error: "User not found"}, { status: 404 });
        user.name = body.name || user.name;
        user.email = body.email || user.email;
        return NextResponse.json(user, { status: 200 });
    }

    if (body.type === "pool") {
        const pool = pools.find(p => p.id === body.id);
        if (!pool) return NextResponse.json({ error: "Pool not found"}, { status: 404 });
        pool.name = pool.name || pool.name;
        pool.members = Array.isArray(body.members) ? body.members : pool.members;
        return NextResponse.json(pool, { status: 200 });
    }

    if (body.type === "communication") {
        const comm = communications.find(c => c.id === body.id);
        if (!comm) return NextResponse.json({ error: "Communication not found"}, { status: 404 });
        comm.message = body.message || comm.message;
        return NextResponse.json(comm, { status: 200 });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function DELETE(request) {
    return handleDelete(request);
    const authError = checkAuth(request);
    if (authError) return NextResponse.json({ error: authError.error}, { status: authError.status });

    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    const type = url.searchParams.get("type");

    if (!idParam || !type) return NextResponse.json({ error: "Missing id or type parameter" }, { status: 400 });

    const id = parseInt(idParam);

    if (body.type === "user") {
        users = users.filter(u => u.id !== id);
        return NextResponse.json({ ok: true }, { status: 204 });
    }

    if (body.type === "pool") {
        pools = pools.filter(p => p.id !== id);
        return NextResponse.json({ ok: true }, { status: 204 });
    }

    if (body.type === "communication") {
        communications = communications.filter(c => c.id !== id);
        return NextResponse.json({ ok: true }, { status: 204 });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}