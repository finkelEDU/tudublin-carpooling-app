import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getSession } from "@/lib/session";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();

    const { reportedUser, reason, comment } = body;

    const report = await Report.create({
      reportedUser,
      reporter: session.id,
      reason,
      comment,
    });

    return Response.json({ success: true, report });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}