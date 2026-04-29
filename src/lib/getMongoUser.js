import { createClient } from '@/lib/supabase/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function getMongoUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  await connectDB()
  return User.findOne({ supabase_id: user.id })
}
