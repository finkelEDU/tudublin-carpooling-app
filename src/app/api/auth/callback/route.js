import { createClient } from '@/lib/supabase/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const supabase = await createClient()
  const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

  if (sessionError || !session) {
    return NextResponse.redirect(`${origin}/login?error=verification_failed`)
  }

  const user = session.user

  await connectDB()

  const existing = await User.findOne({ supabase_id: user.id })
  if (!existing) {
    const username = user.user_metadata.username
    const userType = user.user_metadata.userType

    if (username && userType) {
      await User.create({ supabase_id: user.id, email: user.email, username, userType })
    } else {
      // OAuth user — no username/userType yet, send to onboarding
      return NextResponse.redirect(`${origin}/onboarding`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
