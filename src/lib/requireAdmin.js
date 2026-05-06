import { redirect } from "next/navigation"
import { getMongoUser } from "./getMongoUser"

export async function requireAdmin() {
  const user = await getMongoUser()
  if (!user || user.userType !== "Admin") redirect("/")
  return user
}
