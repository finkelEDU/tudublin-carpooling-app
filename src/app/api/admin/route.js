import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
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

    const users = [
        { id: "u1", name: "Mickey Mouse", email: "mickey@example.com", role: "rider"},
        { id: "u2", name: "Bugs Bunny", email: "bugs@example.com", role: "driver"},
        { id: "u3", name: "Homer Simpson", email: "homer@example.com", role: "rider"},
        { id: "u4", name: "Peter Griffin", email: "peter@example.com", role: "admin"},
        { id: "u5", name: "Eric Cartman", email: "eric@example.com", role: "driver"},
    ];

    const now = Date.now();
    const audit = [
        { id: "a1", action: "Emergency report recevied", message: "New incident created from /emergency page.", level: "high", ts: now - 1000 * 60 * 12 },
        { id: "a2", action: "Trip flagged", message: "Trip - 219 marked for review due to repeated cancellations.", level: "medium", ts: now - 1000 * 60 * 55 },
        { id: "a3", action: "Role update", message: "User u4 promoted to admin.", level: "medium", ts: now - 1000 * 60 * 130 },
    ];

    return NextResponse.json(
        {
            ok: true,
            users,
            audit,
            serverTime: new Date().toISOString(),
        },
        { status: 200 }
    );
}