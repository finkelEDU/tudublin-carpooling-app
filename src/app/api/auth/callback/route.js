import { createClient } from '@/lib/supabase/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  const supabase = await createClient()

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) return NextResponse.redirect(`${origin}/forgot-password?error=expired`)
    return NextResponse.redirect(`${origin}${next}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/forgot-password?error=expired`)
  }

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
      return NextResponse.redirect(`${origin}/onboarding`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
