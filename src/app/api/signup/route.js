import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
  const { username, email, password, userType } = await req.json()

  if (!username || !email || !password || !userType) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, userType }
    }
  })

  if (error) return Response.json({ error: error.message }, { status: 400 })

  return Response.json({ message: "Check your email to verify your account" })
}
