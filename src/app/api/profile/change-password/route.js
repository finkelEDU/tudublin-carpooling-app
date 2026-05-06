import { createClient } from "@/lib/supabase/server"

export async function POST(req) {
  try {
    const formData = await req.formData()
    const newPassword = formData.get("newPassword")
    const confirmPassword = formData.get("confirmPassword")

    if (!newPassword || !confirmPassword) {
      return Response.json({ error: "All fields required" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return Response.json({ error: "Passwords do not match" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) return Response.json({ error: error.message }, { status: 400 })

    return Response.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
