import { createClient } from '@/lib/supabase/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(req) {
  const { username, email, password, userType } = await req.json()

  if (!username || !email || !password || !userType) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, userType },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    }
  })

  if (error) return Response.json({ error: error.message }, { status: 400 })

  await connectDB()
  await User.create({
    supabase_id: data.user.id,
    email,
    username,
    userType,
  })

  return Response.json({ message: "Account created successfully" })
}

