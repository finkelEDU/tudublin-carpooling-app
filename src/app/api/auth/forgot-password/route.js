import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  const supabase = await createClient()
  const origin = req.headers.get("origin") ?? "http://localhost:3000"

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "If that email exists, a reset link has been sent." })
}
