import { createClient } from '@/lib/supabase/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
  const user = session.user

  await connectDB()

  const existing = await User.findOne({ supabase_id: user.id })
  if (!existing) {
    await User.create({
      supabase_id: user.id,
      email: user.email,
      username: user.user_metadata.username,
      userType: user.user_metadata.userType,
    })
  }

  return NextResponse.redirect(`${origin}/`)
}
