import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getMongoUser } from '@/lib/getMongoUser'

export async function POST(req) {
  const user = await getMongoUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('profilePic')

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.supabase_id}.${fileExt}`

  const supabase = await createClient()
  const { error: uploadError } = await supabase.storage
    .from('carpool_avatars')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 })

  const { data } = supabase.storage.from('carpool_avatars').getPublicUrl(fileName)

  await connectDB()
  await User.findByIdAndUpdate(user._id, { profilePic: data.publicUrl })

  return NextResponse.redirect(new URL('/profile', req.url), { status: 303 })
}
